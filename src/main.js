import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import './styles/theme-vars.css'
import './styles/theme-imports.css'
import './styles/vue-overrides.css'

createApp(App).use(i18n).mount('#app')
