<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import HomePage from './pages/HomePage.vue'
import ProductPage from './pages/ProductPage.vue'
import CollectionPage from './pages/CollectionPage.vue'
import ContactPage from './pages/ContactPage.vue'
import FaqPage from './pages/FaqPage.vue'
import InstitutionalPage from './pages/InstitutionalPage.vue'
import SiteHeader from './components/SiteHeader.vue'
import StoreFooter from './components/StoreFooter.vue'
import CartDrawer from './components/CartDrawer.vue'
import PageLoader from './components/PageLoader.vue'
import { createCheckoutSession } from './services/checkout'
import { fetchProducts } from './services/products'
import { translateStaticDom } from './i18n/domTranslations'

const products = ref([])
const isLoading = ref(true)
const route = ref(window.location.pathname)
const isCartOpen = ref(false)
const cartItem = ref(null)
const isCheckoutLoading = ref(false)
const isPageLoading = ref(true)
const { locale } = useI18n({ useScope: 'global' })
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
  if (route.value === '/pages/contact-us' || route.value === '/pages/contact') return 'contact'
  if (route.value === '/pages/faq' || route.value === '/pages/faqs') return 'faq'
  if (route.value.startsWith('/policies/') || route.value === '/apps/track123') return 'institutional'
  if (route.value.startsWith('/collections') || route.value === '/products') return 'collection'
  return 'home'
})

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

function openCart() {
  isCartOpen.value = true
}

function closeCart() {
  isCartOpen.value = false
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

async function goToStripeCheckout() {
  if (!cartItem.value || isCheckoutLoading.value) return

  isCheckoutLoading.value = true

  try {
    const checkoutUrl = await createCheckoutSession(cartItem.value)
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
  products.value = await fetchProducts()
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
</script>

<template>
  <main data-template="vue3-store" @click="navigate">
    <SiteHeader :current-route="route" />
    <PageLoader :active="isPageLoading" />
    <HomePage v-if="currentPage === 'home'" :products="products" :is-loading="isLoading" />
    <ProductPage v-else-if="currentPage === 'product'" :product="currentProduct" :products="products" @add-to-cart="addToCart" />
    <ContactPage v-else-if="currentPage === 'contact'" />
    <FaqPage v-else-if="currentPage === 'faq'" />
    <InstitutionalPage v-else-if="currentPage === 'institutional'" :route="route" />
    <CollectionPage v-else :products="products" :is-loading="isLoading" @add-to-cart="addToCart" />
    <StoreFooter />
    <CartDrawer
      :is-open="isCartOpen"
      :item="cartItem"
      :is-checkout-loading="isCheckoutLoading"
      @close="closeCart"
      @update-quantity="updateCartQuantity"
      @remove="removeCartItem"
      @checkout="goToStripeCheckout"
    />
  </main>
</template>
