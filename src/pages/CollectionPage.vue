<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CatalogGrid from '../components/CatalogGrid.vue'
import { buildProductBundles } from '../services/bundles'

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  purchaseEligibility: {
    type: Object,
    default: () => ({
      allowed: true,
      countryCode: null,
      allowedCountries: ['US', 'BR']
    })
  }
})

const emit = defineEmits(['add-to-cart'])
const productCount = computed(() => props.products.length)
const { t } = useI18n({ useScope: 'global' })
const featuredProduct = computed(() => props.products[0])
const isPurchaseAllowed = computed(() => props.purchaseEligibility?.allowed !== false)
const bundleProducts = computed(() => {
  const product = featuredProduct.value
  if (!product) return []

  return buildProductBundles(product).map((bundle) => ({
    ...product,
    id: `${product.id}-${bundle.key}`,
    title: t(bundle.titleKey),
    vendor: product.vendor || 'MelloRise',
    price: bundle.price,
    compareAtPrice: bundle.compareAtPrice,
    image: bundle.image,
    images: [bundle.image],
    productUrl: `/products/${product.handle}?bundle=${bundle.queryValue}#comprar`,
    actionLabel: t('catalog.bundleAction'),
    bundleCard: true,
    bundleBadge: bundle.badgeKey ? t(bundle.badgeKey) : '',
    bundleMeta: t(bundle.metaKey),
    bundleShipping: t(bundle.shippingKey),
    paidQuantity: bundle.paidQuantity,
    deliveredQuantity: bundle.bottles
  }))
})
const productCountLabel = computed(() => {
  if (props.isLoading) return t('catalog.loadingProducts')
  return t('catalog.bundleProductsAvailable', { count: bundleProducts.value.length || productCount.value })
})

function addProductToCart(product) {
  if (!isPurchaseAllowed.value) return

  if (product.productUrl) {
    window.history.pushState({}, '', product.productUrl)
    window.dispatchEvent(new PopStateEvent('popstate'))
    return
  }

  emit('add-to-cart', {
    product,
    price: Number(product.price || 0),
    quantity: 1,
    image: product.image || product.images?.[0] || '/assets/frasco.png',
    bundleLabel: '1 frasco'
  })
}
</script>

<template>
  <section class="mello-catalog" data-section-id="vue-collection">
    <div class="mello-catalog__hero">
      <img src="/assets/banner-catalogo.png" :alt="t('catalog.bannerAlt')" width="1920" height="480" loading="eager">
    </div>

    <div class="mello-catalog__toolbar">
      <div class="mello-catalog__toolbar-inner">
        <p>{{ productCountLabel }}</p>
        <div class="mello-catalog__chips" aria-label="Filtros destacados">
          <span>{{ t('catalog.chips.routine') }}</span>
          <span>{{ t('catalog.chips.gummy') }}</span>
          <span>{{ t('catalog.chips.responsible') }}</span>
        </div>
      </div>
    </div>

    <div class="mello-catalog__grid-wrap">
      <div v-if="isLoading" class="mello-catalog__state">
        <h2>{{ t('catalog.loadingTitle') }}</h2>
        <p>{{ t('catalog.loadingText') }}</p>
      </div>

      <div v-else-if="!products.length" class="mello-catalog__state">
        <h2>{{ t('catalog.emptyTitle') }}</h2>
        <p>{{ t('catalog.emptyText') }}</p>
      </div>

      <CatalogGrid
        v-else
        :products="bundleProducts"
        :purchase-eligibility="purchaseEligibility"
        @add-to-cart="addProductToCart"
      />
    </div>
  </section>
</template>

<style>
.mello-catalog {
  --catalog-ink: #173132;
  --catalog-muted: #607171;
  --catalog-blue: #77cdfa;
  --catalog-cream: #fffaf0;
  --catalog-teal: #5a9091;
  background: #ffffff;
  color: var(--catalog-ink);
  font-family: var(--font-body-family);
}

.mello-catalog * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-catalog__hero {
  background: #ffffff;
  line-height: 0;
  overflow: hidden;
  position: relative;
}

.mello-catalog__hero img {
  display: block;
  height: auto;
  object-fit: cover;
  object-position: center;
  width: 100%;
}

.mello-catalog__toolbar {
  background: #eef9ff;
}

.mello-catalog__toolbar-inner {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  margin: 0 auto;
  min-height: 66px;
  width: min(1180px, calc(100% - 32px));
}

.mello-catalog__toolbar p {
  color: #173132;
  font-size: 15px;
  font-weight: 900;
  margin: 0;
}

.mello-catalog__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.mello-catalog__chips span {
  background: #ffffff;
  border-radius: 999px;
  color: #5a9091;
  font-size: 13px;
  font-weight: 800;
  padding: 8px 13px;
}

.mello-catalog__grid-wrap {
  margin: 0 auto;
  padding: clamp(42px, 5vw, 72px) 0 clamp(58px, 7vw, 92px);
  width: min(1180px, calc(100% - 32px));
}

.mello-catalog__state {
  background: var(--catalog-cream);
  border-radius: 18px;
  color: #173132;
  padding: 46px 24px;
  text-align: center;
}

.mello-catalog__state h2 {
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 8px;
}

.mello-catalog__state p {
  color: var(--catalog-muted);
  margin: 0;
}

@media (max-width: 820px) {
  .mello-catalog__hero img {
    aspect-ratio: 16 / 7;
    height: auto;
  }

  .mello-catalog__toolbar-inner {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 14px 0;
  }

  .mello-catalog__chips {
    justify-content: flex-start;
  }
}
</style>
