import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Banner from './components/banner'
import About from './components/about'
import Footer from './components/footer'
import Testimonial from './components/testimonial'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Banner />
    <About />
    <Testimonial />
    <Footer />
  </StrictMode>,
)
