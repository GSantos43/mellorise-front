<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import HomePage from './pages/HomePage.vue'
import ProductPage from './pages/ProductPage.vue'
import CollectionPage from './pages/CollectionPage.vue'
import ContactPage from './pages/ContactPage.vue'
import FaqPage from './pages/FaqPage.vue'
import InstitutionalPage from './pages/InstitutionalPage.vue'
import CheckoutPage from './pages/CheckoutPage.vue'
import SiteHeader from './components/SiteHeader.vue'
import StoreFooter from './components/StoreFooter.vue'
import CartDrawer from './components/CartDrawer.vue'
import PageLoader from './components/PageLoader.vue'
import { createCheckoutSession } from './services/checkout'
import { fetchProducts } from './services/products'
import { translateStaticDom } from './i18n/domTranslations'

const CART_STORAGE_KEY = 'mellorise-cart-v1'
const DISCOUNT_STORAGE_KEY = 'mellorise-welcome-discount-v1'

const products = ref([])
const isLoading = ref(true)
const route = ref(window.location.pathname)
const isCartOpen = ref(false)
const cartItem = ref(null)
const activeDiscount = ref(null)
const isCheckoutLoading = ref(false)
const isPageLoading = ref(true)
const { t, locale } = useI18n({ useScope: 'global' })
let staticTranslationFrame = 0
let staticTranslationTimeout = 0
let staticTranslationObserver = null
let pageLoaderTimer = 0

const currentProduct = computed(() => {
  const slug = route.value.split('/products/')[1]
  return products.value.find((product) => String(product.handle) === slug) || products.value[0]
})

const currentPage = computed(() => {
  if (route.value.startsWith('/products/')) return 'product'
  if (route.value.startsWith('/checkout')) return 'checkout'
  if (route.value === '/pages/contact-us' || route.value === '/pages/contact') return 'contact'
  if (route.value === '/pages/faq' || route.value === '/pages/faqs') return 'faq'
  // Tracking is hidden until MelloRise has a real order tracking flow.
  if (route.value.startsWith('/policies/')) return 'institutional'
  if (route.value.startsWith('/collections') || route.value === '/products') return 'collection'
  return 'home'
})
const cartCount = computed(() => Math.max(0, Number(cartItem.value?.quantity || 0)))

async function navigate(event) {
  const anchor = event.target.closest('a')
  if (!anchor) return

  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('mailto:')) return

  const url = new URL(href, window.location.origin)
  if (url.origin !== window.location.origin) return

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
    bundleLabel: payload.bundleLabel || `${quantity} frasco${quantity === 1 ? '' : 's'}`
  }
  openCart()
}

function applyDiscount(discount) {
  if (!discount?.code || !discount?.email) return

  activeDiscount.value = discount
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
      bundleLabel: savedCartItem.bundleLabel || `${quantity} frasco${quantity === 1 ? '' : 's'}`
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

function navigateToCheckout() {
  if (!cartItem.value) return
  closeCart()
  window.history.pushState({}, '', '/checkout')
  route.value = window.location.pathname
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function updateCartQuantity(quantity) {
  if (!cartItem.value) return
  cartItem.value = {
    ...cartItem.value,
    quantity
  }
}

function removeCartItem() {
  cartItem.value = null
}

async function goToStripeCheckout(options = {}) {
  if (!cartItem.value || isCheckoutLoading.value) return

  isCheckoutLoading.value = true

  try {
    if (activeDiscount.value?.code) {
      options.couponCode = activeDiscount.value.code
      options.customerEmail = activeDiscount.value.email
    }

    const checkoutUrl = await createCheckoutSession(cartItem.value, options)
    window.location.href = checkoutUrl
  } catch (error) {
    console.error(error)
    isCheckoutLoading.value = false
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
  cartItem.value = readSavedCartItem()
  activeDiscount.value = readSavedDiscount()
  products.value = await fetchProducts({
    onUpdate: (freshProducts) => {
      products.value = freshProducts
      scheduleStaticTranslation()
    }
  })
  isLoading.value = false
  showPageLoader(260)
  scheduleStaticTranslation()

  window.addEventListener('popstate', () => {
    route.value = window.location.pathname
  })

  staticTranslationObserver = new MutationObserver(() => {
    scheduleStaticTranslation()
  })
  staticTranslationObserver.observe(document.querySelector('[data-template="vue3-store"]'), {
    childList: true,
    subtree: true
  })
})

onUnmounted(() => {
  if (pageLoaderTimer) {
    window.clearTimeout(pageLoaderTimer)
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

watch([route, locale, isLoading, products, currentProduct], scheduleStaticTranslation, { flush: 'post' })
watch(cartItem, persistCartItem, { deep: true })
watch(activeDiscount, persistDiscount, { deep: true })
</script>

<template>
  <main data-template="vue3-store" @click="navigate">
    <SiteHeader v-if="currentPage !== 'checkout'" :current-route="route" />
    <PageLoader :active="isPageLoading" />
    <HomePage v-if="currentPage === 'home'" :products="products" :is-loading="isLoading" :active-discount="activeDiscount" @discount-created="applyDiscount" />
    <ProductPage v-else-if="currentPage === 'product'" :product="currentProduct" :products="products" @add-to-cart="addToCart" />
    <CheckoutPage
      v-else-if="currentPage === 'checkout'"
      :item="cartItem"
      :discount="activeDiscount"
      :is-checkout-loading="isCheckoutLoading"
      @checkout="goToStripeCheckout"
      @update-quantity="updateCartQuantity"
      @remove="removeCartItem"
    />
    <ContactPage v-else-if="currentPage === 'contact'" />
    <FaqPage v-else-if="currentPage === 'faq'" />
    <InstitutionalPage v-else-if="currentPage === 'institutional'" :route="route" />
    <CollectionPage v-else :products="products" :is-loading="isLoading" @add-to-cart="addToCart" />
    <StoreFooter />
    <button
      v-if="currentPage !== 'checkout'"
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
      @close="closeCart"
      @update-quantity="updateCartQuantity"
      @remove="removeCartItem"
      @checkout="navigateToCheckout"
    />
  </main>
</template>

<style>
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
  .mello-floating-cart {
    bottom: max(16px, calc(env(safe-area-inset-bottom) + 14px));
    height: 56px;
    right: max(16px, calc(env(safe-area-inset-right) + 14px));
    width: 56px;
  }
}
</style>
