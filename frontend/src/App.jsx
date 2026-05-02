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

  const {t, i18n } = useTranslation();

  // Sync RTL layout direction with language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

  }, [i18n.language]);

  useEffect(() => {
    // scroll to top
    window.scrollTo(0, 0);

  }, []);
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

export default App