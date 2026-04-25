import '@/helper/dayjs'
import '@fontsource/fira-sans/index.css'
import 'subsetted-fonts/MiSans-VF/MiSans-VF.css'
import 'subsetted-fonts/PingFangSC-Regular/PingFangSC-Regular.css'
import 'subsetted-fonts/SarasaUiSC-Regular/SarasaUiSC-Regular.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/dist/tippy.css'
import { createApp } from 'vue'
import App from './App.vue'
import { loadFonts } from './assets/load-fonts'
import './assets/main.css'
import { applyCustomThemes, applyKsuTheme } from './helper'
import './helper/syncSettings'
import { i18n } from './i18n'
import router from './router'
import './store/status'
import './store/tray'

const isEdge = /Edg\//.test(navigator.userAgent)

if (isEdge) {
  const originalReplaceState = history.replaceState
  history.replaceState = function (...args) {
    if (document.visibilityState === 'hidden') return
    return originalReplaceState.apply(this, args)
  }
}

applyCustomThemes()
applyKsuTheme()
loadFonts()

const app = createApp(App)

app.use(router)
app.use(i18n)
app.mount('#app')
