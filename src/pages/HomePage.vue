<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// Welcome discount auth flow is paused while checkout runs directly through Stripe.
// import { useAuth, useUser } from '@clerk/vue'
// import { createWelcomeDiscount } from '../services/discounts'

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  activeDiscount: {
    type: Object,
    default: null
  },
  clerkEnabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['discount-created'])

const { t } = useI18n()
// Auth is disabled temporarily; keep inert refs so this component stays reversible.
// const authState = props.clerkEnabled ? useAuth() : { isLoaded: ref(true), isSignedIn: ref(false), getToken: ref(async () => '') }
// const userState = props.clerkEnabled ? useUser() : { user: ref(null) }
const authState = {
  isLoaded: ref(true),
  isSignedIn: ref(false),
  getToken: ref(async () => '')
}
const { isLoaded: isAuthLoaded, isSignedIn, getToken } = authState
// const { user } = userState

const announcementItems = ['Sin hormonas', 'Etiqueta clara', 'Uso responsable', 'Sin gluten', 'Ingredientes seleccionados']
const nutrients = [
  {
    titleKey: 'home.nutrients.items.calcium.title',
    textKey: 'home.nutrients.items.calcium.text',
    icon: ['M7.5 13.5c-1.2-1.2-1.2-3.1 0-4.3s3.1-1.2 4.3 0l2.9 2.9c1.2 1.2 1.2 3.1 0 4.3s-3.1 1.2-4.3 0l-2.9-2.9Z', 'M12.5 8.2l3-3c1.2-1.2 3.1-1.2 4.3 0s1.2 3.1 0 4.3l-3 3', 'M11.5 15.8l-3 3c-1.2 1.2-3.1 1.2-4.3 0s-1.2-3.1 0-4.3l3-3']
  },
  {
    titleKey: 'home.nutrients.items.magnesium.title',
    textKey: 'home.nutrients.items.magnesium.text',
    icon: ['M5 18c2.8-5.3 5.8-8.6 13-12', 'M9 7c2 2.1 3.3 4.2 3.8 6.3', 'M7 15c2.7-.2 5.4.5 8 2.2', 'M18 6c.2 3.4-.3 6.1-1.5 8']
  },
  {
    titleKey: 'home.nutrients.items.boron.title',
    textKey: 'home.nutrients.items.boron.text',
    icon: ['M12 3v18', 'M7 7l10 10', 'M17 7 7 17', 'M7 12h10']
  },
  {
    titleKey: 'home.nutrients.items.zinc.title',
    textKey: 'home.nutrients.items.zinc.text',
    icon: ['M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z', 'm9 12 2 2 4-4']
  },
  {
    titleKey: 'home.nutrients.items.vitaminD3.title',
    textKey: 'home.nutrients.items.vitaminD3.text',
    icon: ['M12 6.5v-3', 'M12 20.5v-3', 'M6.5 12h-3', 'M20.5 12h-3', 'm7.8 7.8-2.1-2.1', 'm18.3 18.3-2.1-2.1', 'm16.2 7.8 2.1-2.1', 'm5.7 18.3 2.1-2.1', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z']
  },
  {
    titleKey: 'home.nutrients.items.vitaminK2.title',
    textKey: 'home.nutrients.items.vitaminK2.text',
    icon: ['M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z', 'M12 8v8', 'M9 11l3-3 3 3']
  },
  {
    titleKey: 'home.nutrients.items.arginine.title',
    textKey: 'home.nutrients.items.arginine.text',
    icon: ['M8 20c-1.7-1.1-2.5-2.5-2.5-4.4 0-2.7 2.1-5.1 5-5.1h1.2C11.8 5 13 3.7 15 3.7c2.2 0 4 1.8 4 4 0 3.6-3.8 5.3-6.4 7.2-1.5 1.1-2.5 2.3-2.6 4.1', 'M14 12.4h4.5', 'M16.5 10.2l2 2.2-2 2.2']
  },
  {
    titleKey: 'home.nutrients.items.ornithine.title',
    textKey: 'home.nutrients.items.ornithine.text',
    icon: ['M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z', 'M5 19l2-2', 'M17 7l2-2']
  }
]
const ingredientMapColumns = [
  [
    {
      titleKey: 'home.ingredientMap.items.calcium.title',
      textKey: 'home.ingredientMap.items.calcium.text',
      image: '/assets/gummy-ingredient-calcium.png'
    },
    {
      titleKey: 'home.ingredientMap.items.magnesium.title',
      textKey: 'home.ingredientMap.items.magnesium.text',
      image: '/assets/gummy-ingredient-magnesium.png'
    },
    {
      titleKey: 'home.ingredientMap.items.vitaminK2.title',
      textKey: 'home.ingredientMap.items.vitaminK2.text',
      image: '/assets/gummy-ingredient-k2.avif'
    },
    {
      titleKey: 'home.ingredientMap.items.arginine.title',
      textKey: 'home.ingredientMap.items.arginine.text',
      image: '/assets/gummy-ingredient-arginine.png'
    }
  ],
  [
    {
      titleKey: 'home.ingredientMap.items.zinc.title',
      textKey: 'home.ingredientMap.items.zinc.text',
      image: '/assets/gummy-ingredient-zinc.png'
    },
    {
      titleKey: 'home.ingredientMap.items.vitaminD3.title',
      textKey: 'home.ingredientMap.items.vitaminD3.text',
      image: '/assets/gummy-ingredient-d3.png'
    },
    {
      titleKey: 'home.ingredientMap.items.ornithine.title',
      textKey: 'home.ingredientMap.items.ornithine.text',
      image: '/assets/gummy-ingredient-ornithine.png'
    },
    {
      titleKey: 'home.ingredientMap.items.glutamine.title',
      textKey: 'home.ingredientMap.items.glutamine.text',
      image: '/assets/gummy-ingredient-glutamine.png'
    }
  ]
]
const reviews = [
  'Nos gustó que MelloRise reuniera vitaminas, minerales y aminoácidos en una gummy fácil de explicar dentro de la rutina.',
  'El formato gummy hizo más sencillo mantener el hábito diario. Menos frascos en la mesa y una experiencia que mi hijo aceptó mejor.',
  'La compra fue clara desde el inicio: ingredientes, modo de uso y seguimiento del pedido quedaron fáciles de revisar.'
]
const scienceRows = [
  ['Calcio', '250 mg', '#17add3', '92%'],
  ['Vitamina D3', '15 mcg', '#f4c400', '88%'],
  ['Zinc', '10 mg', '#6951f5', '72%'],
  ['Magnesio', '100 mg', '#2e86bd', '70%'],
  ['L-Arginina', '100 mg', '#22ad55', '64%'],
  ['L-Glutamina', '50 mg', '#394a54', '54%']
]
const scienceCards = [
  ['Formulación enfocada', 'Nutrientes seleccionados para presentar una rutina clara, práctica y fácil de entender.'],
  ['Formato conveniente', 'Una alternativa tipo gummy para familias que prefieren una experiencia simple frente a cápsulas o polvos.'],
  ['Mezcla equilibrada', 'La composición reúne vitaminas, minerales y aminoácidos en una presentación organizada.'],
  ['Información editable', 'Textos preparados para ajustarse a la etiqueta real del producto antes de publicar.']
]
const journeySteps = [
  'selection',
  'preparation',
  'review',
  'care',
  'packaging',
  'delivery'
]
const homeFaqs = [
  'what',
  'who',
  'benefits',
  'usage',
  'quality',
  'shipping'
]
const comparisonPositive = [
  'Apoyo nutricional en una gummy',
  'Fácil de incorporar al día',
  'Formato pensado para familias',
  'Rutina más práctica',
  'Sabor amigable para niños'
]
const comparisonNegative = [
  'Varios suplementos',
  'Difícil de recordar',
  'Más pasos cada mañana',
  'Rutina confusa',
  'Menos práctico para niños'
]

const OFFER_LOAD_COUNT_KEY = 'mellorise-offer-load-count'
const PENDING_OFFER_KEY = 'mellorise-pending-welcome-discount'
const isOfferVisible = ref(false)
const isOfferExitConfirmVisible = ref(false)
const homeOfferRemainingSeconds = ref(30 * 60)
const offerError = ref('')
const isOfferSubmitting = ref(false)
const openHomeFaqIndex = ref(null)
const homeRoot = ref(null)
const densityCard = ref(null)
const isDensityVisible = ref(false)
let densityObserver
let revealObserver
let homeOfferDelayTimer = 0
let homeOfferCountdownTimer = 0
const HOME_OFFER_DELAY_MS = 10 * 1000
const HOME_OFFER_DURATION_MS = 30 * 60 * 1000
const HOME_OFFER_TIMER_STORAGE_KEY = 'mellorise-offer-expires-at'
const signedInEmail = computed(() => '')
const offerClaimLabel = computed(() => {
  if (isOfferSubmitting.value || !isAuthLoaded.value) return t('home.offer.loading')
  return isSignedIn.value ? t('home.offer.claim') : t('home.offer.signInClaim')
})
const homeOfferTimerText = computed(() => {
  const minutes = Math.floor(homeOfferRemainingSeconds.value / 60)
  const seconds = homeOfferRemainingSeconds.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})
const homeOfferTimerParts = computed(() => {
  const totalSeconds = Math.max(0, homeOfferRemainingSeconds.value)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    { key: 'hours', value: hours, label: t('home.offer.hours') },
    { key: 'minutes', value: minutes, label: t('home.offer.minutes') },
    { key: 'seconds', value: seconds, label: t('home.offer.seconds') }
  ].map((part) => ({
    ...part,
    value: String(part.value).padStart(2, '0')
  }))
})

