<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-to-cart'])
</script>

<template>
  <ul
    id="product-grid"
    data-id="vue-collection"
    class="grid product-grid grid--2-col-tablet-down grid--4-col-desktop mello-catalog__grid"
  >
    <ProductCard
      v-for="(product, index) in products"
      :key="product.id"
      :product="product"
      :index="index"
      @add-to-cart="emit('add-to-cart', $event)"
    />
  </ul>
</template>

<style>
.mello-catalog .mello-catalog__grid.product-grid.grid {
  align-items: stretch;
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.mello-catalog .mello-catalog__grid .grid__item {
  max-width: none;
  width: 100%;
}

@media (max-width: 980px) {
  .mello-catalog .mello-catalog__grid.product-grid.grid {
    gap: 22px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .mello-catalog .mello-catalog__grid.product-grid.grid {
    gap: 18px;
    grid-template-columns: 1fr;
  }
}
</style>
