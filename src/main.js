import { createApp } from 'vue'
// Clerk auth is intentionally paused while checkout runs directly through Stripe.
// import { clerkPlugin } from '@clerk/vue'
import App from './App.vue'
import { i18n } from './i18n'
import './styles/theme-vars.css'
import './styles/theme-imports.css'
import './styles/vue-overrides.css'

// const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
// const authFallbackRedirectUrl = '/collections/all'
const app = createApp(App, {
  clerkEnabled: false
})

app.use(i18n)

// if (clerkPublishableKey) {
//   app.use(clerkPlugin, {
//     publishableKey: clerkPublishableKey,
//     signInUrl: '/sign-in',
//     signUpUrl: '/sign-up',
//     signInFallbackRedirectUrl: authFallbackRedirectUrl,
//     signUpFallbackRedirectUrl: authFallbackRedirectUrl,
//   })
// }

app.mount('#app')
