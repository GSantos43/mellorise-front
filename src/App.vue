<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAuth } from '@clerk/vue'
import { useI18n } from 'vue-i18n'
import HomePage from './pages/HomePage.vue'
import ProductPage from './pages/ProductPage.vue'
import CollectionPage from './pages/CollectionPage.vue'
import ContactPage from './pages/ContactPage.vue'
import FaqPage from './pages/FaqPage.vue'
import InstitutionalPage from './pages/InstitutionalPage.vue'
import CheckoutPage from './pages/CheckoutPage.vue'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage.vue'
import TrackOrderPage from './pages/TrackOrderPage.vue'
import AccountOrdersPage from './pages/AccountOrdersPage.vue'
import AccountAuthUnavailablePage from './pages/AccountAuthUnavailablePage.vue'
import AuthPage from './pages/AuthPage.vue'
import SiteHeader from './components/SiteHeader.vue'
import StoreFooter from './components/StoreFooter.vue'
import CartDrawer from './components/CartDrawer.vue'
import PageLoader from './components/PageLoader.vue'
import { createCheckoutSession } from './services/checkout'
import { fetchCheckoutEligibility } from './services/geo'
import { fetchProducts } from './services/products'
import { translateStaticDom } from './i18n/domTranslations'
import { translateProductTitle } from './i18n/productText'

const props = defineProps({
  clerkEnabled: {
    type: Boolean,
    default: false
  }
})

const CART_STORAGE_KEY = 'mellorise-cart-v1'
const DISCOUNT_STORAGE_KEY = 'mellorise-welcome-discount-v1'
const CHECKOUT_PATH = '/checkout'

const products = ref([])
const isLoading = ref(true)
const route = ref(window.location.pathname)
const isCartOpen = ref(false)
const cartItem = ref(null)
const activeDiscount = ref(null)
const isCheckoutLoading = ref(false)
const isCheckoutTransitionLoading = ref(false)
const isCheckoutExitConfirmVisible = ref(false)
const isPageLoading = ref(true)
const discountNotice = ref(null)
const purchaseEligibility = ref({
  allowed: true,
  countryCode: null,
  allowedCountries: ['US', 'BR'],
  reason: 'loading'
})
const { t, locale } = useI18n({ useScope: 'global' })
const authState = props.clerkEnabled
  ? useAuth()
  : {
    isLoaded: ref(true),
    isSignedIn: ref(false)
  }
const isAuthLoaded = authState.isLoaded
const isSignedIn = authState.isSignedIn
let staticTranslationFrame = 0
let staticTranslationTimeout = 0
let staticTranslationObserver = null
let pageLoaderTimer = 0
let checkoutTransitionTimer = 0
let pendingCheckoutExitPath = ''
let discountNoticeTimer = 0

const currentProduct = computed(() => {
  const slug = route.value.split('/products/')[1]
  return products.value.find((product) => String(product.handle) === slug) || products.value[0]
})

const currentPage = computed(() => {
  if (route.value.startsWith('/products/')) return 'product'
  if (route.value.startsWith('/checkout/success')) return 'checkout-success'
  if (route.value.startsWith('/checkout')) return 'checkout'
  if (route.value.startsWith('/sign-up')) return 'sign-up'
  if (route.value.startsWith('/sign-in')) return 'sign-in'
  if (route.value.startsWith('/account/orders')) return 'account-orders'
  if (route.value.startsWith('/track-order') || route.value.startsWith('/apps/track123')) return 'tracking'
  if (route.value === '/pages/contact-us' || route.value === '/pages/contact') return 'contact'
  if (route.value === '/pages/faq' || route.value === '/pages/faqs') return 'faq'
  if (route.value.startsWith('/policies/')) return 'institutional'
  if (route.value.startsWith('/collections') || route.value === '/products') return 'collection'
  return 'home'
})
const cartCount = computed(() => Math.max(0, Number(cartItem.value?.quantity || 0)))
const isPurchaseAllowed = computed(() => purchaseEligibility.value?.allowed !== false)
const hasCheckoutSession = computed(() => !props.clerkEnabled || isSignedIn.value === true)
const shouldConfirmCheckoutExit = computed(() => (
  currentPage.value === 'checkout' &&
  Boolean(cartItem.value) &&
  !isCheckoutLoading.value
))
const documentTitle = computed(() => {
  if (currentPage.value === 'product' && currentProduct.value?.title) {
    return `${translateProductTitle(currentProduct.value.title, locale.value)} | MelloRise`
  }

  const titles = {
    home: t('meta.home'),
    collection: t('meta.collection'),
    contact: t('meta.contact'),
    faq: t('meta.faq'),
    tracking: t('meta.tracking'),
    'account-orders': t('meta.accountOrders'),
    'sign-in': t('meta.signIn'),
    'sign-up': t('meta.signUp'),
    checkout: t('meta.checkout'),
    'checkout-success': t('meta.checkoutSuccess'),
    institutional: getInstitutionalTitle(),
  }

  const title = titles[currentPage.value]
  return title && title !== 'MelloRise' ? `${title} | MelloRise` : 'MelloRise'
})

