import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { resolvePortfolioRoute } from './navigation/routes.js'
import '@fontsource-variable/manrope'
import '@fontsource/ibm-plex-mono/400.css'
import './tailwind.css'

const root = document.getElementById('root')
// Match the path-only route used for prerendering before the provider migrates legacy hashes.
const initialRoute = resolvePortfolioRoute(window.location.pathname)
const app = (
  <React.StrictMode>
    <App route={initialRoute} />
  </React.StrictMode>
)

if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app)
} else {
  ReactDOM.createRoot(root).render(app)
}
