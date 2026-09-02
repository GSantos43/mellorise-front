import { createApp } from 'vue'
import { clerkPlugin } from '@clerk/vue'
import App from './App.vue'
import { i18n } from './i18n'
import './styles/theme-vars.css'
import './styles/theme-imports.css'
import './styles/vue-overrides.css'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const authFallbackRedirectUrl = '/collections/all'
const app = createApp(App, {
  clerkEnabled: Boolean(clerkPublishableKey)
})

app.use(i18n)

if (clerkPublishableKey) {
  app.use(clerkPlugin, {
    publishableKey: clerkPublishableKey,
    signInFallbackRedirectUrl: authFallbackRedirectUrl,
    signUpFallbackRedirectUrl: authFallbackRedirectUrl,
  })
}

app.mount('#app')
