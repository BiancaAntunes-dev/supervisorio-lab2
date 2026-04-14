import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/latin.css'
import '@fontsource/roboto/latin-ext.css'
import '@fontsource/roboto-mono/latin.css'
import '@fontsource/roboto-mono/latin-ext.css'
import './style.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