function getInstitutionalTitle() {
  const policyTitles = {
    '/policies/shipping-policy': t('institutional.shipping.title'),
    '/policies/privacy-policy': t('institutional.privacy.title'),
    '/policies/terms-of-service': t('institutional.terms.title'),
    '/policies/refund-policy': t('institutional.refunds.title'),
  }

  const title = policyTitles[route.value] || t('institutional.default.title')
  return `${title} | MelloRise`
}

function updateDocumentTitle() {
  document.title = documentTitle.value
}

async function navigate(event) {
  const anchor = event.target.closest('a')
  if (!anchor) return

  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('mailto:')) return

  const url = new URL(href, window.location.origin)
  if (url.origin !== window.location.origin) return

  if (shouldConfirmCheckoutExit.value && !url.pathname.startsWith('/checkout')) {
    event.preventDefault()
    requestCheckoutExit(`${url.pathname}${url.search}${url.hash}`)
    return
  }

  if (url.pathname === '/cart') {
    event.preventDefault()
    openCart()
    return
  }

  if (href.startsWith('#')) return

  event.preventDefault()
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  route.value = window.location.pathname

  if (url.hash) {
    await nextTick()
    document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function addToCart(payload = {}) {
  if (!isPurchaseAllowed.value) return

  const product = payload.product || currentProduct.value
  if (!product) return

  const quantity = Number(payload.quantity || 1)
  cartItem.value = {
    id: product.id,
    variationId: payload.variationId,
    handle: product.handle,
    title: product.title,
    image: payload.image || product.image || product.images?.[0] || '/assets/frasco.png',
    price: Number(payload.price ?? product.price ?? 0),
    unitPrice: Number(payload.unitPrice ?? payload.price ?? product.price ?? 0),
    quantity,
    checkoutQuantity: Number(payload.checkoutQuantity || quantity),
    bundleLabel: payload.bundleLabel || `${quantity} frasco${quantity === 1 ? '' : 's'}`,
    promotion: payload.promotion
  }

  if (payload.checkoutNow) {
    navigateToCheckout()
    return
  }

  openCart()
}

function applyDiscount(discount) {
  if (!discount?.code || !discount?.email) return

  activeDiscount.value = discount
  showDiscountNotice(discount)
}

function showDiscountNotice(discount) {
  window.clearTimeout(discountNoticeTimer)
  const emailWasSent = discount.emailSent !== false
  discountNotice.value = {
    title: t(emailWasSent ? 'home.offer.sentTitle' : 'home.offer.readyTitle'),
    message: t(emailWasSent ? 'home.offer.sentMessage' : 'home.offer.readyMessage', {
      email: discount.email,
      code: discount.code
    })
  }
  discountNoticeTimer = window.setTimeout(() => {
    discountNotice.value = null
  }, 5200)
}

function closeDiscountNotice() {
  window.clearTimeout(discountNoticeTimer)
  discountNotice.value = null
}

function readSavedCartItem() {
  try {
    const savedCartItem = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || 'null')
    const quantity = Math.max(1, Number(savedCartItem?.quantity || 1))
    const price = Number(savedCartItem?.price ?? 0)

    if (!savedCartItem?.id || !savedCartItem?.title || !Number.isFinite(price)) return null

    return {
      id: savedCartItem.id,
      variationId: savedCartItem.variationId ?? null,
      handle: savedCartItem.handle || '',
      title: savedCartItem.title,
      image: savedCartItem.image || '/assets/frasco.png',
      price,
      unitPrice: Number(savedCartItem.unitPrice ?? price),
      quantity,
      checkoutQuantity: Number(savedCartItem.checkoutQuantity || quantity),
      bundleLabel: savedCartItem.bundleLabel || `${quantity} frasco${quantity === 1 ? '' : 's'}`,
      promotion: savedCartItem.promotion
    }
  } catch (error) {
    console.warn(error)
    return null
  }
}

