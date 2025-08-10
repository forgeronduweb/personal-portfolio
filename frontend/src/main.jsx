import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/navbar'
import Banner from './components/banner'
import About from './components/about'
import Footer from './components/footer'
import Testimonial from './components/testimonial'
import Portfolio from './components/portfolio'
import Faq from './components/faq'
import Pricecard from './components/pricecard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <Banner />
    <Portfolio/>
    <Faq />
    <Pricecard />
    <About />
    {/* ///<Testimonial />/// */}
    <Footer />
  </StrictMode>,
)
