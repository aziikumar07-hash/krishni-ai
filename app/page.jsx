'use client'

import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import Gallery from '../components/Gallery.jsx'
import StatsBand from '../components/StatsBand.jsx'
import Features from '../components/Features.jsx'
import ProfitBand from '../components/ProfitBand.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import About from '../components/About.jsx'
import Pricing from '../components/Pricing.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Faq from '../components/Faq.jsx'
import ContactSection from '../components/ContactSection.jsx'
import SkipLink from '../components/SkipLink.jsx'

export default function Home() {
  // Plan choice lifted here so Pricing can hand it to the form without either
  // component reaching into the other's DOM.
  const [plan, setPlan] = useState('')

  return (
    <>
      <SkipLink />
      <Nav />

      {/* A real <main> landmark. The legacy page had none, and no skip link. */}
      <main id="main">
        <Hero />
        <Gallery />
        <StatsBand />
        <Features />
        <ProfitBand />
        <HowItWorks />
        <About />
        <Pricing onSelectPlan={setPlan} />
        <Testimonials />
        <Faq />
        <ContactSection plan={plan} />
      </main>

      <Footer />
    </>
  )
}