function persistCartItem(item) {
  try {
    if (!item) {
      window.localStorage.removeItem(CART_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(item))
  } catch (error) {
    console.warn(error)
  }
}

function readSavedDiscount() {
  try {
    const discount = JSON.parse(window.localStorage.getItem(DISCOUNT_STORAGE_KEY) || 'null')

    if (!discount?.code || !discount?.email) return null

    if (discount.expiresAt && new Date(discount.expiresAt).getTime() <= Date.now()) {
      window.localStorage.removeItem(DISCOUNT_STORAGE_KEY)
      return null
    }

    return discount
  } catch (error) {
    console.warn(error)
    return null
  }
}

function persistDiscount(discount) {
  try {
    if (!discount) {
      window.localStorage.removeItem(DISCOUNT_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify(discount))
  } catch (error) {
    console.warn(error)
  }
}

function openCart() {
  isCartOpen.value = true
}

function closeCart() {
  isCartOpen.value = false
}

function showCheckoutTransition(duration = 760) {
  if (checkoutTransitionTimer) {
    window.clearTimeout(checkoutTransitionTimer)
  }

  isCheckoutTransitionLoading.value = true
  checkoutTransitionTimer = window.setTimeout(() => {
    isCheckoutTransitionLoading.value = false
  }, duration)
}

function hideCheckoutTransition() {
  if (checkoutTransitionTimer) {
    window.clearTimeout(checkoutTransitionTimer)
    checkoutTransitionTimer = 0
  }

  isCheckoutTransitionLoading.value = false
}

function getCheckoutSignInPath(targetPath = CHECKOUT_PATH) {
  return `/sign-in?redirect_url=${encodeURIComponent(targetPath)}`
}

function redirectToCheckoutSignIn(targetPath = CHECKOUT_PATH) {
  closeCart()
  hideCheckoutTransition()
  window.history.pushState({}, '', getCheckoutSignInPath(targetPath))
  route.value = window.location.pathname
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function ensureCheckoutSession(targetPath = CHECKOUT_PATH) {
  if (!props.clerkEnabled || !cartItem.value) return true
  if (!isAuthLoaded.value) {
    showCheckoutTransition(900)
    return false
  }
  if (hasCheckoutSession.value) return true

  redirectToCheckoutSignIn(targetPath)
  return false
}

function navigateToCheckout() {
  if (!cartItem.value || !isPurchaseAllowed.value) return
  closeCart()

  if (props.clerkEnabled && !isAuthLoaded.value) {
    showCheckoutTransition()
    window.history.pushState({}, '', CHECKOUT_PATH)
    route.value = window.location.pathname
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  if (!ensureCheckoutSession(CHECKOUT_PATH)) return

  showCheckoutTransition()
  window.history.pushState({}, '', CHECKOUT_PATH)
  route.value = window.location.pathname
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function requestCheckoutExit(targetPath = '/products/wondernest-heightener-gummies-2026') {
  pendingCheckoutExitPath = targetPath || '/products/wondernest-heightener-gummies-2026'
  isCheckoutExitConfirmVisible.value = true
}

function keepCheckout() {
  pendingCheckoutExitPath = ''
  isCheckoutExitConfirmVisible.value = false
}

function confirmCheckoutExit() {
  const targetPath = pendingCheckoutExitPath || '/products/wondernest-heightener-gummies-2026'
  pendingCheckoutExitPath = ''
  isCheckoutExitConfirmVisible.value = false
  window.history.pushState({}, '', targetPath)
  route.value = window.location.pathname
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handlePopState() {
  const nextPath = window.location.pathname

  if (shouldConfirmCheckoutExit.value && !nextPath.startsWith('/checkout')) {
    window.history.pushState({}, '', route.value)
    requestCheckoutExit(nextPath)
    return
  }

  route.value = nextPath
}

function handleBeforeUnload(event) {
  if (!shouldConfirmCheckoutExit.value) return

  event.preventDefault()
  event.returnValue = ''
}

function updateCartQuantity(quantity) {
  if (!cartItem.value) return
  const nextQuantity = Math.max(1, Number(quantity || 1))
  const nextPromotion = getQuantityPromotion(nextQuantity)
  const keepsSelectedBundleVariation =
    cartItem.value.variationId &&
    cartItem.value.promotion?.paidQuantity === nextQuantity

  cartItem.value = {
    ...cartItem.value,
    variationId: keepsSelectedBundleVariation ? cartItem.value.variationId : undefined,
    quantity: nextQuantity,
    checkoutQuantity: keepsSelectedBundleVariation ? 1 : nextQuantity,
    bundleLabel: nextPromotion
      ? `${nextPromotion.label} | ${nextPromotion.deliveredQuantity} frascos por pack`
      : `${nextQuantity} frasco${nextQuantity === 1 ? '' : 's'}`,
    promotion: nextPromotion
  }
}

function getQuantityPromotion(quantity) {
  if (quantity >= 3) {
    return {
      code: 'BUY_3_GET_2',
      label: 'Buy 3 Get 2 Free',
      paidQuantity: quantity,
      freeQuantity: 2,
      deliveredQuantity: quantity + 2
    }
  }

  if (quantity === 2) {
    return {
      code: 'BUY_2_GET_1',
      label: 'Buy 2 Get 1 Free',
      paidQuantity: 2,
      freeQuantity: 1,
      deliveredQuantity: 3
    }
  }

  return undefined
}

function removeCartItem() {
  cartItem.value = null
}

function shouldClearCartAfterSuccessfulCheckout() {
  if (currentPage.value !== 'checkout-success') return false

  return new URLSearchParams(window.location.search).has('session_id')
}

async function goToStripeCheckout(options = {}) {
  if (!cartItem.value || isCheckoutLoading.value || !isPurchaseAllowed.value) return
  if (!ensureCheckoutSession(CHECKOUT_PATH)) return

  isCheckoutLoading.value = true
  isCheckoutTransitionLoading.value = true

  try {
    const couponWasProvidedByCheckout = Object.prototype.hasOwnProperty.call(options, 'couponCode')

    if (!couponWasProvidedByCheckout && activeDiscount.value?.code) {
      options.couponCode = activeDiscount.value.code
      options.customerEmail = activeDiscount.value.email
    }

    const checkoutUrl = await createCheckoutSession(cartItem.value, options)
    window.location.href = checkoutUrl
  } catch (error) {
    console.error(error)
    isCheckoutLoading.value = false
    hideCheckoutTransition()
  }
}

function showPageLoader(duration = 240) {
  if (pageLoaderTimer) {
    window.clearTimeout(pageLoaderTimer)
  }

  isPageLoading.value = true
  pageLoaderTimer = window.setTimeout(() => {
    isPageLoading.value = false
  }, duration)
}

async function scheduleStaticTranslation() {
  await nextTick()

  if (staticTranslationFrame) {
    window.cancelAnimationFrame(staticTranslationFrame)
  }

  if (staticTranslationTimeout) {
    window.clearTimeout(staticTranslationTimeout)
  }

  staticTranslationFrame = window.requestAnimationFrame(() => {
    const root = document.querySelector('[data-template="vue3-store"]')
    translateStaticDom(root, locale.value)
    staticTranslationTimeout = window.setTimeout(() => {
      translateStaticDom(root, locale.value)
    }, 140)
  })
}

onMounted(async () => {
  scheduleStaticTranslation()
  if (shouldClearCartAfterSuccessfulCheckout()) {
    persistCartItem(null)
    cartItem.value = null
  } else {
    cartItem.value = readSavedCartItem()
  }
  activeDiscount.value = readSavedDiscount()
  try {
    purchaseEligibility.value = await fetchCheckoutEligibility()
  } catch (error) {
    console.warn(error)
    purchaseEligibility.value = {
      allowed: false,
      countryCode: null,
      allowedCountries: ['US', 'BR'],
      reason: 'country_unavailable'
    }
  }
  products.value = await fetchProducts({
    onUpdate: (freshProducts) => {
      products.value = freshProducts
      scheduleStaticTranslation()
    }
  })
  isLoading.value = false
  showPageLoader(260)
  scheduleStaticTranslation()

  window.addEventListener('popstate', handlePopState)
  window.addEventListener('beforeunload', handleBeforeUnload)

  staticTranslationObserver = new MutationObserver(() => {
    scheduleStaticTranslation()
  })
  staticTranslationObserver.observe(document.querySelector('[data-template="vue3-store"]'), {
    childList: true,
    subtree: true
  })
})

onUnmounted(() => {
  hideCheckoutTransition()
  document.documentElement.classList.remove('mello-checkout-loading-lock')
  window.removeEventListener('popstate', handlePopState)
  window.removeEventListener('beforeunload', handleBeforeUnload)

  if (pageLoaderTimer) {
    window.clearTimeout(pageLoaderTimer)
  }

  if (discountNoticeTimer) {
    window.clearTimeout(discountNoticeTimer)
  }

  if (staticTranslationFrame) {
    window.cancelAnimationFrame(staticTranslationFrame)
  }

  if (staticTranslationTimeout) {
    window.clearTimeout(staticTranslationTimeout)
  }

  staticTranslationObserver?.disconnect()
})

watch([route, locale], () => {
  showPageLoader(240)
}, { flush: 'sync' })

watch(isCheckoutTransitionLoading, (active) => {
  document.documentElement.classList.toggle('mello-checkout-loading-lock', active)
}, { immediate: true })

watch([route, locale, isLoading, products, currentProduct], scheduleStaticTranslation, { flush: 'post' })
watch([route, cartItem, isAuthLoaded, isSignedIn], () => {
  if (currentPage.value !== 'checkout') return
  ensureCheckoutSession()
}, { flush: 'post' })
watch(documentTitle, updateDocumentTitle, { immediate: true })
watch(cartItem, persistCartItem, { deep: true })
watch(activeDiscount, persistDiscount, { deep: true })
</script>

<template>
  <main data-template="vue3-store" :class="`mello-route-${currentPage}`" @click="navigate">
    <SiteHeader v-if="!['checkout', 'checkout-success'].includes(currentPage)" :current-route="route" :clerk-enabled="props.clerkEnabled" />
    <PageLoader :active="isPageLoading" />
    <Teleport to="body">
      <Transition name="mello-checkout-transition" appear>
        <div v-if="isCheckoutTransitionLoading" class="mello-checkout-transition" role="status" aria-live="polite" aria-busy="true">
          <div class="mello-checkout-transition__card">
            <span class="mello-checkout-transition__spinner" aria-hidden="true"></span>
            <strong>{{ t('checkoutTransition.title') }}</strong>
            <small>{{ t('checkoutTransition.text') }}</small>
          </div>
        </div>
      </Transition>
    </Teleport>
    <Teleport to="body">
      <Transition name="mello-discount-notice">
        <aside v-if="discountNotice" class="mello-discount-notice" role="status" aria-live="polite">
          <span class="mello-discount-notice__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>
          </span>
          <span class="mello-discount-notice__content">
            <strong>{{ discountNotice.title }}</strong>
            <span>{{ discountNotice.message }}</span>
          </span>
          <button class="mello-discount-notice__close" type="button" :aria-label="t('home.offer.closeNotice')" @click="closeDiscountNotice">
            <span aria-hidden="true"></span>
          </button>
        </aside>
      </Transition>
    </Teleport>
    <Teleport to="body">
      <Transition name="mello-checkout-exit" appear>
        <div
          v-if="isCheckoutExitConfirmVisible"
          class="mello-checkout-exit"
          role="dialog"
          aria-modal="true"
          :aria-label="t('checkoutExit.ariaLabel')"
        >
          <button class="mello-checkout-exit__shade" type="button" :aria-label="t('checkoutExit.keep')" @click="keepCheckout"></button>
          <section class="mello-checkout-exit__card">
            <button class="mello-checkout-exit__close" type="button" :aria-label="t('checkoutExit.keep')" @click="keepCheckout">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <img class="mello-checkout-exit__logo" src="/assets/logo-oficial.png" alt="MelloRise" />
            <span class="mello-checkout-exit__badge">{{ t('checkoutExit.badge') }}</span>
            <h2>{{ t('checkoutExit.title') }}</h2>
            <p>{{ t('checkoutExit.text') }}</p>
            <div class="mello-checkout-exit__actions">
              <button class="mello-checkout-exit__primary" type="button" @click="keepCheckout">
                {{ t('checkoutExit.keep') }}
              </button>
              <button class="mello-checkout-exit__secondary" type="button" @click="confirmCheckoutExit">
                {{ t('checkoutExit.leave') }}
              </button>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>
    <HomePage
      v-if="currentPage === 'home'"
      :products="products"
      :is-loading="isLoading"
      :active-discount="activeDiscount"
      :clerk-enabled="props.clerkEnabled"
      @discount-created="applyDiscount"
    />
    <ProductPage
      v-else-if="currentPage === 'product'"
      :product="currentProduct"
      :products="products"
      :purchase-eligibility="purchaseEligibility"
      @add-to-cart="addToCart"
    />
    <CheckoutSuccessPage v-else-if="currentPage === 'checkout-success'" @clear-cart="removeCartItem" />
    <AuthPage v-else-if="currentPage === 'sign-in' && props.clerkEnabled" mode="sign-in" />
    <AuthPage v-else-if="currentPage === 'sign-up' && props.clerkEnabled" mode="sign-up" />
    <AccountAuthUnavailablePage v-else-if="currentPage === 'sign-in' || currentPage === 'sign-up'" />
    <AccountOrdersPage v-else-if="currentPage === 'account-orders' && props.clerkEnabled" />
    <AccountAuthUnavailablePage v-else-if="currentPage === 'account-orders'" />
    <TrackOrderPage v-else-if="currentPage === 'tracking'" />
    <CheckoutPage
      v-else-if="currentPage === 'checkout'"
      :item="cartItem"
      :discount="activeDiscount"
      :is-checkout-loading="isCheckoutLoading"
      @checkout="goToStripeCheckout"
      @discount-applied="applyDiscount"
      @update-quantity="updateCartQuantity"
      @remove="removeCartItem"
    />
    <ContactPage v-else-if="currentPage === 'contact'" />
    <FaqPage v-else-if="currentPage === 'faq'" />
    <InstitutionalPage v-else-if="currentPage === 'institutional'" :route="route" />
    <CollectionPage
      v-else
      :products="products"
      :is-loading="isLoading"
      :purchase-eligibility="purchaseEligibility"
      @add-to-cart="addToCart"
    />
    <StoreFooter v-if="!['checkout', 'checkout-success', 'sign-in', 'sign-up'].includes(currentPage)" />
    <button
      v-if="!['checkout', 'checkout-success', 'sign-in', 'sign-up', 'account-orders'].includes(currentPage)"
      class="mello-floating-cart"
      type="button"
      :aria-label="t('nav.cart')"
      @click.stop="openCart"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Zm3 0a3 3 0 0 1 6 0"/></svg>
      <span v-if="cartCount" class="mello-floating-cart__count" aria-hidden="true">{{ cartCount }}</span>
    </button>
    <CartDrawer
      :is-open="isCartOpen"
      :item="cartItem"
      :discount="activeDiscount"
      :is-checkout-loading="isCheckoutLoading"
      :purchase-eligibility="purchaseEligibility"
      @close="closeCart"
      @update-quantity="updateCartQuantity"
      @remove="removeCartItem"
      @checkout="navigateToCheckout"
    />
  </main>
</template>

<style>
.mello-discount-notice {
  align-items: center;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(19, 49, 48, 0.12);
  border-radius: 8px;
  box-shadow: 0 24px 70px rgba(11, 35, 34, 0.18);
  color: #102f2e;
  display: grid;
  gap: 14px;
  grid-template-columns: 36px minmax(0, 1fr) 32px;
  max-width: min(420px, calc(100vw - 32px));
  padding: 14px;
  position: fixed;
  right: max(18px, env(safe-area-inset-right));
  top: max(18px, env(safe-area-inset-top));
  z-index: 21000;
}

.mello-discount-notice__mark {
  align-items: center;
  background: #133130;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.mello-discount-notice__mark svg {
  display: block;
  height: 18px;
  width: 18px;
}

.mello-discount-notice__mark path {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.5;
}

.mello-discount-notice__content {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.mello-discount-notice__content strong {
  font-size: 0.92rem;
  font-weight: 900;
  line-height: 1.2;
}

.mello-discount-notice__content span {
  color: #5d7271;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.mello-discount-notice__close {
  align-items: center;
  appearance: none;
  background: rgba(19, 49, 48, 0.07);
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  padding: 0;
  width: 32px;
}

.mello-discount-notice__close span,
.mello-discount-notice__close span::after {
  background: #133130;
  border-radius: 999px;
  content: '';
  display: block;
  height: 2px;
  width: 13px;
}

.mello-discount-notice__close span {
  transform: rotate(45deg);
}

.mello-discount-notice__close span::after {
  transform: rotate(90deg);
}

.mello-discount-notice-enter-active,
.mello-discount-notice-leave-active {
  transition: opacity 180ms ease, transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-discount-notice-enter-from,
.mello-discount-notice-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

@media (max-width: 640px) {
  .mello-discount-notice {
    left: 12px;
    right: 12px;
    top: max(12px, env(safe-area-inset-top));
    max-width: none;
  }
}

.mello-checkout-transition {
  align-items: center;
  background:
    radial-gradient(circle at 50% 42%, rgba(119, 205, 250, 0.18), transparent 24%),
    rgba(3, 12, 13, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: max(24px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom));
  position: fixed;
  z-index: 20000;
}

.mello-checkout-transition-enter-active {
  transition: opacity 260ms cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-checkout-transition-leave-active {
  transition: opacity 360ms cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 380ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-checkout-transition-enter-from,
.mello-checkout-transition-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}

.mello-checkout-transition-enter-active .mello-checkout-transition__card {
  transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), filter 320ms cubic-bezier(0.16, 1, 0.3, 1), transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-checkout-transition-leave-active .mello-checkout-transition__card {
  transition: opacity 300ms ease, filter 360ms ease, transform 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-checkout-transition-enter-from .mello-checkout-transition__card {
  filter: blur(10px);
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

.mello-checkout-transition-leave-to .mello-checkout-transition__card {
  filter: blur(14px);
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}

.mello-checkout-transition__card {
  align-items: center;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: var(--font-body-family);
  gap: 12px;
  max-width: 330px;
  padding: 28px 26px;
  text-align: center;
  width: min(100%, 330px);
}

.mello-checkout-transition__spinner {
  animation: mello-checkout-spin 820ms linear infinite;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-left-color: #77cdfa;
  border-top-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(119, 205, 250, 0.08), 0 18px 38px rgba(0, 0, 0, 0.22);
  height: 58px;
  margin-bottom: 8px;
  width: 58px;
}

.mello-checkout-transition__card strong {
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.12;
}

.mello-checkout-transition__card small {
  color: rgba(255, 255, 255, 0.74);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

.mello-checkout-loading-lock,
.mello-checkout-loading-lock body {
  overflow: hidden;
}

@keyframes mello-checkout-spin {
  to {
    transform: rotate(360deg);
  }
}

.mello-checkout-exit {
  align-items: center;
  display: flex;
  inset: 0;
  justify-content: center;
  padding: max(22px, env(safe-area-inset-top)) 18px max(22px, env(safe-area-inset-bottom));
  position: fixed;
  z-index: 21000;
}

.mello-checkout-exit__shade {
  appearance: none;
  background: rgba(3, 12, 13, 0.72);
  backdrop-filter: blur(9px);
  border: 0;
  cursor: pointer;
  inset: 0;
  padding: 0;
  position: absolute;
}

.mello-checkout-exit__card {
  background: #fbfcfb;
  border: 1px solid rgba(16, 40, 41, 0.12);
  border-radius: 22px;
  box-shadow: 0 32px 90px rgba(0, 0, 0, 0.34);
  color: #102829;
  font-family: var(--font-body-family);
  max-width: 430px;
  overflow: hidden;
  padding: 34px 28px 28px;
  position: relative;
  text-align: center;
  width: min(100%, 430px);
}

.mello-checkout-exit__card::before {
  background:
    radial-gradient(circle at 15% 12%, rgba(119, 205, 250, 0.2), transparent 32%),
    radial-gradient(circle at 86% 0%, rgba(44, 213, 177, 0.16), transparent 30%);
  content: '';
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.mello-checkout-exit__close {
  align-items: center;
  appearance: none;
  background: #ffffff;
  border: 1px solid rgba(16, 40, 41, 0.1);
  border-radius: 50%;
  box-shadow: 0 12px 28px rgba(16, 40, 41, 0.12);
  color: #536468;
  cursor: pointer;
  display: inline-flex;
  height: 42px;
  justify-content: center;
  padding: 0;
  position: absolute;
  right: 16px;
  top: 16px;
  transition: color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
  width: 42px;
  z-index: 1;
}

.mello-checkout-exit__close:hover,
.mello-checkout-exit__close:focus-visible {
  color: #102829;
  outline: 0;
  box-shadow: 0 16px 32px rgba(16, 40, 41, 0.18);
  transform: translateY(-1px);
}

.mello-checkout-exit__close svg {
  fill: none;
  height: 22px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 2.4;
  width: 22px;
}

.mello-checkout-exit__logo,
.mello-checkout-exit__badge,
.mello-checkout-exit__card h2,
.mello-checkout-exit__card p,
.mello-checkout-exit__actions {
  position: relative;
  z-index: 1;
}

.mello-checkout-exit__logo {
  display: block;
  height: 28px;
  margin: 4px auto 24px;
  object-fit: contain;
  width: auto;
}

.mello-checkout-exit__badge {
  color: #0a936f;
  display: block;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.05em;
  line-height: 1.2;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.mello-checkout-exit__card h2 {
  color: #102829;
  font-size: clamp(34px, 6vw, 46px);
  font-weight: 950;
  letter-spacing: -0.03em;
  line-height: 0.98;
  margin: 0;
  text-wrap: balance;
}

.mello-checkout-exit__card p {
  color: #536468;
  font-size: 16px;
  font-weight: 650;
  line-height: 1.45;
  margin: 16px auto 0;
  max-width: 34ch;
}

.mello-checkout-exit__actions {
  display: grid;
  gap: 10px;
  margin-top: 24px;
}

.mello-checkout-exit__primary,
.mello-checkout-exit__secondary {
  align-items: center;
  appearance: none;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-body-family);
  font-size: 16px;
  font-weight: 900;
  justify-content: center;
  min-height: 54px;
  padding: 0 18px;
  transition: box-shadow 180ms ease, transform 180ms ease, background 180ms ease, color 180ms ease;
  width: 100%;
}

.mello-checkout-exit__primary {
  background: #77cdfa;
  box-shadow: 0 18px 36px rgba(119, 205, 250, 0.32);
  color: #102829;
}

.mello-checkout-exit__secondary {
  background: transparent;
  color: #536468;
  min-height: 46px;
}

.mello-checkout-exit__primary:hover,
.mello-checkout-exit__primary:focus-visible {
  background: #66c6f8;
  box-shadow: 0 22px 46px rgba(119, 205, 250, 0.42);
  outline: 0;
  transform: translateY(-1px);
}

.mello-checkout-exit__secondary:hover,
.mello-checkout-exit__secondary:focus-visible {
  color: #102829;
  outline: 0;
  transform: translateY(-1px);
}

.mello-checkout-exit-enter-active,
.mello-checkout-exit-leave-active {
  transition: opacity 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-checkout-exit-enter-from,
.mello-checkout-exit-leave-to {
  opacity: 0;
}

.mello-checkout-exit-enter-active .mello-checkout-exit__shade,
.mello-checkout-exit-leave-active .mello-checkout-exit__shade {
  transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-checkout-exit-enter-from .mello-checkout-exit__shade,
.mello-checkout-exit-leave-to .mello-checkout-exit__shade {
  backdrop-filter: blur(0);
  opacity: 0;
}

.mello-checkout-exit-enter-active .mello-checkout-exit__card {
  transition: opacity 340ms cubic-bezier(0.16, 1, 0.3, 1), filter 380ms cubic-bezier(0.16, 1, 0.3, 1), transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-checkout-exit-leave-active .mello-checkout-exit__card {
  transition: opacity 220ms ease, filter 260ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-checkout-exit-enter-from .mello-checkout-exit__card {
  filter: blur(10px);
  opacity: 0;
  transform: translateY(18px) scale(0.96);
}

.mello-checkout-exit-leave-to .mello-checkout-exit__card {
  filter: blur(12px);
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .mello-checkout-transition,
  .mello-checkout-transition__card,
  .mello-checkout-exit,
  .mello-checkout-exit__shade,
  .mello-checkout-exit__card {
    transition: opacity 160ms ease;
  }

  .mello-checkout-transition__spinner {
    animation: none;
  }
}

.mello-floating-cart {
  align-items: center;
  appearance: none;
  background: #173132;
  border: 0;
  border-radius: 50%;
  bottom: max(18px, calc(env(safe-area-inset-bottom) + 16px));
  box-shadow: 0 18px 42px rgba(23, 49, 50, 0.24), inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  height: 58px;
  justify-content: center;
  padding: 0;
  position: fixed;
  right: max(18px, calc(env(safe-area-inset-right) + 16px));
  transition: box-shadow 180ms ease, transform 180ms ease, background 180ms ease;
  width: 58px;
  z-index: 90;
}

.mello-floating-cart:hover,
.mello-floating-cart:focus-visible {
  background: #102829;
  box-shadow: 0 22px 50px rgba(23, 49, 50, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.16);
  outline: 0;
  transform: translateY(-2px);
}

.mello-floating-cart:active {
  transform: translateY(0) scale(0.96);
}

.mello-floating-cart svg {
  fill: none;
  height: 27px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  width: 27px;
}

.mello-floating-cart__count {
  align-items: center;
  background: #77cdfa;
  border: 2px solid #ffffff;
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(23, 49, 50, 0.18);
  color: #102829;
  display: inline-flex;
  font-size: 12px;
  font-weight: 900;
  height: 24px;
  justify-content: center;
  line-height: 1;
  min-width: 24px;
  padding: 0 7px;
  position: absolute;
  right: -5px;
  top: -5px;
}

@media (max-width: 640px) {
  .mello-checkout-exit {
    align-items: flex-end;
    padding-inline: 12px;
  }

  .mello-checkout-exit__card {
    border-radius: 20px 20px 16px 16px;
    padding: 32px 22px 22px;
  }

  .mello-checkout-exit__card h2 {
    font-size: clamp(32px, 11vw, 42px);
  }

  .mello-checkout-exit__card p {
    font-size: 15px;
  }

  .mello-floating-cart {
    bottom: max(16px, calc(env(safe-area-inset-bottom) + 14px));
    height: 56px;
    right: max(16px, calc(env(safe-area-inset-right) + 14px));
    width: 56px;
  }
}

@media (max-width: 900px) {
  .mello-route-sign-in .mello-site-header,
  .mello-route-sign-up .mello-site-header {
    display: none;
  }
}
</style>
