<script setup>
import { ref } from 'vue'

const openFaqIndex = ref(null)

const faqSections = [
  {
    icon: '🕘',
    title: 'Processing Time',
    body: [
      'Please allow up to 2 business days for order processing and production before your item is shipped.'
    ]
  },
  {
    icon: '🚚',
    title: 'Shipping Timelines',
    body: [
      '<strong>United States & Canada:</strong>',
      'Orders ship via USPS or FedEx with an estimated delivery window of <strong>8-10 business days.</strong>',
      '<strong>EU & UAE</strong>',
      'Delivery typically takes <strong>10-12 business days</strong>, depending on your location and the nearest fulfillment center.',
      '<strong>UK</strong>',
      'Delivery typically takes 8 business days, depending on your location and the nearest fulfillment center.',
      '<em>Note: Shipping times may be affected by customs, weather conditions, high demand, or global events. We appreciate your patience and understanding.</em>'
    ]
  },
  // Tracking is hidden until MelloRise has a real order tracking flow.
  // {
  //   icon: '🔍',
  //   title: 'Order Tracking',
  //   body: [
  //     'As soon as your order ships, you’ll receive an email with tracking details.',
  //     'You can also check your status anytime on our <a href="/apps/track123">Track Your Order</a> page.'
  //   ]
  // },
  {
    icon: '❌',
    title: 'Cancellations & Address Updates',
    body: [
      'Need to cancel or correct your order?',
      'You can do so <strong>within 24 hours</strong> of purchase by emailing us at <strong>hello@mellorise.com</strong> with the subject line: <strong>"CANCEL MY ORDER"</strong> or <strong>"ADDRESS UPDATE"</strong>.',
      'After 24 hours or once your order ships, changes are no longer possible.'
    ]
  },
  {
    icon: '🚪',
    title: 'Delivery Attempts',
    body: [
      'Most carriers will attempt delivery twice before returning the package to us.',
      'Please make sure someone is available to receive your order.'
    ]
  }
]

function isFaqOpen(index) {
  return openFaqIndex.value === index
}

function toggleFaq(index) {
  openFaqIndex.value = isFaqOpen(index) ? null : index
}
</script>

<template>
  <section class="mello-faq-page">
    <main class="mello-faq-main">
      <div class="mello-faq-main__inner">
        <h1>Order Processing &amp; Shipping Information</h1>
        <p class="mello-faq-main__intro">
          At <strong>MelloRise</strong>, we’re dedicated to ensuring your order is handled with care and delivered on time.
          Here’s everything you need to know:
        </p>

        <div class="mello-faq-list">
          <article
            v-for="(item, index) in faqSections"
            :key="item.title"
            class="mello-faq-item"
            :data-open="isFaqOpen(index)"
          >
            <button
              class="mello-faq-item__summary"
              type="button"
              :aria-expanded="isFaqOpen(index)"
              :aria-controls="`mello-faq-answer-${index}`"
              @click="toggleFaq(index)"
            >
              <span><b>{{ item.icon }}</b>{{ item.title }}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>
            </button>
            <div
              :id="`mello-faq-answer-${index}`"
              class="mello-faq-item__content"
              :aria-hidden="!isFaqOpen(index)"
            >
              <div class="mello-faq-item__content-inner">
                <p v-for="line in item.body" :key="line" v-html="line"></p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  </section>

</template>

<style>
.mello-faq-page {
  --faq-ink: #111818;
  --faq-text: #343434;
  --faq-muted: #3f3f3f;
  --faq-line: rgba(17, 24, 24, 0.1);
  --faq-teal: #5f9690;
  background: #ffffff;
  color: var(--faq-ink);
  font-family: var(--font-body-family);
}

.mello-faq-page * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-faq-main {
  background: #ffffff;
  padding: 66px 20px 52px;
}

.mello-faq-main__inner {
  margin: 0 auto;
  max-width: 692px;
}

.mello-faq-main h1 {
  color: var(--faq-ink);
  font-size: 40px;
  font-weight: 950;
  line-height: 1.17;
  margin: 0 auto 28px;
  max-width: 670px;
  text-align: center;
}

.mello-faq-main__intro {
  color: var(--faq-muted);
  font-size: 17.5px;
  font-weight: 400;
  line-height: 1.62;
  margin: 0 auto 18px;
  max-width: 680px;
  text-align: center;
}

.mello-faq-main__intro strong {
  color: #222222;
  font-weight: 900;
}

.mello-faq-list {
  margin-top: 18px;
}

.mello-faq-item {
  border-top: 1px solid var(--faq-line);
  color: var(--faq-text);
  padding: 0 6px;
}

.mello-faq-item:last-child {
  border-bottom: 1px solid var(--faq-line);
}

.mello-faq-item__summary {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  color: #111111;
  cursor: pointer;
  display: flex;
  font: inherit;
  font-size: 17.5px;
  font-weight: 900;
  justify-content: space-between;
  line-height: 1.3;
  list-style: none;
  min-height: 45px;
  padding: 11px 8px 8px 4px;
  text-align: left;
  transition: color 180ms ease, background 180ms ease;
  width: 100%;
}

.mello-faq-item__summary::-webkit-details-marker {
  display: none;
}

.mello-faq-item__summary span {
  align-items: center;
  display: inline-flex;
  gap: 7px;
}

.mello-faq-item__summary b {
  display: inline-block;
  font-size: 15px;
  line-height: 1;
  min-width: 22px;
}

.mello-faq-item__summary svg {
  fill: none;
  height: 15px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
  width: 15px;
}

.mello-faq-item:not([data-open="true"]) .mello-faq-item__summary svg {
  transform: rotate(180deg);
}

.mello-faq-item__content {
  color: var(--faq-text);
  display: grid;
  font-size: 17.5px;
  grid-template-rows: 0fr;
  line-height: 1.62;
  opacity: 0;
  overflow: hidden;
  transition: grid-template-rows 340ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;
}

.mello-faq-item[data-open="true"] .mello-faq-item__content {
  grid-template-rows: 1fr;
  opacity: 1;
}

.mello-faq-item__content-inner {
  min-height: 0;
  overflow: hidden;
  padding: 0 5px 17px;
  transform: translateY(-5px);
  transition: transform 340ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-faq-item[data-open="true"] .mello-faq-item__content-inner {
  transform: translateY(0);
}

.mello-faq-item__content p {
  margin: 0 0 12px;
}

.mello-faq-item__content p:last-child {
  margin-bottom: 0;
}

.mello-faq-item__content strong {
  color: #2e2e2e;
  font-weight: 900;
}

.mello-faq-item__content em {
  color: #3c3c3c;
  font-style: italic;
}

.mello-faq-item__content a {
  color: #8a52a5;
  font-weight: 900;
  text-decoration: none;
}

@media (max-width: 820px) {
  .mello-faq-main {
    padding: 50px 18px 44px;
  }

  .mello-faq-main h1 {
    font-size: 32px;
  }

  .mello-faq-main__intro,
  .mello-faq-item__summary,
  .mello-faq-item__content {
    font-size: 16px;
  }

}

@media (prefers-reduced-motion: reduce) {
  .mello-faq-item__summary,
  .mello-faq-item__summary svg,
  .mello-faq-item__content,
  .mello-faq-item__content-inner {
    transition-duration: 1ms;
  }
}
</style>
