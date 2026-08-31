<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMoney } from '../services/products'
import { translateProductTitle } from '../i18n/productText'

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  products: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-to-cart'])
const { t, locale } = useI18n({ useScope: 'global' })

const fallbackProduct = {
  title: '9-In-1 Natural Growth & Bone Support Gummies For Kids & Teens',
  vendor: 'MelloRise',
  price: 39.99,
  compareAtPrice: 59.99,
  image: '/assets/frasco.png',
  images: ['/assets/frasco.png', '/assets/gummy-home-product.png', '/assets/nutri2.png', '/assets/compose.png']
}

const selectedImageIndex = ref(0)
const selectedBundle = ref(1)
const quantity = ref(1)
const isPastHero = ref(false)
const galleryMainRef = ref(null)
const openAccordionIndexes = ref([])
const isGalleryDragging = ref(false)
const isGallerySettling = ref(false)
const galleryDragOffset = ref(0)
const loadedGalleryImages = ref(new Set())
const suppressGalleryClick = ref(false)
const isGalleryLightboxOpen = ref(false)
let galleryDragStartX = 0
let galleryDragStartY = 0
let galleryPointerId = null
let previousBodyOverflow = ''
const packConfig = [
  { match: ['buy 1', '1 bottle', 'starter'], title: 'Buy 1', meta: 'Starter routine', shippingKey: 'product.bundles.shipping.standard', image: '/assets/one1.png', badge: '', paidQuantity: 1, freeQuantity: 0, bottles: 1 },
  { match: ['buy 2 get 1', 'buy 2 get 1 free', '2 get 1', '3 bottles', 'most popular'], title: 'Buy 2 Get 1 Free', meta: 'Most Popular', shippingKey: 'product.bundles.shipping.free', image: '/assets/three.png', badge: 'Most Popular', paidQuantity: 2, freeQuantity: 1, bottles: 3 },
  { match: ['buy 3 get 2', 'buy 3 get 2 free', '3 get 2', '5 bottles', 'best value'], title: 'Buy 3 Get 2 Free', meta: 'Best Value', shippingKey: 'product.bundles.shipping.freePriority', image: '/assets/five5.png', badge: 'Best Value', paidQuantity: 3, freeQuantity: 2, bottles: 5 }
]
const maxGalleryIndicators = 5

