<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMoney } from '../services/products'
import { translateProductTitle } from '../i18n/productText'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['add-to-cart'])
const { t, locale } = useI18n({ useScope: 'global' })
const productUrl = computed(() => `/products/${props.product.handle}`)
const price = computed(() => formatMoney(props.product.price))
const compareAtPrice = computed(() => props.product.compareAtPrice ? formatMoney(props.product.compareAtPrice) : '')
const productImage = computed(() => props.product.image || props.product.images?.[0] || '/assets/frasco.png')
const localizedProductTitle = computed(() => translateProductTitle(props.product.title, locale.value))

function addToCart() {
  emit('add-to-cart', props.product)
}
</script>

<template>
  <li
    class="grid__item scroll-trigger animate--slide-in mello-product-card-item"
    data-cascade
    :style="{ '--animation-order': index + 1 }"
  >
    <product-component>
      <div class="card-wrapper product-card-wrapper underline-links-hover mello-product-card">
        <article class="card card--standard card--media card--extend-height mello-product-card__shell" style="--ratio-percent: 100%;">
          <a :href="productUrl" class="mello-product-card__image-link" :aria-label="localizedProductTitle">
            <div class="card__inner color-scheme-1 gradient ratio mello-product-card__media-frame" style="--ratio-percent: 100%;">
              <div class="card__media">
                <div class="media media--transparent media--hover-effect">
                  <img
                    :src="productImage"
                    :alt="localizedProductTitle"
                    class="motion-reduce"
                    loading="lazy"
                    width="533"
                    height="533"
                  >
                </div>
              </div>
              <div class="card__content mello-product-card__badge-layer">
                <div class="card__badge bottom left">
                  <img
                    v-if="compareAtPrice"
                    src="/assets/sale2.png"
                    alt="Sale"
                    class="mello-product-card__sale-badge"
                    width="92"
                    height="92"
                    loading="lazy"
                  >
                </div>
              </div>
            </div>
          </a>

          <div class="card__content mello-product-card__content">
            <div class="card__information mello-product-card__information">
              <h3 class="card__heading h5 mello-product-card__title">
                <a :href="productUrl" class="full-unstyled-link">
                  {{ localizedProductTitle }}
                </a>
              </h3>

              <div class="card-information mello-product-card__meta">
                <span class="visually-hidden">Vendor:</span>
                <div class="caption-with-letter-spacing light">{{ product.vendor }}</div>

                <div class="price price--on-sale">
                  <div class="price__container">
                    <div class="price__regular">
                      <span class="visually-hidden visually-hidden--inline">Regular price</span>
                      <span class="price-item price-item--regular">{{ price }}</span>
                    </div>
                    <div class="price__sale">
                      <span class="visually-hidden visually-hidden--inline">Sale price</span>
                      <span class="price-item price-item--sale price-item--last">{{ price }}</span>
                      <span v-if="compareAtPrice">
                        <span class="visually-hidden visually-hidden--inline">Regular price</span>
                        <s class="price-item price-item--regular">{{ compareAtPrice }}</s>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mello-product-card__actions">
              <button class="mello-product-card__button" type="button" @click="addToCart">
                {{ t('product.addToCart') }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </product-component>
  </li>
</template>

<style>
.mello-product-card-item {
  display: flex;
  min-width: 0;
}

.mello-product-card-item product-component {
  display: flex;
  width: 100%;
}

.mello-product-card {
  background: #ffffff;
  border: 1px solid rgba(23, 49, 50, 0.11);
  border-radius: 14px;
  display: flex;
  min-height: 508px;
  overflow: hidden;
  position: relative;
  transition: box-shadow 220ms ease, transform 220ms ease, border-color 220ms ease;
  width: 100%;
}

.mello-product-card:hover,
.mello-product-card:focus-within {
  border-color: rgba(90, 144, 145, 0.24);
  box-shadow: 0 16px 38px rgba(23, 49, 50, 0.11);
  transform: translateY(-3px);
}

.mello-product-card__shell {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
}

.mello-product-card__image-link {
  color: inherit;
  display: block;
  text-decoration: none;
}

.mello-product-card__media-frame {
  aspect-ratio: 4 / 3;
  background: #ffffff;
  border-bottom: 1px solid rgba(23, 49, 50, 0.07);
  display: block;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.mello-product-card__media-frame.ratio::before {
  padding-bottom: 75%;
}

.mello-product-card__media-frame .card__media,
.mello-product-card__media-frame .media {
  inset: 0;
  position: absolute;
}

.mello-product-card__media-frame .media {
  align-items: center;
  display: flex;
  justify-content: center;
}

.mello-product-card__media-frame img {
  height: 100%;
  object-fit: contain;
  padding: 22px 24px 18px;
  transition: transform 260ms ease;
  width: 100%;
}

.mello-product-card:hover .mello-product-card__media-frame img {
  transform: scale(1.025);
}

.mello-product-card__badge-layer {
  inset: 0;
  padding: 0;
  pointer-events: none;
  position: absolute;
}

.mello-product-card .card__badge {
  bottom: auto;
  left: 16px;
  top: 16px;
}

.mello-product-card .mello-product-card__sale-badge {
  background: transparent;
  border: 0;
  border-radius: 0;
  display: block;
  height: clamp(54px, 5.3vw, 72px);
  max-height: 72px;
  max-width: 72px;
  object-fit: contain;
  padding: 0;
  transform: rotate(-9deg);
  width: clamp(54px, 5.3vw, 72px);
}

.mello-product-card .mello-product-card__content.card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px 18px 18px;
}

.mello-product-card .mello-product-card__information.card__information {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: auto;
  padding: 0;
}

.mello-product-card .card__heading {
  color: #173132;
  margin: 0;
}

.mello-product-card .mello-product-card__title.card__heading {
  display: -webkit-box;
  font-size: 19px;
  font-weight: 780;
  line-height: 1.18;
  max-width: none;
  min-height: 46px;
  overflow: hidden;
  width: 100%;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.mello-product-card .full-unstyled-link::after {
  content: none;
  display: none;
}

.mello-product-card .full-unstyled-link {
  position: relative;
  z-index: 1;
}

.mello-product-card__meta {
  margin-top: 16px;
}

.mello-product-card .caption-with-letter-spacing {
  color: #6f7f7f;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  line-height: 1.2;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.mello-product-card .price {
  color: #173132;
  font-size: 24px;
  font-weight: 560;
  letter-spacing: 0;
  line-height: 1.1;
}

.mello-product-card .price__container {
  margin: 0;
}

.mello-product-card .price__sale {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
}

.mello-product-card .price-item {
  margin: 0;
}

.mello-product-card .price-item--regular {
  color: #657575;
  font-size: 17px;
  font-weight: 560;
}

.mello-product-card__actions {
  margin-top: 22px;
  position: relative;
  z-index: 2;
}

.mello-product-card__button {
  align-items: center;
  background: #173132;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 850;
  justify-content: center;
  line-height: 1;
  min-height: 48px;
  padding: 0 22px;
  transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  width: 100%;
}

.mello-product-card__button:hover {
  background: #5a9091;
  box-shadow: 0 12px 26px rgba(90, 144, 145, 0.22);
  transform: translateY(-1px);
}

.mello-product-card__button:focus-visible {
  outline: 3px solid rgba(119, 205, 250, 0.6);
  outline-offset: 3px;
}

@media (max-width: 980px) {
  .mello-product-card {
    min-height: 492px;
  }

  .mello-product-card .mello-product-card__content.card__content {
    padding: 20px 16px 18px;
  }
}

@media (max-width: 620px) {
  .mello-product-card {
    min-height: auto;
  }

  .mello-product-card__media-frame img {
    padding: 20px;
  }

  .mello-product-card .mello-product-card__title.card__heading {
    font-size: 19px;
    min-height: auto;
  }

  .mello-product-card .price {
    font-size: 23px;
  }
}
</style>
