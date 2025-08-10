import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/poppins/latin-700.css'
import Banner from './components/banner'
const About = lazy(() => import('./components/about'))
const Footer = lazy(() => import('./components/footer'))
const Testimonial = lazy(() => import('./components/testimonial'))
const Portfolio = lazy(() => import('./components/portfolio'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Banner />
    <Suspense fallback={null}>
      <Portfolio />
      <About />
      <Testimonial />
      <Footer />
    </Suspense>
  </StrictMode>,
)