function normalizeBundleMatch(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function findBundleVariant(variants, pack) {
  const matches = pack.match.map(normalizeBundleMatch)

  return variants.find((variant) => {
    const title = normalizeBundleMatch(variant.title)
    return matches.some((match) => title === match || title.includes(match))
  })
}

const activeProduct = computed(() => props.product || fallbackProduct)
const localizedProductTitle = computed(() => translateProductTitle(activeProduct.value.title, locale.value))
const productImages = computed(() => activeProduct.value.images?.length ? activeProduct.value.images : [activeProduct.value.image])
const mainImage = computed(() => productImages.value[selectedImageIndex.value] || activeProduct.value.image)
const isMainImageLoaded = computed(() => loadedGalleryImages.value.has(mainImage.value))
const galleryIndicators = computed(() => {
  const images = productImages.value
  const totalImages = images.length

  if (totalImages <= maxGalleryIndicators) {
    return images.map((src, index) => ({ src, index, isTrailingHint: false }))
  }

  const maxStartIndex = totalImages - maxGalleryIndicators
  const startIndex = Math.min(Math.max(selectedImageIndex.value - 2, 0), maxStartIndex)

  return images.slice(startIndex, startIndex + maxGalleryIndicators).map((src, offset) => {
    const index = startIndex + offset

    return {
      src,
      index,
      isTrailingHint: offset === maxGalleryIndicators - 1 && index < totalImages - 1
    }
  })
})
const galleryTrackImages = computed(() => {
  const images = productImages.value
  if (images.length < 2) {
    return [{ src: mainImage.value, position: 'current' }]
  }

  const previousIndex = selectedImageIndex.value === 0 ? images.length - 1 : selectedImageIndex.value - 1
  const nextIndex = selectedImageIndex.value === images.length - 1 ? 0 : selectedImageIndex.value + 1

  return [
    { src: images[previousIndex], position: 'previous' },
    { src: mainImage.value, position: 'current' },
    { src: images[nextIndex], position: 'next' }
  ]
})
const galleryTrackStyle = computed(() => ({
  transform: productImages.value.length < 2
    ? `translate3d(${galleryDragOffset.value}px, 0, 0)`
    : `translate3d(calc(-100% + ${galleryDragOffset.value}px), 0, 0)`,
}))
const selectedPack = computed(() => bundles.value[selectedBundle.value] || bundles.value[0])
const currentPrice = computed(() => formatMoney(selectedPack.value?.price ?? activeProduct.value.price))
const compareAtPrice = computed(() => selectedPack.value?.compareAtPrice ? formatMoney(selectedPack.value.compareAtPrice) : '')
const perBottlePrice = computed(() => {
  const pack = selectedPack.value
  const price = Number(pack?.price ?? activeProduct.value.price ?? 0)
  const bottles = Math.max(1, Number(pack?.bottles || 1))

  return formatMoney(price / bottles)
})

const bundles = computed(() => {
  const variants = Array.isArray(activeProduct.value.variants) ? activeProduct.value.variants : []

  if (!variants.length) {
    return packConfig.map((pack, index) => ({
      ...pack,
      price: index === 0 ? activeProduct.value.price : Number(activeProduct.value.price) * (index + 1),
      compareAtPrice: null,
      variationId: null,
      isAvailable: true
    }))
  }

  return packConfig.map((pack) => {
    const variant = findBundleVariant(variants, pack)

    return {
      ...pack,
      title: pack.title,
      price: variant?.price ?? activeProduct.value.price,
      compareAtPrice: variant?.compareAtPrice ?? null,
      variationId: variant?.id ?? null,
      isAvailable: Boolean(variant?.id) && variant?.purchasable !== false && variant?.stockStatus !== 'outofstock'
    }
  })
})

const productAccordions = computed(() => [
  {
    title: t('product.accordions.details.title'),
    icon: 'M4 3h16v18H4z|M8 7h8|M8 11h8|M8 15h5',
    content: `
      <p>${t('product.accordions.details.intro')}</p>
      <ul>
        <li>${t('product.accordions.details.items.d3')}</li>
        <li>${t('product.accordions.details.items.k2')}</li>
        <li>${t('product.accordions.details.items.minerals')}</li>
        <li>${t('product.accordions.details.items.amino')}</li>
      </ul>
      <p>${t('product.accordions.details.note')}</p>
    `
  },
  {
    title: t('product.accordions.ingredients.title'),
    icon: 'M11 20A7 7 0 0 1 4 13c0-5 7-9 16-9 0 9-4 16-9 16Z|M4 20c4-6 8-9 16-16',
    content: `
      <p>${t('product.accordions.ingredients.intro')}</p>
      <ul>
        <li>${t('product.accordions.ingredients.items.school')}</li>
        <li>${t('product.accordions.ingredients.items.bones')}</li>
        <li>${t('product.accordions.ingredients.items.picky')}</li>
        <li>${t('product.accordions.ingredients.items.active')}</li>
        <li>${t('product.accordions.ingredients.items.routine')}</li>
      </ul>
      <p>${t('product.accordions.ingredients.label')}</p>
      <ul>
        <li>${t('product.accordions.ingredients.claims.vegan')}</li>
        <li>${t('product.accordions.ingredients.claims.nonGmo')}</li>
        <li>${t('product.accordions.ingredients.claims.glutenFree')}</li>
        <li>${t('product.accordions.ingredients.claims.gelatinFree')}</li>
        <li>${t('product.accordions.ingredients.claims.halal')}</li>
      </ul>
    `
  },
  {
    title: t('product.accordions.benefits.title'),
    icon: 'M12 2v4|M12 18v4|m4.93 4.93 2.83 2.83|m16.24 16.24 2.83 2.83|M2 12h4|M18 12h4|m4.93 19.07 2.83-2.83|m16.24 7.76 2.83-2.83|M12 8l1.25 2.75L16 12l-2.75 1.25L12 16l-1.25-2.75L8 12l2.75-1.25L12 8Z',
    content: `
      <p>${t('product.accordions.benefits.intro')}</p>
      <ul>
        <li>${t('product.accordions.benefits.items.height')}</li>
        <li>${t('product.accordions.benefits.items.bones')}</li>
        <li>${t('product.accordions.benefits.items.sleep')}</li>
        <li>${t('product.accordions.benefits.items.confidence')}</li>
        <li>${t('product.accordions.benefits.items.skeletal')}</li>
      </ul>
    `
  },
  {
    title: t('product.accordions.usage.title'),
    icon: 'M12 2.5S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.5-7-12.5Z|M9 15a3 3 0 0 0 6 0',
    content: `
      <ol>
        <li>${t('product.accordions.usage.items.dose')}</li>
        <li>${t('product.accordions.usage.items.chew')}</li>
        <li>${t('product.accordions.usage.items.flavor')}</li>
      </ol>
      <p>${t('product.accordions.usage.note')}</p>
    `
  },
  {
    title: t('product.accordions.shipping.title'),
    icon: 'm21 8-9-5-9 5 9 5 9-5Z|m3 8 9 5 9-5|M3 8v8l9 5 9-5V8|M12 13v8',
    content: `
      <p>${t('product.accordions.shipping.intro')}</p>
      <p>${t('product.accordions.shipping.claims')}</p>
      <p><strong>${t('product.accordions.shipping.note')}</strong></p>
    `
  }
])

function isAccordionOpen(index) {
  return openAccordionIndexes.value.includes(index)
}

function toggleAccordion(index) {
  openAccordionIndexes.value = isAccordionOpen(index)
    ? openAccordionIndexes.value.filter((item) => item !== index)
    : [...openAccordionIndexes.value, index]
}

function getGalleryWidth() {
  return Math.max(1, Math.round(galleryMainRef.value?.getBoundingClientRect().width || 0))
}

function completeGallerySlide(index, direction) {
  if (!productImages.value.length || index === selectedImageIndex.value || isGallerySettling.value) return

  const width = getGalleryWidth()
  isGallerySettling.value = true
  galleryDragOffset.value = direction === 'previous' ? width : -width
  window.setTimeout(() => {
    selectedImageIndex.value = index
    isGallerySettling.value = false
    galleryDragOffset.value = 0
  }, 260)
}

function selectGalleryImage(index, direction = 'next') {
  if (!productImages.value.length || index === selectedImageIndex.value) return

  const totalImages = productImages.value.length
  const distance = Math.abs(index - selectedImageIndex.value)
  const isAdjacent = distance === 1 || distance === totalImages - 1

  if (!isAdjacent) {
    selectedImageIndex.value = index
    return
  }

  completeGallerySlide(index, direction)
}

function selectPreviousImage() {
  const previousIndex = selectedImageIndex.value === 0 ? productImages.value.length - 1 : selectedImageIndex.value - 1
  selectGalleryImage(previousIndex, 'previous')
}

function selectNextImage() {
  const nextIndex = selectedImageIndex.value === productImages.value.length - 1 ? 0 : selectedImageIndex.value + 1
  selectGalleryImage(nextIndex, 'next')
}

function selectThumbnailImage(index) {
  const direction = index < selectedImageIndex.value ? 'previous' : 'next'
  selectGalleryImage(index, direction)
}

function markGalleryImageLoaded(src) {
  if (!src || loadedGalleryImages.value.has(src)) return

  const nextLoadedImages = new Set(loadedGalleryImages.value)
  nextLoadedImages.add(src)
  loadedGalleryImages.value = nextLoadedImages
}

function preloadGalleryImage(src) {
  if (!src || loadedGalleryImages.value.has(src) || typeof window === 'undefined') return

  const image = new window.Image()
  image.onload = () => markGalleryImageLoaded(src)
  image.src = src
}

function preloadAdjacentGalleryImages() {
  const images = productImages.value
  if (images.length < 2) return

  const previousIndex = selectedImageIndex.value === 0 ? images.length - 1 : selectedImageIndex.value - 1
  const nextIndex = selectedImageIndex.value === images.length - 1 ? 0 : selectedImageIndex.value + 1
  preloadGalleryImage(images[previousIndex])
  preloadGalleryImage(images[nextIndex])
}

function handleGalleryPreviousClick() {
  if (suppressGalleryClick.value) return
  selectPreviousImage()
}

function handleGalleryNextClick() {
  if (suppressGalleryClick.value) return
  selectNextImage()
}

function openGalleryLightbox() {
  if (suppressGalleryClick.value || isGallerySettling.value || isGalleryDragging.value) return

  isGalleryLightboxOpen.value = true
}

function closeGalleryLightbox() {
  isGalleryLightboxOpen.value = false
}

function handleGalleryKeydown(event) {
  if (event.key === 'Escape') {
    closeGalleryLightbox()
  }
}

function startGalleryDrag(event) {
  if (productImages.value.length < 2 || isGallerySettling.value || (event.pointerType === 'mouse' && event.button !== 0)) return

  galleryPointerId = event.pointerId
  galleryDragStartX = event.clientX
  galleryDragStartY = event.clientY
  galleryDragOffset.value = 0
  isGalleryDragging.value = true
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function moveGalleryDrag(event) {
  if (!isGalleryDragging.value || galleryPointerId !== event.pointerId) return

  const deltaX = event.clientX - galleryDragStartX
  const deltaY = event.clientY - galleryDragStartY
  const isHorizontalDrag = Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)

  if (isHorizontalDrag) {
    event.preventDefault()
  }

  const dragLimit = getGalleryWidth()
  galleryDragOffset.value = Math.max(-dragLimit, Math.min(dragLimit, deltaX))
}

function finishGalleryDrag(event) {
  if (!isGalleryDragging.value || galleryPointerId !== event.pointerId) return

  const deltaX = event.clientX - galleryDragStartX
  const deltaY = event.clientY - galleryDragStartY
  const isHorizontalSwipe = Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2

  if (isHorizontalSwipe) {
    suppressGalleryClick.value = true
    const images = productImages.value
    const targetIndex = deltaX < 0
      ? (selectedImageIndex.value === images.length - 1 ? 0 : selectedImageIndex.value + 1)
      : (selectedImageIndex.value === 0 ? images.length - 1 : selectedImageIndex.value - 1)
    completeGallerySlide(targetIndex, deltaX < 0 ? 'next' : 'previous')
    window.setTimeout(() => {
      suppressGalleryClick.value = false
    }, 320)
  }

  event.currentTarget.releasePointerCapture?.(event.pointerId)
  isGalleryDragging.value = false
  galleryPointerId = null

  if (!isHorizontalSwipe) {
    galleryDragOffset.value = 0
  }
}

function cancelGalleryDrag() {
  isGalleryDragging.value = false
  galleryDragOffset.value = 0
  galleryPointerId = null
}

function updateStickyState() {
  isPastHero.value = window.scrollY > 640
}

function buildSelectedCartPayload() {
  const bundle = selectedPack.value
  const paidQuantity = Math.max(1, Number(bundle.paidQuantity || quantity.value || 1))
  const bundlePrice = Number(bundle.price || activeProduct.value.price || 0)
  const unitPrice = bundlePrice / paidQuantity

  return {
    product: activeProduct.value,
    variationId: bundle.variationId,
    price: unitPrice,
    unitPrice,
    quantity: paidQuantity,
    checkoutQuantity: bundle.variationId ? 1 : paidQuantity,
    image: bundle.image || activeProduct.value.image,
    bundleLabel: `${bundle.title} | ${bundle.bottles} frasco${bundle.bottles === 1 ? '' : 's'} por pack`,
    promotion: bundle.freeQuantity
      ? {
          code: bundle.paidQuantity >= 3 ? 'BUY_3_GET_2' : 'BUY_2_GET_1',
          label: bundle.title,
          paidQuantity: bundle.paidQuantity,
          freeQuantity: bundle.freeQuantity,
          deliveredQuantity: bundle.bottles
        }
      : undefined
  }
}

function submitCart() {
  emit('add-to-cart', buildSelectedCartPayload())
}

function buyNow() {
  emit('add-to-cart', {
    ...buildSelectedCartPayload(),
    checkoutNow: true
  })
}

watch(selectedBundle, (bundleIndex) => {
  const paidQuantity = Number(bundles.value[bundleIndex]?.paidQuantity || 1)
  quantity.value = paidQuantity
}, { immediate: true })

onMounted(() => {
  updateStickyState()
  window.addEventListener('scroll', updateStickyState, { passive: true })
  window.addEventListener('keydown', handleGalleryKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateStickyState)
  window.removeEventListener('keydown', handleGalleryKeydown)
  document.body.style.overflow = previousBodyOverflow
})

watch(activeProduct, () => {
  selectedImageIndex.value = 0
  closeGalleryLightbox()
})

watch(mainImage, (src) => {
  preloadGalleryImage(src)
  preloadAdjacentGalleryImages()
}, { immediate: true })

watch(isGalleryLightboxOpen, (isOpen) => {
  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <section class="gummy-growth" :class="{ 'is-past-hero': isPastHero }" data-section-id="vue-gummy-product">
    <div class="gg-topbar" :aria-label="t('product.topbarLabel')">
      <div class="gg-marquee" aria-hidden="true">
        <template v-for="repeat in 4" :key="repeat">
          <span>{{ t('product.topbar.hormoneFree') }}</span>
          <span>{{ t('product.topbar.glutenFree') }}</span>
          <span>{{ t('product.topbar.responsible') }}</span>
          <span>{{ t('product.topbar.selected') }}</span>
        </template>
      </div>
    </div>

    <div class="gg-hero" id="comprar">
      <div class="gg-shell gg-hero__grid">
        <div class="gg-gallery" :aria-label="t('product.gallery.label')">
          <div
            ref="galleryMainRef"
            class="gg-gallery__main"
            :class="{ 'is-dragging': isGalleryDragging, 'is-settling': isGallerySettling }"
            @pointerdown="startGalleryDrag"
            @pointermove="moveGalleryDrag"
            @pointerup="finishGalleryDrag"
            @pointercancel="cancelGalleryDrag"
            @pointerleave="finishGalleryDrag"
            @click="openGalleryLightbox"
          >
            <div class="gg-gallery__stage" :class="{ 'is-loading': !isMainImageLoaded }">
              <div class="gg-gallery__track" :style="galleryTrackStyle">
                <div
                  v-for="slide in galleryTrackImages"
                  :key="`${slide.position}-${slide.src}`"
                  class="gg-gallery__slide"
                  :class="`is-${slide.position}`"
                >
                  <img :data-gg-main-image="slide.position === 'current' ? true : null" :src="slide.src" :alt="localizedProductTitle" width="1946" height="1946" loading="eager" @load="markGalleryImageLoaded(slide.src)" @dragstart.prevent>
                </div>
              </div>
              <span v-if="!isMainImageLoaded" class="gg-gallery__loader" role="status" :aria-label="t('product.gallery.loading')">
                <span aria-hidden="true"></span>
              </span>
            </div>
            <button class="gg-gallery-hit gg-gallery-hit--prev" type="button" :aria-label="t('product.gallery.previous')" @pointerdown.stop @pointermove.stop @pointerup.stop @pointercancel.stop @click.stop="handleGalleryPreviousClick">
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></span>
            </button>
            <button class="gg-gallery-hit gg-gallery-hit--next" type="button" :aria-label="t('product.gallery.next')" @pointerdown.stop @pointermove.stop @pointerup.stop @pointercancel.stop @click.stop="handleGalleryNextClick">
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></span>
            </button>
          </div>
          <div class="gg-gallery__thumb-row">
            <button class="gg-gallery-arrow" type="button" :aria-label="t('product.gallery.previous')" @click="selectPreviousImage">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div class="gg-gallery__thumbs" data-gg-thumbs>
              <button
                v-for="indicator in galleryIndicators"
                :key="`${indicator.index}-${indicator.src}`"
                class="gg-image-card"
                :class="{ 'is-active': selectedImageIndex === indicator.index, 'is-loading': !loadedGalleryImages.has(indicator.src), 'is-trailing-hint': indicator.isTrailingHint }"
                type="button"
                data-gg-thumb
                @click="selectThumbnailImage(indicator.index)"
              >
                <img :src="indicator.src" :alt="localizedProductTitle" width="260" height="260" loading="lazy" @load="markGalleryImageLoaded(indicator.src)">
                <span v-if="!loadedGalleryImages.has(indicator.src)" class="gg-image-card__loader" role="status" :aria-label="t('product.gallery.loading')">
                  <span aria-hidden="true"></span>
                </span>
              </button>
            </div>
            <button class="gg-gallery-arrow" type="button" :aria-label="t('product.gallery.next')" @click="selectNextImage">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
            </button>
          </div>

          <Teleport to="body">
            <div v-if="isGalleryLightboxOpen" class="gg-image-lightbox" role="dialog" aria-modal="true" :aria-label="t('product.gallery.expanded')" @click.self="closeGalleryLightbox">
              <button class="gg-image-lightbox__close" type="button" :aria-label="t('product.gallery.close')" @click="closeGalleryLightbox">
                <span></span>
              </button>
              <img :src="mainImage" :alt="localizedProductTitle" width="1946" height="1946" loading="eager" @load="markGalleryImageLoaded(mainImage)">
            </div>
          </Teleport>

          <div class="gg-product-accordions" aria-label="Informacion del producto">
            <section
              v-for="(accordion, index) in productAccordions"
              :key="accordion.title"
              class="gg-product-accordion"
              :data-expanded="isAccordionOpen(index)"
            >
              <button
                class="gg-product-accordion__summary"
                type="button"
                :aria-expanded="isAccordionOpen(index)"
                :aria-controls="`gg-product-accordion-${index}`"
                @click="toggleAccordion(index)"
              >
                <span class="gg-product-accordion__title">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path v-for="path in accordion.icon.split('|')" :key="path" :d="path"/>
                  </svg>
                  {{ accordion.title }}
                </span>
                <svg class="gg-product-accordion__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>
              </button>
              <div
                :id="`gg-product-accordion-${index}`"
                class="gg-product-accordion__content"
                :aria-hidden="!isAccordionOpen(index)"
              >
                <div class="gg-product-accordion__content-inner" v-html="accordion.content"></div>
              </div>
            </section>
          </div>
        </div>

        <div class="gg-product-panel">
          <div class="gg-rating">
            <span class="gg-stars" aria-hidden="true">
              <svg v-for="star in 5" :key="star" viewBox="0 0 24 24"><path d="m12 2.8 2.75 5.58 6.16.9-4.45 4.34 1.05 6.13L12 16.85l-5.51 2.9 1.05-6.13-4.45-4.34 6.16-.9L12 2.8Z"/></svg>
            </span>
            <span><strong>4.4/5</strong> stars rated by <strong>15,000+</strong> parents</span>
          </div>
          <h1 class="gg-title">{{ localizedProductTitle }}</h1>
          <p class="gg-lede">{{ t('product.lede') }}</p>

          <div class="gg-proof-chips" :aria-label="t('product.highlightsLabel')">
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>{{ t('product.chips.routine') }}</span>
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>{{ t('product.chips.gummy') }}</span>
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>{{ t('product.chips.guided') }}</span>
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>{{ t('product.chips.labelUse') }}</span>
          </div>

          <div class="gg-offer-strip">
            <strong>{{ t('product.offer.title') }}</strong>
            <span>{{ t('product.offer.text') }}</span>
          </div>

          <div class="gg-price">
            <span class="gg-price__current">{{ currentPrice }}</span>
            <span class="gg-price__note">{{ compareAtPrice ? `Antes ${compareAtPrice}` : 'Precio en USD' }}</span>
          </div>

          <form class="gg-form">
            <fieldset class="gg-promos gg-promos--cards" aria-label="Promociones">
              <legend>
                <span>Elige tu pack</span>
                <small>Compra directa con datos dinámicos</small>
              </legend>
              <label
                v-for="(bundle, index) in bundles"
                :key="bundle.title"
                class="gg-promo"
                :class="{ 'is-active': selectedBundle === index, 'gg-promo--featured': index === 1, 'is-disabled': !bundle.isAvailable }"
              >
                <span v-if="bundle.badge" class="gg-promo__badge">{{ bundle.badge }}</span>
                <input type="radio" name="id" :value="index" :checked="selectedBundle === index" :disabled="!bundle.isAvailable" @change="selectedBundle = index">
                <span class="gg-promo__selector" aria-hidden="true"></span>
                <span class="gg-promo__image gg-promo__image--offer" aria-hidden="true">
                  <img :src="bundle.image" alt="" width="180" height="120" loading="lazy">
                </span>
                <span class="gg-promo__body">
                  <strong>{{ bundle.title }}</strong>
                  <small class="gg-promo__meta">{{ bundle.meta }}</small>
                  <small class="gg-promo__shipping">{{ t(bundle.shippingKey) }}</small>
                </span>
                <span class="gg-promo__price">
                  <b>{{ formatMoney(bundle.price) }}</b>
                  <small>{{ formatMoney(Number(bundle.price || 0) / Math.max(1, bundle.bottles)) }} / frasco</small>
                </span>
              </label>
            </fieldset>

            <div class="gg-quantity" :aria-label="t('product.quantity.label')">
              <button type="button" data-gg-qty-minus :aria-label="t('product.quantity.decrease')" @click="quantity = Math.max(1, quantity - 1)">-</button>
              <input v-model="quantity" type="number" name="quantity" min="1" inputmode="numeric">
              <button type="button" data-gg-qty-plus :aria-label="t('product.quantity.increase')" @click="quantity += 1">+</button>
            </div>

            <button class="gg-button gg-button--wide" type="button" :disabled="!selectedPack?.isAvailable" @click="submitCart">{{ t('product.addToCart') }}</button>
          </form>

          <div class="gg-post-cart-trust" :aria-label="t('product.trust.label')">
            <div class="gg-trust-pills">
              <span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
                {{ t('product.trust.secureCheckout') }}
              </span>
            </div>

            <div class="gg-trust-cards">
              <article>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5"/><path d="M12 12v9"/></svg>
                <strong>{{ t('product.trust.noArtificialHormones') }}</strong>
              </article>
              <article>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 7 7.3-1.2-5.4 5 3.4 6.5-6.5-3.4-5 5.4L9.2 14 2 11.8 9 9.7 12 2Z"/></svg>
                <strong>{{ t('product.trust.noStimulants') }}</strong>
              </article>
              <article>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="m9 15 2 2 4-4"/></svg>
                <strong>{{ t('product.trust.dailyRoutine') }}</strong>
              </article>
              <article>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 9.8 5.7 5.5 5l-.7 4.3L1 12l3.8 2.7.7 4.3 4.3-.7L12 22l2.2-3.7 4.3.7.7-4.3L23 12l-3.8-2.7-.7-4.3-4.3.7L12 2Z"/><path d="m8.8 12.4 2 2 4.4-5"/></svg>
                <strong>{{ t('product.trust.clearLabel') }}</strong>
              </article>
            </div>

            <div class="gg-delivery-steps" aria-label="Estimated delivery timeline">
              <div class="gg-delivery-step">
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2v4"/><path d="M18 2v4"/><path d="M3 9h18"/><path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/></svg>
                </span>
                <strong>Today</strong>
                <small>Ordered</small>
              </div>
              <div class="gg-delivery-step">
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v10H3z"/><path d="M14 11h4l3 3v3h-7z"/><path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>
                </span>
                <strong>24-48h</strong>
                <small>Dispatched</small>
              </div>
              <div class="gg-delivery-step">
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10 12 4l8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z"/></svg>
                </span>
                <strong>3-5 days</strong>
                <small>Delivered</small>
              </div>
            </div>
          </div>

          <div class="gg-dynamic-checkout">
            <button class="gg-button gg-button--blue gg-button--wide" type="button" :disabled="!selectedPack?.isAvailable" @click="buyNow">{{ t('product.buyNow') }}</button>
          </div>

          <p class="gg-purchase-note">{{ t('product.purchaseNote') }}</p>
        </div>
      </div>
    </div>

    <div class="gg-school-section" id="rutina-escolar">
      <div class="gg-shell gg-school">
        <div class="gg-school__copy">
          <span class="gg-school__eyebrow">La rutina empieza en casa</span>
          <h2>Su día escolar empieza <span>con una rutina simple.</span></h2>
          <p>Una forma práctica de acompañar las mañanas ocupadas con una goma diaria pensada para familias.</p>
          <ul class="gg-school__list" aria-label="Beneficios de rutina">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>
              Una opción amigable para incluir en la rutina diaria.
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>
              Con nutrientes como D3, K2, calcio, magnesio y zinc.
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>
              Fácil de recordar antes de salir para la escuela.
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>
              Formato gummy pensado para acompañar hábitos constantes.
            </li>
          </ul>
          <a class="gg-school__cta" href="#comprar">Comprar ahora</a>
        </div>
        <div class="gg-school__media">
          <img src="/assets/kid.png" alt="Niño tomando una goma MelloRise en la cocina antes de la escuela" width="1200" height="900" loading="lazy">
        </div>
      </div>
    </div>

    <div class="gg-nutrition-section" id="formula-inteligente">
      <div class="gg-shell gg-nutrition">
        <div class="gg-nutrition__head">
          <span class="gg-nutrition__eyebrow">No es solo una gummy</span>
          <h2>Por que MelloRise es una <span>eleccion mas simple</span> para acompanar el crecimiento</h2>
          <p>Nutrientes seleccionados en una rutina gummy simple para familias.</p>
        </div>

        <div class="gg-nutrition__grid">
          <div class="gg-nutrition__side gg-nutrition__side--left">
            <article class="gg-nutrition-item">
              <div class="gg-nutrition-item__copy">
                <h3>Estatura natural</h3>
                <p>Nutrientes para una rutina equilibrada en etapas de crecimiento.</p>
              </div>
              <span class="gg-nutrition-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 20V4"/><path d="m8 8 4-4 4 4"/><path d="M7 20h10"/><path d="M9 14h6"/></svg>
              </span>
            </article>

            <article class="gg-nutrition-item">
              <div class="gg-nutrition-item__copy">
                <h3>Huesos y estructura</h3>
                <p>Calcio, D3 y K2 para complementar el cuidado diario de huesos.</p>
              </div>
              <span class="gg-nutrition-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M17 3a3 3 0 0 0-3 3v3h-4V6a3 3 0 1 0-3 3h3v6H7a3 3 0 1 0 3 3v-3h4v3a3 3 0 1 0 3-3h-3V9h3a3 3 0 0 0 0-6Z"/></svg>
              </span>
            </article>

            <article class="gg-nutrition-item">
              <div class="gg-nutrition-item__copy">
                <h3>Metabolismo proteico</h3>
                <p>Aminoacidos seleccionados para acompanar la formula diaria.</p>
              </div>
              <span class="gg-nutrition-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M8 15c-2.2-.7-3.5-2.1-3.5-4.1 0-2.9 2.7-5.4 6.1-5.4 2.5 0 4.6 1.3 5.6 3.1"/><path d="M16 9c2.2.7 3.5 2.1 3.5 4.1 0 2.9-2.7 5.4-6.1 5.4-2.5 0-4.6-1.3-5.6-3.1"/><path d="M7 9h4v4"/><path d="M17 15h-4v-4"/></svg>
              </span>
            </article>
          </div>

          <div class="gg-nutrition__center">
            <img src="/assets/nutri2.png" alt="Frasco MelloRise con gomitas y nutrientes destacados" width="1080" height="1080" loading="lazy">
          </div>

          <div class="gg-nutrition__side gg-nutrition__side--right">
            <article class="gg-nutrition-item">
              <span class="gg-nutrition-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M7 16c1.2-2.4 2.6-3.8 4.8-4.6"/><path d="M12 3c.3 3.7-.7 6.2-3.1 8.3C7 13 6 15 6 17.5A3.5 3.5 0 0 0 9.5 21c2.6 0 4.3-1.7 5.5-4.7"/><path d="M15 8c2.5.6 4 2.6 4 5.1 0 3.7-2.9 6.9-7.4 7.8"/></svg>
              </span>
              <div class="gg-nutrition-item__copy">
                <h3>Habitos simples</h3>
                <p>Ingredientes pensados para una rutina diaria sin complicar la manana.</p>
              </div>
            </article>

            <article class="gg-nutrition-item">
              <span class="gg-nutrition-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
              </span>
              <div class="gg-nutrition-item__copy">
                <h3>Apoyo inmune diario</h3>
                <p>Zinc y D3 forman parte de funciones normales del organismo.</p>
              </div>
            </article>

            <article class="gg-nutrition-item">
              <span class="gg-nutrition-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z"/><path d="M8 11h.01"/><path d="M11 8h.01"/><path d="M12 15h.01"/></svg>
              </span>
              <div class="gg-nutrition-item__copy">
                <h3>Rutina tranquila</h3>
                <p>Formato facil de recordar antes de la escuela o del descanso.</p>
              </div>
            </article>
          </div>
        </div>

        <div class="gg-nutrition-cta">
          <a class="gg-nutrition-cta__button" href="#comprar">SHOP MELLORISE NOW <span aria-hidden="true">→</span></a>
          <div class="gg-nutrition-cta__guarantee">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3.5 5.5 6.2v5.1c0 4.2 2.6 7.9 6.5 9.2 3.9-1.3 6.5-5 6.5-9.2V6.2L12 3.5Z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>90 Day Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>

    <div class="gg-ritual-section" id="ritual-diario">
      <div class="gg-shell gg-ritual">
        <div class="gg-ritual__media">
          <img src="/assets/cook.png" alt="Frasco MelloRise con ingredientes en una superficie de cocina" width="1254" height="1254" loading="lazy">
        </div>

        <div class="gg-ritual__copy">
          <span class="gg-ritual__eyebrow">Como usar</span>
          <h2>El ritual diario <span>sin complicar la manana</span></h2>
          <p>Incluye las gummies en una rutina familiar constante, junto con alimentacion equilibrada, agua y buen descanso.</p>

          <ol class="gg-ritual__steps" aria-label="Rutina diaria sugerida">
            <li>
              <span>1</span>
              <div>
                <h3>Dos gummies al dia</h3>
                <p>Sigue siempre la dosis indicada en la etiqueta real del producto.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <h3>Mantente hidratado</h3>
                <p>Una rutina simple funciona mejor cuando tambien hay hidratacion durante el dia.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <h3>La constancia gana</h3>
                <p>Mantenlo como un habito diario facil de recordar antes de escuela o desayuno.</p>
              </div>
            </li>
            <li>
              <span>4</span>
              <div>
                <h3>Buen descanso</h3>
                <p>Combinalo con horarios de sueno saludables y acompanamiento familiar.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div class="gg-freefrom-carousel" aria-label="Ingredientes que MelloRise evita">
      <div class="gg-freefrom-carousel__track" aria-hidden="true">
        <template v-for="repeat in 2" :key="repeat">
          <span><i>×</i>Gluten</span>
          <span><i>×</i>GMO</span>
          <span><i>×</i>Artificial Colors</span>
          <span><i>×</i>Hormone</span>
          <span><i>×</i>Artificial</span>
          <span><i>×</i>Gluten</span>
          <span><i>×</i>GMO</span>
          <span><i>×</i>Artificial Colors</span>
          <span><i>×</i>Hormone</span>
          <span><i>×</i>Artificial</span>
        </template>
      </div>
    </div>

    <div class="gg-compare-section" id="comparacion">
      <div class="gg-shell gg-compare">
        <div class="gg-compare__copy">
          <span class="gg-compare__eyebrow">Por que elegir MelloRise</span>
          <h2>MelloRise frente a <span>opciones genericas</span></h2>
          <p>Nutrientes seleccionados en una gummy practica para la rutina diaria.</p>
          <a class="gg-compare__cta" href="#comprar">Comprar MelloRise ahora</a>
          <p class="gg-compare__note">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
            Compra protegida por las politicas de la tienda.
          </p>
        </div>

        <div class="gg-compare__table" aria-label="Comparacion entre MelloRise y multivitaminas genericas">
          <div class="gg-compare__features">
            <div class="gg-compare__head">Caracteristicas</div>
            <div>Calcio y vitamina D3</div>
            <div>Apoyo diario para huesos</div>
            <div>Nutrientes para crecimiento</div>
            <div>Zinc y magnesio</div>
            <div>Formato facil para ninos</div>
            <div>Etiqueta clara</div>
            <div>Rutina simple</div>
            <div>Sabor tipo gummy</div>
          </div>

          <div class="gg-compare__brand">
            <img class="gg-compare__product" src="/assets/derram.png" alt="Frasco MelloRise con gomitas" width="1080" height="1080" loading="lazy">
            <div class="gg-compare__brand-logo">
              <img src="/assets/logo-oficial.png" alt="MelloRise" width="220" height="110" loading="lazy">
            </div>
            <div v-for="feature in 8" :key="feature"><span class="gg-compare__check" aria-label="Si"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg></span></div>
          </div>

          <div class="gg-compare__generic">
            <div class="gg-compare__head">Multivitaminas genericas</div>
            <div v-for="feature in 8" :key="feature"><span class="gg-compare__dash" aria-label="No destacado"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="gg-proof-section" id="confianza">
      <div class="gg-shell gg-proof">
        <div class="gg-proof__copy">
          <span class="gg-proof__eyebrow">Pensado para familias</span>
          <h2>Formula clara, <span>rutina facil de mantener</span></h2>
          <p>MelloRise combina una presentacion amigable con informacion visible en la etiqueta para que la rutina diaria sea mas sencilla.</p>

          <ul class="gg-proof__list" aria-label="Diferenciales destacados en la etiqueta">
            <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>Sin colorantes artificiales</li>
            <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>Vegan</li>
            <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>Gluten free</li>
            <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>Nutrientes como K2, D3, zinc y calcio</li>
            <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>Formato gummy para una rutina simple</li>
          </ul>

          <a class="gg-proof__cta" href="#comprar">Empezar mi rutina</a>
          <p class="gg-proof__note">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
            Revisa siempre la etiqueta y las politicas reales de la tienda.
          </p>
        </div>

        <div class="gg-proof__media">
          <img src="/assets/compose.png" alt="Frasco MelloRise Heightener Gummies abierto con gomitas" width="1254" height="1254" loading="lazy">
        </div>

        <div class="gg-proof__stats" aria-label="Resumen de la rutina">
          <article>
            <strong>Etiqueta clara</strong>
            <span>Ingredientes destacados de forma facil de revisar.</span>
          </article>
          <article>
            <strong>Rutina diaria</strong>
            <span>Formato practico para acompanar habitos constantes.</span>
          </article>
          <article>
            <strong>Compra guiada</strong>
            <span>Bundles listos para elegir segun la necesidad familiar.</span>
          </article>
        </div>
      </div>
    </div>

    <div class="gg-matrix-section" id="matriz">
      <div class="gg-shell gg-matrix">
        <div class="gg-matrix__head">
          <span class="gg-matrix__eyebrow">La ciencia</span>
          <h2>La matriz de <span>apoyo nutricional</span></h2>
          <p>Minerales, vitaminas y aminoacidos reunidos en una rutina diaria simple.</p>
        </div>

        <div class="gg-matrix__grid">
          <article v-for="item in ['Calcio en la rutina', 'Vitamina K2 + D3', 'Zinc y magnesio', 'L-Arginina', 'L-Ornitina', 'L-Glutamina']" :key="item" class="gg-matrix-card">
            <span class="gg-matrix-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"/></svg></span>
            <h3>{{ item }}</h3>
            <p>Ingrediente dentro del perfil nutricional de la rutina MelloRise.</p>
          </article>
        </div>
      </div>
    </div>

    <div class="gg-difference-section" id="diferencia">
      <div class="gg-shell gg-difference">
        <div class="gg-difference__head">
          <span class="gg-difference__eyebrow">Ver la diferencia</span>
          <h2>Rutinas que inspiran a <span>familias y ninos</span></h2>
        </div>

        <div class="gg-difference__grid">
          <article v-for="(image, index) in ['/assets/TESTIMONI1.webp', '/assets/TESTIMONI2.png', '/assets/TESTIMONI3.png']" :key="image" class="gg-difference-card">
            <div class="gg-difference-card__media">
              <img :src="image" alt="Imagen testimonial de referencia compartida por cliente" width="1024" height="1024" loading="lazy">
            </div>
            <div class="gg-difference-card__body">
              <span class="gg-difference-card__quote" aria-hidden="true">&ldquo;</span>
              <div class="gg-difference-card__stars" aria-label="Cinco estrellas">
                <span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              </div>
              <h3>{{ ['Una rutina mas facil de mantener', 'Sabor gummy que ayuda a la constancia', 'Mas simple que varios frascos'][index] }}</h3>
              <p>{{ ['Un formato diario pensado para acompanarte en mananas ocupadas, con una experiencia simple para toda la familia.', 'Una opcion practica para convertir el apoyo nutricional en un habito diario facil de recordar.', 'Una presentacion clara para reunir ingredientes seleccionados en una sola rutina diaria.'][index] }}</p>
              <footer>Resena editable de cliente</footer>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="gg-section gg-section--blue" id="beneficios">
      <div class="gg-shell">
        <div class="gg-section__head">
          <span class="gg-eyebrow">Hecho para familias</span>
          <h2 class="gg-heading">Por que familias eligen la rutina MelloRise</h2>
          <p class="gg-subhead">Cuatro razones para mantener una rutina diaria simple, clara y facil de recordar.</p>
        </div>
        <div class="gg-benefits">
          <article class="gg-benefit">
            <div class="gg-benefit__icon">Ca</div>
            <h3>Apoyo diario</h3>
            <p>2 gummies al dia para una rutina nutricional simple.</p>
          </article>
          <article class="gg-benefit">
            <div class="gg-benefit__icon">D3</div>
            <h3>Todo en uno</h3>
            <p>Vitaminas y minerales seleccionados en formato gummy.</p>
          </article>
          <article class="gg-benefit">
            <div class="gg-benefit__icon">Zn</div>
            <h3>Manana facil</h3>
            <p>Sin mezclas ni preparacion, antes de la escuela.</p>
          </article>
          <article class="gg-benefit">
            <div class="gg-benefit__icon">AM</div>
            <h3>Para ninos</h3>
            <p>Una rutina sencilla para familias en crecimiento.</p>
          </article>
        </div>
      </div>
    </div>

    <div class="gg-section" id="rutina">
      <div class="gg-shell gg-split">
        <div class="gg-split__media">
          <img src="/assets/gummy-morning.png" alt="Goma integrada a una rutina diaria" width="1851" height="1879" loading="lazy">
        </div>
        <div>
          <span class="gg-eyebrow">Rutina diaria</span>
          <h2 class="gg-heading">Una rutina sencilla para todos los dias</h2>
          <p class="gg-subhead">Incluye MelloRise dentro de habitos familiares constantes y faciles de recordar.</p>
          <ul class="gg-list">
            <li><b>1</b><span>Incluye la goma en una rutina constante y facil de recordar.</span></li>
            <li><b>2</b><span>Acompanala con alimentacion variada, descanso y actividad fisica.</span></li>
            <li><b>3</b><span>Consulta a un profesional si tienes dudas sobre ingredientes o uso familiar.</span></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="gg-section">
      <div class="gg-shell">
        <div class="gg-section__head">
          <span class="gg-eyebrow">Vida diaria</span>
          <h2 class="gg-heading">Una experiencia pensada para familias</h2>
        </div>
        <div class="gg-story-grid">
          <article class="gg-story-card">
            <div class="gg-story-card__media"><img src="/assets/gummy-lifestyle-1.png" alt="Frasco de gummies en una escena clara" width="2048" height="2048" loading="lazy"></div>
            <div class="gg-story-card__body"><h3>Sabor facil</h3><p>Formato tipo gummy para una rutina mas simple que capsulas o polvos.</p></div>
          </article>
          <article class="gg-story-card">
            <div class="gg-story-card__media"><img src="/assets/gummy-lifestyle-2.png" alt="Detalle del producto gummy" width="2048" height="2048" loading="lazy"></div>
            <div class="gg-story-card__body"><h3>Uso cotidiano</h3><p>Una presentacion pensada para mantenerse visible y facil de incorporar al dia.</p></div>
          </article>
          <article class="gg-story-card">
            <div class="gg-story-card__media"><img src="/assets/gummy-lifestyle-3.png" alt="Producto gummy con acabado premium" width="2048" height="2048" loading="lazy"></div>
            <div class="gg-story-card__body"><h3>Compra guiada</h3><p>Opciones claras para elegir una unidad, rutina completa o mayor valor.</p></div>
          </article>
        </div>
      </div>
    </div>

    <div class="gg-photo-reviews-section" id="reviews">
      <div class="gg-shell gg-photo-reviews">
        <div class="gg-photo-reviews__head">
          <span class="gg-photo-reviews__eyebrow">Reviews</span>
          <h2>Lo que dicen las familias</h2>
          <p>Una seccion visual para destacar opiniones y fotos reales cuando esten verificadas por la tienda.</p>
        </div>

        <div class="gg-photo-reviews__summary" aria-label="Resumen de resenas">
          <div class="gg-photo-reviews__score">
            <span>Promedio</span>
            <strong>5</strong>
            <div class="gg-photo-reviews__stars" aria-label="Cinco estrellas">★★★★★</div>
          </div>
          <div class="gg-photo-reviews__bars" aria-label="Distribucion visual de resenas">
            <div><span>5 ★</span><i style="--fill: 97%"></i><em>97%</em></div>
            <div><span>4 ★</span><i style="--fill: 3%"></i><em>3%</em></div>
            <div><span>3 ★</span><i style="--fill: 0%"></i><em>0%</em></div>
            <div><span>2 ★</span><i style="--fill: 0%"></i><em>0%</em></div>
            <div><span>1 ★</span><i style="--fill: 0%"></i><em>0%</em></div>
          </div>
          <a class="gg-photo-reviews__button" href="#comprar">Escribir una resena</a>
        </div>

        <div class="gg-photo-reviews__meta">
          <span>Resenas con fotos</span>
          <span>Ultimas <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
        </div>

        <div class="gg-photo-reviews__grid">
          <article v-for="review in [
            ['/assets/review-photo-routine.png', 'A', 'Amelia', 'Rutina mas facil', 'Formato practico para mantener una rutina familiar simple.'],
            ['/assets/review-photo-bottle.jpg', 'N', 'Anna', 'Producto claro', 'Una presentacion facil de revisar y agregar al dia.'],
            ['/assets/review-photo-desk.jpg', 'M', 'Mira', 'Uso cotidiano', 'La experiencia gummy ayuda a que la rutina se sienta sencilla.'],
            ['/assets/review-photo-family.jpg', 'L', 'Lin', 'Compra guiada', 'Informacion organizada para elegir con mas confianza.']
          ]" :key="review[0]" class="gg-photo-review-card">
            <div class="gg-photo-review-card__media">
              <img :src="review[0]" alt="Foto de rutina familiar con gummies MelloRise" width="1024" height="1024" loading="lazy">
            </div>
            <div class="gg-photo-review-card__body">
              <div class="gg-photo-review-card__author"><b>{{ review[1] }}</b><span>{{ review[2] }}</span></div>
              <div class="gg-photo-reviews__stars" aria-label="Cinco estrellas">★★★★★</div>
              <h3>{{ review[3] }}</h3>
              <p>{{ review[4] }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="gg-sticky" aria-label="Compra rapida">
      <div class="gg-sticky__text">
        <strong>{{ localizedProductTitle }}</strong>
        <span>{{ currentPrice }}</span>
      </div>
      <button class="gg-button gg-button--blue" type="button" @click="submitCart">{{ t('product.addToCart') }}</button>
    </div>
  </section>
</template>
