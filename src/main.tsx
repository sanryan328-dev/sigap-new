import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Pembaruan tersedia. Muat ulang halaman?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('✅ SIGAP siap digunakan secara offline.');
    document.body.setAttribute('data-pwa-ready', 'true');
  },
  onRegisteredSW(swUrl, registration) {
    console.log('✅ Service Worker terdaftar:', swUrl, registration?.scope);
  },
  onRegisterError(error) {
    console.error('❌ Gagal mendaftarkan Service Worker:', error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="bottom-right" richColors closeButton />
  </StrictMode>,
)
