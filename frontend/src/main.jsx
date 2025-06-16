import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import LoadingPage from './components/LazyPage.jsx'

const LazyComponent = lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <Suspense fallback={<LoadingPage />}>
          <LazyComponent />
        </Suspense>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
)