const revealSelectors = [
  '.gh-ticker',
  '.gh-hero__content',
  '.gh-hero__media',
  '.gh-strip',
  '.gh-nutrients__head',
  '.gh-nutrient',
  '.gh-ingredient-map__head',
  '.gh-ingredient-card',
  '.gh-ingredient-map__center',
  '.gh-ingredient-map__cta',
  '.gh-science__intro',
  '.gh-density',
  '.gh-science-card',
  '.gh-journey__head',
  '.gh-journey__step',
  '.mello-home-faq__media',
  '.mello-home-faq__header',
  '.mello-home-faq__item',
  '.mello-home-cta__card',
  '.mello-compare__header',
  '.mello-compare__card',
  '.mello-compare__cta-wrap',
  '.mello-testimonials__head',
  '.mello-testimonials__card'
]

function setupScrollReveal() {
  if (!homeRoot.value) return

  const revealItems = [...homeRoot.value.querySelectorAll(revealSelectors.join(','))]
  if (!revealItems.length) return

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach((element) => {
      element.classList.add('gh-scroll-reveal', 'is-visible')
    })
    return
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        revealObserver?.unobserve(entry.target)
      })
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12
    }
  )

  revealItems.forEach((element, index) => {
    element.classList.add('gh-scroll-reveal')
    element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 45}ms`)
    revealObserver.observe(element)
  })
}

function shouldShowOffer() {
  // Auth-backed welcome offer is paused for the direct checkout period.
  return false

  if (typeof window === 'undefined') return false

  const currentCount = Number(window.localStorage.getItem(OFFER_LOAD_COUNT_KEY) || 0)
  const nextCount = currentCount + 1
  window.localStorage.setItem(OFFER_LOAD_COUNT_KEY, String(nextCount))

  return nextCount % 4 === 0
}

function closeOffer() {
  isOfferVisible.value = false
  isOfferExitConfirmVisible.value = false
}

function requestCloseOffer() {
  closeOffer()
}

function keepOffer() {
  isOfferExitConfirmVisible.value = false
}

function confirmCloseOffer() {
  clearPendingOffer()
  closeOffer()
}

async function claimWelcomeOffer() {
  if (isOfferSubmitting.value) return

  offerError.value = ''
  offerError.value = t('home.offer.error')
  return

  if (!isAuthLoaded.value) {
    return
  }

  if (!isSignedIn.value) {
    redirectToOfferLogin()
    return
  }

  if (!signedInEmail.value) {
    offerError.value = t('home.offer.missingEmail')
    return
  }

  isOfferSubmitting.value = true

  try {
    // const token = await getToken.value()
    // const discount = await createWelcomeDiscount({ token })
    // emit('discount-created', discount)
    clearPendingOffer()
    closeOffer()
    window.history.pushState({}, '', '/products/mellorise-heightener-gummies-2026')
    window.dispatchEvent(new Event('popstate'))
  } catch (error) {
    offerError.value = error.message || t('home.offer.error')
  } finally {
    isOfferSubmitting.value = false
  }
}

function redirectToOfferLogin() {
  return

  if (typeof window === 'undefined') return

  window.sessionStorage.setItem(PENDING_OFFER_KEY, '1')
  const redirectPath = '/?claim_discount=1'
  window.history.pushState({}, '', `/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`)
  window.dispatchEvent(new Event('popstate'))
}

function clearPendingOffer() {
  if (typeof window === 'undefined') return

  window.sessionStorage.removeItem(PENDING_OFFER_KEY)
  if (window.location.search.includes('claim_discount=1')) {
    window.history.replaceState({}, '', '/')
  }
}

function shouldResumePendingOffer() {
  return false

  if (typeof window === 'undefined') return false

  return (
    window.sessionStorage.getItem(PENDING_OFFER_KEY) === '1' ||
    new URLSearchParams(window.location.search).get('claim_discount') === '1'
  )
}

function resumePendingOffer() {
  if (!shouldResumePendingOffer() || props.activeDiscount?.code) return
  if (!isAuthLoaded.value) return

  isOfferVisible.value = true

  if (isSignedIn.value) {
    claimWelcomeOffer()
  }
}

function isHomeFaqOpen(index) {
  return openHomeFaqIndex.value === index
}

function toggleHomeFaq(index) {
  openHomeFaqIndex.value = isHomeFaqOpen(index) ? null : index
}

function getHomeOfferExpiry() {
  if (typeof window === 'undefined') return Date.now() + HOME_OFFER_DURATION_MS

  const savedExpiry = Number(window.sessionStorage.getItem(HOME_OFFER_TIMER_STORAGE_KEY) || 0)
  if (savedExpiry > Date.now()) return savedExpiry

  const nextExpiry = Date.now() + HOME_OFFER_DURATION_MS
  window.sessionStorage.setItem(HOME_OFFER_TIMER_STORAGE_KEY, String(nextExpiry))
  return nextExpiry
}

function updateHomeOfferCountdown(expiry) {
  const remainingMs = Math.max(0, expiry - Date.now())
  homeOfferRemainingSeconds.value = Math.ceil(remainingMs / 1000)
}

onMounted(() => {
  const offerExpiry = getHomeOfferExpiry()
  updateHomeOfferCountdown(offerExpiry)
  homeOfferCountdownTimer = window.setInterval(() => updateHomeOfferCountdown(offerExpiry), 1000)
  homeOfferDelayTimer = window.setTimeout(() => {
    isOfferVisible.value = true
  }, HOME_OFFER_DELAY_MS)
  setupScrollReveal()

  if (!densityCard.value) return

  if (!('IntersectionObserver' in window)) {
    isDensityVisible.value = true
    return
  }

  densityObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      isDensityVisible.value = true
      densityObserver?.disconnect()
    },
    {
      rootMargin: '0px 0px -18% 0px',
      threshold: 0.35
    }
  )

  densityObserver.observe(densityCard.value)
})

watch([isAuthLoaded, isSignedIn], () => {
  resumePendingOffer()
})

onUnmounted(() => {
  if (homeOfferDelayTimer) {
    window.clearTimeout(homeOfferDelayTimer)
  }

  if (homeOfferCountdownTimer) {
    window.clearInterval(homeOfferCountdownTimer)
  }

  densityObserver?.disconnect()
  revealObserver?.disconnect()
})
</script>

<template>
  <section ref="homeRoot" class="gummy-home" data-section-id="vue-gummy-home">
    <div class="gh-ticker" aria-label="Sin hormonas, Etiqueta clara, Uso responsable, Sin gluten, Ingredientes seleccionados">
      <div class="gh-ticker__track" aria-hidden="true">
        <template v-for="repeat in 4" :key="repeat">
          <span v-for="item in announcementItems" :key="`${repeat}-${item}`">{{ item }}</span>
        </template>
      </div>
    </div>

    <div class="gh-hero" style="--gh-hero-image: url(/assets/gummy-home-hero-wide-logo.png);">
      <div class="gh-shell gh-hero__grid">
        <div class="gh-hero__content">
          <span class="gh-eyebrow">Rutina diaria para familias</span>
          <h1 class="gh-title">Apoyo nutricional en una gummy simple</h1>
          <p class="gh-copy">MelloRise acompaña una rutina equilibrada con vitaminas, minerales e ingredientes seleccionados en un formato fácil de incorporar al día.</p>
          <div class="gh-hero__actions">
            <a class="gh-button" href="/products/mellorise-heightener-gummies-2026">Comprar MelloRise</a>
            <a class="gh-button gh-button--blue" href="#formula">Ver fórmula</a>
            <span class="gh-note">Uso responsable conforme a la etiqueta real del producto.</span>
          </div>
        </div>
        <div class="gh-hero__media">
          <img class="gh-hero__media-fallback" src="/assets/gummy-home-hero-wide-logo.png" alt="MelloRise Heightener Gummies" width="1672" height="941" loading="eager">
        </div>
      </div>
    </div>

    <div class="gh-strip">
      <div class="gh-strip__track" aria-label="Beneficios principales">
        <div v-for="group in 2" :key="group" class="gh-strip__group" :aria-hidden="group === 2">
          <div v-for="item in announcementItems" :key="`${group}-${item}`" class="gh-strip__item">
            <span class="gh-strip__icon">
              <svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.4-2.7 7.4-7 10-4.3-2.6-7-5.6-7-10V6l7-3Zm-3 8 2 2 4-4"/></svg>
            </span>
            <strong>{{ item }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="gh-section gh-nutrients" id="nutrientes">
      <img class="gh-nutrients__spoon" src="/assets/colher.png" alt="" width="320" height="246" loading="eager" aria-hidden="true">
      <div class="gh-pattern" aria-hidden="true">
        <span class="gh-pattern__item gh-pattern__item--leaf">
          <svg viewBox="0 0 24 24"><path d="M5 19c8-1 13-7 14-14-7 1-13 6-14 14Zm0 0c3-4 6-6 10-8"/></svg>
        </span>
        <span class="gh-pattern__item gh-pattern__item--star">
          <svg viewBox="0 0 24 24"><path d="M12 3l2.2 6.2L21 12l-6.8 2.8L12 21l-2.2-6.2L3 12l6.8-2.8L12 3Z"/></svg>
        </span>
        <span class="gh-pattern__item gh-pattern__item--heart">
          <svg viewBox="0 0 24 24"><path d="M20.8 8.4c0 5.1-8.8 10.6-8.8 10.6S3.2 13.5 3.2 8.4A4.4 4.4 0 0 1 11 5.6l1 1.1 1-1.1a4.4 4.4 0 0 1 7.8 2.8Z"/></svg>
        </span>
        <span class="gh-pattern__item gh-pattern__item--ruler">
          <svg viewBox="0 0 24 24"><path d="M7 3h10v18H7z"/><path d="M11 7h6"/><path d="M13 11h4"/><path d="M11 15h6"/></svg>
        </span>
        <span class="gh-pattern__item gh-pattern__item--sun">
          <svg viewBox="0 0 24 24"><path d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"/><path d="M12 2.5v2.4"/><path d="M12 19.1v2.4"/><path d="M4.9 4.9l1.7 1.7"/><path d="m17.4 17.4 1.7 1.7"/><path d="M2.5 12h2.4"/><path d="M19.1 12h2.4"/><path d="m4.9 19.1 1.7-1.7"/><path d="m17.4 6.6 1.7-1.7"/></svg>
        </span>
        <span class="gh-pattern__item gh-pattern__item--gummy">
          <svg viewBox="0 0 24 24"><path d="M7.5 7.5h9a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4Z"/><path d="M8.5 10h.01"/><path d="M12 14h.01"/><path d="M15.5 10.5h.01"/></svg>
        </span>
        <span class="gh-pattern__item gh-pattern__item--spark">
          <svg viewBox="0 0 24 24"><path d="M8.5 3l1.6 4.4 4.4 1.6-4.4 1.6L8.5 15l-1.6-4.4L2.5 9l4.4-1.6L8.5 3Z"/><path d="M17 10l1.1 3 3 1.1-3 1.1-1.1 3-1.1-3-3-1.1 3-1.1L17 10Z"/></svg>
        </span>
        <span class="gh-pattern__item gh-pattern__item--apple">
          <svg viewBox="0 0 24 24"><path d="M12 7c2.5-2.1 6.4-.9 7 2.8.7 4.2-2.4 9.4-5.1 10.1-1 .3-1.5-.4-1.9-.4s-.9.7-1.9.4C7.4 19.2 4.3 14 5 9.8 5.6 6.1 9.5 4.9 12 7Z"/><path d="M12 7c.1-2.2 1.1-3.7 3.3-4.4"/></svg>
        </span>
      </div>
      <div class="gh-shell gh-nutrients__shell">
        <div class="gh-head gh-nutrients__head">
          <span class="gh-pill">{{ t('home.nutrients.badge') }}</span>
          <h2 class="gh-heading">{{ t('home.nutrients.title') }} <strong>{{ t('home.nutrients.titleStrong') }}</strong></h2>
          <p class="gh-subhead">{{ t('home.nutrients.intro') }}</p>
        </div>
        <div class="gh-nutrient-grid">
          <article v-for="nutrient in nutrients" :key="nutrient.titleKey" class="gh-nutrient">
            <span class="gh-nutrient__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path v-for="path in nutrient.icon" :key="path" :d="path"/>
              </svg>
            </span>
            <h3>{{ t(nutrient.titleKey) }}</h3>
            <p>{{ t(nutrient.textKey) }}</p>
          </article>
        </div>
      </div>
    </div>

    <div class="gh-section gh-ingredient-map" id="ingredientes">
      <img class="gh-ingredient-map__fruit" src="/assets/gummy-ingredients-fruit.png" alt="" width="200" height="183" loading="lazy" aria-hidden="true">
      <div class="gh-shell">
        <div class="gh-head gh-ingredient-map__head">
          <span class="gh-pill">{{ t('home.ingredientMap.badge') }}</span>
          <h2 class="gh-heading">{{ t('home.ingredientMap.title') }} <strong>{{ t('home.ingredientMap.titleStrong') }}</strong></h2>
          <p class="gh-subhead">{{ t('home.ingredientMap.intro') }}</p>
        </div>
        <div class="gh-ingredient-map__layout">
          <div class="gh-ingredient-map__side gh-ingredient-map__side--left">
            <article v-for="nutrient in ingredientMapColumns[0]" :key="nutrient.titleKey" class="gh-ingredient-card">
              <img :src="nutrient.image" :alt="t(nutrient.titleKey)" width="100" height="100" loading="lazy">
              <div><h3>{{ t(nutrient.titleKey) }}</h3><p>{{ t(nutrient.textKey) }}</p></div>
            </article>
          </div>
          <div class="gh-ingredient-map__center">
            <div class="gh-ingredient-lines" aria-hidden="true">
              <span class="gh-ingredient-line gh-ingredient-line--l1"></span>
              <span class="gh-ingredient-line gh-ingredient-line--l2"></span>
              <span class="gh-ingredient-line gh-ingredient-line--l3"></span>
              <span class="gh-ingredient-line gh-ingredient-line--l4"></span>
              <span class="gh-ingredient-line gh-ingredient-line--r1"></span>
              <span class="gh-ingredient-line gh-ingredient-line--r2"></span>
              <span class="gh-ingredient-line gh-ingredient-line--r3"></span>
              <span class="gh-ingredient-line gh-ingredient-line--r4"></span>
            </div>
            <img src="/assets/nutri2.png" alt="Frasco MelloRise Heightener Gummies con gomitas rojas" width="1080" height="1080" loading="lazy">
          </div>
          <div class="gh-ingredient-map__side gh-ingredient-map__side--right">
            <article v-for="nutrient in ingredientMapColumns[1]" :key="nutrient.titleKey" class="gh-ingredient-card gh-ingredient-card--right">
              <img :src="nutrient.image" :alt="t(nutrient.titleKey)" width="100" height="100" loading="lazy">
              <div><h3>{{ t(nutrient.titleKey) }}</h3><p>{{ t(nutrient.textKey) }}</p></div>
            </article>
          </div>
        </div>
        <div class="gh-ingredient-map__cta">
          <a class="gh-button" href="/products/mellorise-heightener-gummies-2026">Comprar MelloRise Gummies</a>
        </div>
      </div>
    </div>

    <div class="gh-section gh-science" id="formula">
      <div class="gh-shell gh-science__grid">
        <div class="gh-science__intro">
          <span class="gh-pill">Ciencia y formulación</span>
          <h2 class="gh-heading">Formulado con intención. <strong>Diseñado para una rutina nutricional clara.</strong></h2>
          <p class="gh-subhead">MelloRise combina nutrientes de apoyo en un formato simple. Esta sección organiza la información de la fórmula sin prometer resultados individuales.</p>

          <div ref="densityCard" class="gh-density" :class="{ 'is-visible': isDensityVisible }">
            <h3>Composición destacada por porción</h3>
            <div
              v-for="row in scienceRows"
              :key="row[0]"
              class="gh-density__row"
              :style="{ '--bar-color': row[2], '--bar-width': row[3] }"
            >
              <span>{{ row[0] }}</span><b></b><em>{{ row[1] }}</em>
            </div>
          </div>
        </div>

        <div class="gh-science__cards">
          <article v-for="card in scienceCards" :key="card[0]" class="gh-science-card">
            <span class="gh-science-card__icon">
              <svg viewBox="0 0 24 24"><path d="M9 3v5l-4 8a4 4 0 0 0 3.6 5h6.8A4 4 0 0 0 19 16l-4-8V3M8 3h8M7 15h10"/></svg>
            </span>
            <h3>{{ card[0] }}</h3>
            <p>{{ card[1] }}</p>
          </article>
        </div>
      </div>
    </div>

    <div class="gh-section gh-journey" id="proceso">
      <div class="gh-shell">
        <div class="gh-head gh-journey__head">
          <span class="gh-pill">{{ t('home.journey.badge') }}</span>
          <h2 class="gh-heading">{{ t('home.journey.title') }} <strong>{{ t('home.journey.titleStrong') }}</strong></h2>
          <p class="gh-subhead">{{ t('home.journey.intro') }}</p>
        </div>

        <div class="gh-journey__track" :aria-label="t('home.journey.ariaLabel')">
          <article v-for="(step, index) in journeySteps" :key="step" class="gh-journey__step">
            <span class="gh-journey__number">{{ index + 1 }}</span>
            <span class="gh-journey__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 19c8-1 13-7 14-14-7 1-13 6-14 14Zm0 0c3-4 6-6 10-8"/></svg>
            </span>
            <h3>{{ t(`home.journey.steps.${step}.title`) }}</h3>
            <p>{{ t(`home.journey.steps.${step}.text`) }}</p>
          </article>
        </div>
      </div>
    </div>

    <section class="mello-home-faq section-mellorise-home-faq-image" id="faq-home">
      <div class="mello-home-faq__media">
        <div class="mello-home-faq__media-inner">
          <img
            class="mello-home-faq__image"
            src="/assets/derram.png"
            alt="Frasco MelloRise Heightener Gummies con gummies"
            width="900"
            height="900"
            loading="lazy"
            :alt="t('home.faq.imageAlt')"
          >
        </div>
      </div>

      <div class="mello-home-faq__content">
        <div class="mello-home-faq__header">
          <span class="mello-home-faq__eyebrow">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3.75 5.25 6.7v5.1c0 4.3 2.86 6.97 6.75 8.45 3.89-1.48 6.75-4.15 6.75-8.45V6.7L12 3.75Z"/>
              <path d="m9.35 12.2 1.78 1.78 3.74-4.06"/>
            </svg>
            {{ t('home.faq.badge') }}
          </span>
          <h2 class="mello-home-faq__title">
            {{ t('home.faq.title') }}
            <span>{{ t('home.faq.titleStrong') }}</span>
          </h2>
          <p class="mello-home-faq__subheading">{{ t('home.faq.intro') }}</p>
        </div>

        <div class="mello-home-faq__list">
          <article
            v-for="(faq, index) in homeFaqs"
            :key="faq"
            class="mello-home-faq__item"
            :data-open="isHomeFaqOpen(index)"
          >
            <button
              class="mello-home-faq__summary"
              type="button"
              :aria-expanded="isHomeFaqOpen(index)"
              :aria-controls="`mello-home-faq-answer-${index}`"
              @click="toggleHomeFaq(index)"
            >
              <span class="mello-home-faq__number">{{ index + 1 }}</span>
              <span class="mello-home-faq__question">{{ t(`home.faq.items.${faq}.question`) }}</span>
              <span class="mello-home-faq__toggle" aria-hidden="true"></span>
            </button>
            <div
              :id="`mello-home-faq-answer-${index}`"
              class="mello-home-faq__answer"
              :aria-hidden="!isHomeFaqOpen(index)"
            >
              <div class="mello-home-faq__answer-inner">
                <p>{{ t(`home.faq.items.${faq}.answer`) }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="mello-home-cta section-mello-home-cta" id="comprar-home">
      <img class="mello-home-cta__decor mello-home-cta__decor--left" src="/assets/mellorise-cta-blueberries.png" alt="" width="250" height="267" loading="lazy" aria-hidden="true">
      <div class="mello-home-cta__inner">
        <div class="mello-home-cta__card">
          <div class="mello-home-cta__copy">
            <h2 class="mello-home-cta__title">Dale a tu hijo el apoyo nutricional <span>que merece.</span></h2>
            <p class="mello-home-cta__text">Nutrición diaria práctica con vitaminas, minerales e ingredientes seleccionados en dos gummies deliciosas para una rutina familiar simple.</p>
            <div class="mello-home-cta__actions">
              <a class="mello-home-cta__button mello-home-cta__button--primary" href="/products/mellorise-heightener-gummies-2026">Comprar MelloRise Gummies</a>
              <a class="mello-home-cta__button mello-home-cta__button--secondary" href="#ingredientes">Ver ingredientes</a>
            </div>
          </div>
          <div class="mello-home-cta__product">
            <img class="mello-home-cta__product-image" src="/assets/compose-sem-fundo.png" alt="MelloRise Heightener Gummies con gomitas" width="1254" height="1254" loading="lazy">
          </div>
        </div>
      </div>
      <img class="mello-home-cta__decor mello-home-cta__decor--right" src="/assets/mellorise-cta-spinach.png" alt="" width="300" height="300" loading="lazy" aria-hidden="true">
    </section>

    <section class="mello-compare section-mellorise-home-comparison" id="comparacion-home">
      <div class="mello-compare__inner">
        <div class="mello-compare__header">
          <span class="mello-compare__badge">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v18M7 6h10M5 10l-3 6h6l-3-6Zm14 0-3 6h6l-3-6ZM8 21h8"/>
            </svg>
            La comparación
          </span>
          <h2 class="mello-compare__title">
            No todas las gummies son
            <span>iguales</span>
          </h2>
          <p class="mello-compare__text">Mientras muchas rutinas terminan con varios frascos y pasos, MelloRise reúne apoyo nutricional diario en un formato simple para familias.</p>
        </div>

        <div class="mello-compare__grid">
          <article class="mello-compare__card mello-compare__card--mellorise">
            <div class="mello-compare__card-copy">
              <h3>MelloRise Heightener Gummies</h3>
              <ul class="mello-compare__list mello-compare__list--positive">
                <li v-for="item in comparisonPositive" :key="item">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 6.8"/></svg>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="mello-compare__product-wrap">
              <img
                class="mello-compare__product"
                src="/assets/derram.png"
                alt="Frasco MelloRise Heightener Gummies"
                width="900"
                height="900"
                loading="lazy"
              >
            </div>
          </article>

          <article class="mello-compare__card mello-compare__card--others">
            <div class="mello-compare__other-copy">
              <h3>Otros suplementos</h3>
              <ul class="mello-compare__list mello-compare__list--negative">
                <li v-for="item in comparisonNegative" :key="item">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="mello-compare__bottles" aria-hidden="true">
              <img
                class="mello-compare__bottles-image"
                src="/assets/mellorise-other-supplements.png"
                alt=""
                width="600"
                height="440"
                loading="lazy"
              >
            </div>
          </article>
        </div>

        <div class="mello-compare__cta-wrap">
          <a class="mello-compare__cta" href="/products/mellorise-heightener-gummies-2026">Ver todos los nutrientes en una gummy</a>
        </div>
      </div>

      <img
        class="mello-compare__bear"
        src="/assets/bears-png.png"
        alt=""
        width="1024"
        height="1024"
        loading="lazy"
        aria-hidden="true"
      >
    </section>

    <section class="mello-testimonials section-mellorise-home-testimonials" id="resenas">
      <div class="mello-testimonials__inner">
        <div class="mello-testimonials__head">
          <span class="mello-testimonials__eyebrow">Lo que dicen las familias</span>
          <h2 class="mello-testimonials__title">
            Reseñas de familias
            <strong>sobre MelloRise</strong>
          </h2>
          <div class="mello-testimonials__summary">
            <span aria-hidden="true">★★★★★</span>
            <p>Experiencias centradas en rutina, claridad de compra y uso diario.</p>
          </div>
        </div>
        <div class="mello-testimonials__grid">
          <article v-for="(review, index) in reviews" :key="review" class="mello-testimonials__card">
            <div class="mello-testimonials__stars" aria-hidden="true">★★★★★</div>
            <blockquote>{{ review }}</blockquote>
            <footer class="mello-testimonials__footer">
              <div>
                <strong>{{ ['Familia Martínez', 'Madre de dos', 'Familia Rivera'][index] }}</strong>
                <span>{{ ['Rutina familiar', 'Uso diario', 'Experiencia de compra'][index] }}</span>
              </div>
              <small>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-5"/></svg>
                Relato de cliente
              </small>
            </footer>
          </article>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="gh-home-offer">
        <div
          v-if="isOfferVisible"
          class="gh-offer gh-offer--home-deal is-visible"
          role="dialog"
          aria-modal="true"
          :aria-label="t('home.offer.ariaLabel')"
        >
          <button class="gh-offer__shade" type="button" :aria-label="t('home.offer.close')" @click="requestCloseOffer"></button>
          <article class="gh-offer__card gh-offer__card--home-deal">
            <button class="gh-offer__close" type="button" :aria-label="t('home.offer.close')" @click="requestCloseOffer">
              <span aria-hidden="true"></span>
            </button>
            <span class="gh-offer__kicker">{{ t('home.offer.kicker') }}</span>
            <h2 class="gh-offer__title">{{ t('home.offer.title') }}</h2>
            <p class="gh-offer__subtitle">{{ t('home.offer.subtitle') }}</p>
            <img class="gh-offer__product" src="/assets/derram.png" alt="MelloRise Heightener Gummies" width="900" height="900" loading="eager">
            <div class="gh-offer__timer" :aria-label="t('home.offer.timerLabel', { time: homeOfferTimerText })">
              <span v-for="part in homeOfferTimerParts" :key="part.key">
                <b>{{ part.value }}</b>
                <small>{{ part.label }}</small>
              </span>
            </div>
            <a class="gh-offer__primary" href="/products/mellorise-heightener-gummies-2026#comprar" @click="closeOffer">
              {{ t('home.offer.shopWithDiscount') }}
            </a>
            <button class="gh-offer__secondary" type="button" @click="requestCloseOffer">
              {{ t('home.offer.dismiss') }}
            </button>
          </article>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style>
.gh-offer--home-deal {
  inset: 0;
  overflow: hidden;
  position: fixed;
}

.gh-offer--home-deal .gh-offer__shade {
  background: rgba(7, 20, 21, 0.66);
  border: 0;
  cursor: pointer;
}

.gh-offer__card--home-deal {
  background:
    radial-gradient(circle at 12% 8%, rgba(119, 205, 250, 0.22), transparent 30%),
    radial-gradient(circle at 86% 18%, rgba(255, 102, 0, 0.24), transparent 34%),
    #071415;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  box-sizing: border-box;
  box-shadow: 0 32px 90px rgba(0, 0, 0, 0.42);
  color: #ffffff;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(24px, 4vh, 34px) clamp(24px, 4vw, 34px) clamp(22px, 3.5vh, 30px);
  width: min(460px, calc(100vw - 36px));
}

.gh-offer__card--home-deal .gh-offer__close {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  height: 40px;
  width: 40px;
}

.gh-offer__card--home-deal .gh-offer__close span,
.gh-offer__card--home-deal .gh-offer__close span::after {
  background: #ffffff;
  height: 2px;
  width: 19px;
}

.gh-offer__card--home-deal .gh-offer__kicker {
  background: rgba(255, 102, 0, 0.16);
  border: 1px solid rgba(255, 127, 17, 0.36);
  border-radius: 999px;
  color: #ffcf8a;
  display: inline-flex;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0;
  margin: 0 0 10px;
  padding: 7px 12px;
}

.gh-offer__card--home-deal .gh-offer__title {
  color: #ffffff;
  font-size: clamp(34px, 4vw, 46px);
  font-weight: 950;
  line-height: 0.98;
  margin: 0 auto;
  max-width: 390px;
}

.gh-offer__card--home-deal .gh-offer__subtitle {
  color: rgba(255, 255, 255, 0.82);
  font-size: 15px;
  font-weight: 720;
  line-height: 1.35;
  margin: 12px auto 4px;
  max-width: 360px;
}

.gh-offer__product {
  display: block;
  filter: drop-shadow(0 22px 30px rgba(0, 0, 0, 0.32));
  height: auto;
  margin: -6px auto -10px;
  max-height: min(288px, 34vh);
  object-fit: contain;
  width: min(330px, 88%);
}

.gh-offer__timer {
  align-items: center;
  display: grid;
  gap: 9px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 8px auto 18px;
  width: min(330px, 100%);
}

.gh-offer__timer span {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  display: grid;
  min-height: 64px;
  place-items: center;
  padding: 9px 6px 8px;
}

.gh-offer__timer b {
  color: #ffffff;
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  line-height: 1;
}

.gh-offer__timer small {
  color: #ffcf8a;
  font-size: 10px;
  font-weight: 950;
  letter-spacing: 0;
  line-height: 1;
  text-transform: uppercase;
}

.gh-offer__card--home-deal .gh-offer__primary {
  background: #ff6a00;
  border-radius: 14px;
  box-shadow: 0 16px 34px rgba(255, 102, 0, 0.28);
  color: #ffffff;
  font-size: 18px;
  margin-top: 0;
  min-height: 58px;
  text-transform: uppercase;
}

.gh-offer__card--home-deal .gh-offer__primary:hover,
.gh-offer__card--home-deal .gh-offer__primary:focus-visible {
  background: #ff7f11;
  outline: 3px solid rgba(255, 207, 138, 0.34);
  transform: translateY(-1px);
}

.gh-offer__card--home-deal .gh-offer__secondary {
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
  margin-top: 16px;
}

.gh-home-offer-enter-active,
.gh-home-offer-leave-active {
  transition: opacity 180ms ease;
}

.gh-home-offer-enter-active .gh-offer__card--home-deal,
.gh-home-offer-leave-active .gh-offer__card--home-deal {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.gh-home-offer-enter-from,
.gh-home-offer-leave-to {
  opacity: 0;
}

.gh-home-offer-enter-from .gh-offer__card--home-deal,
.gh-home-offer-leave-to .gh-offer__card--home-deal {
  transform: translateY(18px) scale(0.98);
}

.gummy-home .gh-scroll-reveal {
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  transition:
    opacity 620ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 620ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 620ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
  will-change: opacity, transform, filter;
}

.gummy-home .gh-scroll-reveal:not(.is-visible) {
  filter: blur(8px);
}

.gummy-home .gh-scroll-reveal.is-visible {
  filter: blur(0);
  opacity: 1;
  transform: translate3d(0, 0, 0);
  will-change: auto;
}

@media (prefers-reduced-motion: reduce) {
  .gh-home-offer-enter-active,
  .gh-home-offer-leave-active,
  .gh-home-offer-enter-active .gh-offer__card--home-deal,
  .gh-home-offer-leave-active .gh-offer__card--home-deal {
    transition: opacity 120ms ease;
  }

  .gummy-home .gh-scroll-reveal {
    filter: none;
    opacity: 1;
    transform: none;
    transition: opacity 180ms ease;
  }
}

@media (max-width: 749px) {
  .gh-offer--home-deal {
    padding: max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom));
  }

  .gh-offer__card--home-deal {
    border-radius: 18px;
    justify-content: center;
    max-height: calc(100svh - 28px);
    padding: 24px 18px 20px;
    width: calc(100vw - 28px);
  }

  .gh-offer__card--home-deal .gh-offer__title {
    font-size: clamp(28px, 8vw, 34px);
    max-width: 320px;
  }

  .gh-offer__card--home-deal .gh-offer__subtitle {
    font-size: 12px;
    line-height: 1.28;
    margin-top: 8px;
    max-width: 300px;
  }

  .gh-offer__product {
    margin-block: -8px -10px;
    max-height: min(230px, 29svh);
    width: min(270px, 88%);
  }

  .gh-offer__timer {
    gap: 7px;
    margin: 4px auto 12px;
    width: min(300px, 100%);
  }

  .gh-offer__timer span {
    border-radius: 12px;
    min-height: 54px;
    padding: 7px 4px 6px;
  }

  .gh-offer__timer b {
    font-size: 22px;
  }

  .gh-offer__timer small {
    font-size: 9px;
  }

  .gh-offer__card--home-deal .gh-offer__primary {
    font-size: 16px;
    min-height: 50px;
  }

  .gh-offer__card--home-deal .gh-offer__secondary {
    margin-top: 12px;
  }
}

@media (max-width: 389px), (max-height: 760px) {
  .gh-offer__card--home-deal {
    padding: 18px 16px 16px;
  }

  .gh-offer__card--home-deal .gh-offer__close {
    height: 36px;
    width: 36px;
  }

  .gh-offer__card--home-deal .gh-offer__kicker {
    font-size: 10px;
    margin-bottom: 8px;
    padding: 6px 10px;
  }

  .gh-offer__card--home-deal .gh-offer__title {
    font-size: clamp(24px, 7.4vw, 30px);
    line-height: 1;
  }

  .gh-offer__card--home-deal .gh-offer__subtitle {
    font-size: 11px;
    margin-top: 7px;
  }

  .gh-offer__product {
    max-height: min(200px, 27svh);
    width: min(238px, 84%);
  }

  .gh-offer__timer {
    gap: 6px;
    margin-bottom: 10px;
  }

  .gh-offer__timer span {
    min-height: 48px;
  }

  .gh-offer__timer b {
    font-size: 20px;
  }

  .gh-offer__card--home-deal .gh-offer__primary {
    font-size: 14px;
    min-height: 46px;
  }

  .gh-offer__card--home-deal .gh-offer__secondary {
    font-size: 13px;
    margin-top: 10px;
  }
}

.gh-offer.gh-offer--home-deal {
  max-width: 100vw;
  overflow: hidden;
}

.gh-offer.gh-offer--home-deal .gh-offer__card.gh-offer__card--home-deal {
  justify-content: center;
  max-height: min(660px, calc(100svh - 36px));
  overflow: hidden;
  padding: clamp(22px, 3.2vh, 30px) clamp(22px, 3vw, 30px) clamp(20px, 3vh, 26px);
  width: min(440px, calc(100vw - 36px));
}

.gh-offer.gh-offer--home-deal .gh-offer__card--home-deal .gh-offer__title {
  font-size: clamp(30px, 3vw, 40px);
}

.gh-offer.gh-offer--home-deal .gh-offer__product {
  max-height: min(235px, 30svh);
  width: min(300px, 84%);
}

.gh-offer.gh-offer--home-deal .gh-offer__timer span {
  min-height: 58px;
}

.gh-offer.gh-offer--home-deal .gh-offer__timer b {
  font-size: 24px;
}

.gh-offer.gh-offer--home-deal .gh-offer__card--home-deal .gh-offer__primary {
  box-sizing: border-box;
  min-height: 54px;
  width: min(100%, 330px);
}

@media (max-width: 749px) {
  .gh-offer.gh-offer--home-deal .gh-offer__card.gh-offer__card--home-deal {
    max-height: calc(100svh - 32px);
    padding: 18px 16px 16px;
    width: min(336px, calc(100vw - 32px));
  }

  .gh-offer.gh-offer--home-deal .gh-offer__card--home-deal .gh-offer__close {
    height: 36px;
    width: 36px;
  }

  .gh-offer.gh-offer--home-deal .gh-offer__card--home-deal .gh-offer__kicker {
    font-size: 10px;
    margin-bottom: 8px;
    padding: 6px 10px;
  }

  .gh-offer.gh-offer--home-deal .gh-offer__card--home-deal .gh-offer__title {
    font-size: clamp(24px, 7vw, 29px);
    line-height: 1;
    max-width: 278px;
  }

  .gh-offer.gh-offer--home-deal .gh-offer__card--home-deal .gh-offer__subtitle {
    font-size: 11px;
    line-height: 1.24;
    margin-top: 7px;
    max-width: 278px;
  }

  .gh-offer.gh-offer--home-deal .gh-offer__product {
    margin-block: -10px -12px;
    max-height: min(176px, 24svh);
    width: min(218px, 78%);
  }

  .gh-offer.gh-offer--home-deal .gh-offer__timer {
    gap: 6px;
    margin: 2px auto 10px;
    width: min(286px, 100%);
  }

  .gh-offer.gh-offer--home-deal .gh-offer__timer span {
    min-height: 46px;
    padding: 6px 4px 5px;
  }

  .gh-offer.gh-offer--home-deal .gh-offer__timer b {
    font-size: 20px;
  }

  .gh-offer.gh-offer--home-deal .gh-offer__timer small {
    font-size: 8px;
  }

  .gh-offer.gh-offer--home-deal .gh-offer__card--home-deal .gh-offer__primary {
    font-size: 14px;
    min-height: 44px;
  }

  .gh-offer.gh-offer--home-deal .gh-offer__card--home-deal .gh-offer__secondary {
    font-size: 13px;
    margin-top: 9px;
  }
}
</style>
