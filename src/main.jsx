import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const variant = document.documentElement.dataset.variant ?? 'test2'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App variant={variant} />
  </StrictMode>,
)
