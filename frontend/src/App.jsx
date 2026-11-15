import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CaseStudyPage from './pages/CaseStudyPage'
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

function HomePage() {
  const activeSection = useActiveSection()
  useScrollAnimation()

  const { t } = useTranslation();
  return (
    <div className="App bg-dark-900 min-h-screen">
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        keywords={t('seo.keywords')}
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

function App() {
  const { i18n } = useTranslation()
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.dir = i18n.dir()
    document.documentElement.lang = i18n.language
  }, [i18n, i18n.language])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/case-studies/:id" element={<CaseStudyPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}

export default App
