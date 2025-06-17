import { useState, useEffect, lazy, Suspense, } from 'react'
import Navbar from './components/Navbar'
import About from './components/About'
import SocialLinks from './components/SocialLinks'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SEO from './components/SEO'
import GoToTop from './components/GoToTop'
import LoadingPage from './components/LazyPage'
import SkillTools from './components/SkillTools'
// import Hero from './components/Hero'

// Lazy load components

const LazyHero = lazy(() => import('./components/Hero'))

// Fixed typo: SKillLazy -> SkillsLazy

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section')
      const scrollPosition = window.scrollY + 200

      sections.forEach(section => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animation on scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      { threshold: 0.1 }
    )

    // Use a timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.unobserve(el)
      })
    }
  }, [])

  return (
    <div className="App">
      <SEO
        title="Musdar.dev | Mern Stack Web Developer "
        description="Welcome to Musdar.dev – I'm a skilled MERN Stack Developer specializing in building fast, scalable, and responsive web applications using MongoDB, Express.js, React, and Node.js. With a passion for clean code and modern design, I bring ideas to life through innovative full-stack solutions. Whether you're looking to develop a custom web app, improve user experience, or enhance performance, I'm here to help. Explore my portfolio and lets create something powerful together."
      />
      <Navbar activeSection={activeSection} />

      <main>
        <Suspense fallback={<LoadingPage />}>
          <LazyHero />
        </Suspense>

        <About />
        <SocialLinks />
        <Projects />
        <SkillTools />

        <Contact />
      </main>

      <GoToTop />
      <Footer />
    </div>
  )
}

export default App