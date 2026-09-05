export const PRODUCT_BUNDLES = [
  {
    key: 'buy1',
    queryValue: '1',
    match: ['buy 1', '1 bottle', 'starter'],
    title: 'Buy 1',
    titleKey: 'product.bundleCards.buyOne.title',
    meta: 'Starter routine',
    metaKey: 'product.bundleCards.buyOne.meta',
    shippingKey: 'product.bundles.shipping.standard',
    image: '/assets/one1.png',
    badge: '',
    badgeKey: '',
    paidQuantity: 1,
    freeQuantity: 0,
    bottles: 1
  },
  {
    key: 'buy2',
    queryValue: '2',
    match: ['buy 2 get 3', 'buy 2 get 1', 'buy 2 get 1 free', '2 get 3', '2 get 1', '3 bottles', 'most popular'],
    title: 'Buy 2 Get 3',
    titleKey: 'product.bundleCards.buyTwo.title',
    meta: 'Most Popular',
    metaKey: 'product.bundleCards.buyTwo.meta',
    shippingKey: 'product.bundles.shipping.standard',
    image: '/assets/three.png',
    badge: 'Most Popular',
    badgeKey: 'product.bundleCards.buyTwo.badge',
    paidQuantity: 2,
    freeQuantity: 1,
    bottles: 3
  },
  {
    key: 'buy3',
    queryValue: '3',
    match: ['buy 3 get 5', 'buy 3 get 2', 'buy 3 get 2 free', '3 get 5', '3 get 2', '5 bottles', 'best value'],
    title: 'Buy 3 Get 5',
    titleKey: 'product.bundleCards.buyThree.title',
    meta: 'Best Value',
    metaKey: 'product.bundleCards.buyThree.meta',
    shippingKey: 'product.bundles.shipping.free',
    image: '/assets/five5.png',
    badge: 'Best Value',
    badgeKey: 'product.bundleCards.buyThree.badge',
    paidQuantity: 3,
    freeQuantity: 2,
    bottles: 5
  }
]

export function buildProductBundles(product = {}) {
  const variants = Array.isArray(product.variants) ? product.variants : []
  const basePrice = Number(product.price || 39.99)

  if (!variants.length) {
    return PRODUCT_BUNDLES.map((pack) => ({
      ...pack,
      price: basePrice * pack.paidQuantity,
      compareAtPrice: Number(product.compareAtPrice || 0)
        ? Number(product.compareAtPrice) * pack.bottles
        : null,
      variationId: null,
      isAvailable: true
    }))
  }

  return PRODUCT_BUNDLES.map((pack) => {
    const variant = findBundleVariant(variants, pack)

    return {
      ...pack,
      price: variant?.price ?? basePrice * pack.paidQuantity,
      compareAtPrice: variant?.compareAtPrice ?? null,
      variationId: variant?.id ?? null,
      isAvailable: Boolean(variant?.id) && variant?.purchasable !== false && variant?.stockStatus !== 'outofstock'
    }
  })
}

function findBundleVariant(variants, pack) {
  const matches = pack.match.map(normalizeBundleMatch)

  return variants.find((variant) => {
    const title = normalizeBundleMatch(variant.title)
    return matches.some((match) => title === match || title.includes(match))
  })
}

function normalizeBundleMatch(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}
