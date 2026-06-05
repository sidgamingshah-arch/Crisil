import React from 'react'
import ReactDOM from 'react-dom/client'
import './i18n/index.js'
import './styles/global.css'
import App from './App.jsx'
import useAuthStore from './store/authStore.js'
import { registerSW } from 'virtual:pwa-register'

// Prompt user on service worker update (show a toast / reload button)
const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm('New version of TourMate available. Reload to update?')) {
      updateSW(true)
    }
  },
})

async function bootstrap() {
  // Resolve Firebase auth state before first render to avoid flicker
  await useAuthStore.getState().init()

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

bootstrap()
