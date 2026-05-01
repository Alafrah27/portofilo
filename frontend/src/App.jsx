import { Suspense, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import CaseStudies from './components/CaseStudies'
import AboutCompany from './components/AboutCompany'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import SEO from './components/SEO'
import GoToTop from './components/GoToTop'
import ScrollIndicator from './components/ScrollIndicator'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import { useActiveSection } from './hooks/useActiveSection'
import { useTranslation } from 'react-i18next'

function App() {
  const activeSection = useActiveSection()
  useScrollAnimation()

  const { i18n } = useTranslation();

  // Sync RTL layout direction with language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="App bg-dark-900 min-h-screen">
      <SEO
        title="Musdar.dev | Enterprise Software Development Agency"
        description="Musdar.dev is a premium software development agency building scalable web applications, mobile platforms, and custom SaaS solutions for modern businesses."
        keywords="web development, mobile development, software development, SaaS, React, Node.js, custom software, Musdar, musdar.dev, software company, react development, node.js development, saas development, custom software development, react.js, node.js, saas, web development company, mobile development company, software development company, web development agency, mobile development agency, software development agency, software development services, mobile app development, web app development, custom software development services, mobile application development services, web application development services,
         custom software development services"

      />

      <Navbar activeSection={activeSection} />
      <ScrollIndicator activeSection={activeSection} />

      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <CaseStudies />
        <AboutCompany />
        <CTASection />
      </main>

      <GoToTop />
      <Footer />
    </div>
  )
}

export default App