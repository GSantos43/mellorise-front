<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <Transition name="mello-page-loader">
    <div v-if="active" class="mello-page-loader" role="status" aria-live="polite" :aria-label="t('loading.label')">
      <div class="mello-page-loader__bar" aria-hidden="true">
        <span></span>
      </div>
      <div class="mello-page-loader__pill">
        <span class="mello-page-loader__mark" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span>{{ t('loading.label') }}</span>
      </div>
    </div>
  </Transition>
</template>

<style>
.mello-page-loader {
  inset: 0 0 auto;
  pointer-events: none;
  position: fixed;
  z-index: 90;
}

.mello-page-loader__bar {
  background: rgba(232, 247, 255, 0.72);
  height: 3px;
  overflow: hidden;
  width: 100%;
}

.mello-page-loader__bar span {
  animation: mello-loader-bar 760ms cubic-bezier(0.22, 1, 0.36, 1) infinite;
  background: linear-gradient(90deg, rgba(119, 205, 250, 0), #77cdfa 34%, #5a9091 72%, rgba(90, 144, 145, 0));
  display: block;
  height: 100%;
  width: 42%;
}

.mello-page-loader__pill {
  align-items: center;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 999px;
  box-shadow: 0 16px 40px rgba(23, 49, 50, 0.12);
  color: #173132;
  display: inline-flex;
  font-family: var(--font-body-family);
  font-size: 12px;
  font-weight: 760;
  gap: 9px;
  left: 50%;
  line-height: 1;
  padding: 9px 14px;
  position: absolute;
  top: 14px;
  transform: translateX(-50%);
}

.mello-page-loader__mark {
  align-items: center;
  display: inline-flex;
  gap: 4px;
}

.mello-page-loader__mark i {
  animation: mello-loader-dot 720ms ease-in-out infinite;
  background: #5a9091;
  border-radius: 50%;
  display: block;
  height: 5px;
  width: 5px;
}

.mello-page-loader__mark i:nth-child(2) {
  animation-delay: 90ms;
  background: #77cdfa;
}

.mello-page-loader__mark i:nth-child(3) {
  animation-delay: 180ms;
}

.mello-page-loader-enter-active,
.mello-page-loader-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.mello-page-loader-enter-from,
.mello-page-loader-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes mello-loader-bar {
  0% {
    transform: translateX(-110%);
  }

  100% {
    transform: translateX(250%);
  }
}

@keyframes mello-loader-dot {
  0%,
  100% {
    opacity: 0.45;
    transform: translateY(0);
  }

  50% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mello-page-loader__bar span,
  .mello-page-loader__mark i {
    animation: none;
  }
}
</style>
