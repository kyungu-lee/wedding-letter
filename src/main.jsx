import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const variant = document.documentElement.dataset.variant ?? 'test2'
const showAccounts = document.documentElement.dataset.showAccounts !== 'false'
const gallery = document.documentElement.dataset.gallery

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App variant={variant} showAccounts={showAccounts} gallery={gallery} />
  </StrictMode>,
)
