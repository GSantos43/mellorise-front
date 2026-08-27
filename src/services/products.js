const API_URL = 'http://localhost:3000/products'

const fallbackProducts = [
  {
    id: 1,
    title: '9-In-1 Natural Growth & Bone Support Gummies For Kids & Teens',
    handle: 'wondernest-heightener-gummies-2026',
    vendor: 'MelloRise',
    price: 39.99,
    compareAtPrice: 59.99,
    image: '/assets/frasco.png',
    images: ['/assets/frasco.png', '/assets/gummy-home-product.png', '/assets/nutri2.png', '/assets/compose.png']
  },
  {
    id: 2,
    title: 'Buy 2 Get 1 Free',
    handle: 'buy-2-get-1-free',
    vendor: 'MelloRise',
    price: 79.98,
    compareAtPrice: 119.97,
    image: '/assets/three.png'
  },
  {
    id: 3,
    title: 'Buy 3 Get 2 Free',
    handle: 'buy-3-get-2-free',
    vendor: 'MelloRise',
    price: 119.97,
    compareAtPrice: 199.95,
    image: '/assets/five5.png'
  }
]

export async function fetchProducts() {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`Products request failed: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) && data.length ? data.map(normalizeProduct) : fallbackProducts
  } catch (error) {
    console.warn(error)
    return fallbackProducts
  }
}

export function formatMoney(value) {
  const numeric = Number(value ?? 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numeric)
}

function normalizeProduct(product) {
  const image =
    product.image ||
    product.imageUrl ||
    product.featuredImage ||
    product.featured_media?.preview_image?.src ||
    product.images?.[0] ||
    '/assets/frasco.png'

  return {
    id: product.id ?? product._id ?? product.handle ?? product.slug,
    title: product.title ?? product.name ?? '9-In-1 Natural Growth & Bone Support Gummies For Kids & Teens',
    handle: product.handle ?? product.slug ?? product.id,
    vendor: product.vendor ?? product.brand ?? 'MelloRise',
    price: product.price ?? product.variants?.[0]?.price ?? 39.99,
    compareAtPrice: product.compareAtPrice ?? product.compare_at_price ?? product.variants?.[0]?.compareAtPrice,
    image,
    images: product.images?.length ? product.images : [image],
    description: product.description ?? product.text ?? ''
  }
}
