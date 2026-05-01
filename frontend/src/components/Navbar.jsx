import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaGlobe } from 'react-icons/fa'
import { scrollToSection } from '../utils/scrollTo'
import { useTranslation } from 'react-i18next'

const Navbar = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  const { t, i18n } = useTranslation()

  const toggleMenu = () => setIsOpen(!isOpen)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  }

  const navLinks = [
    { id: 'services', text: t('nav.services') },
    { id: 'why-us', text: t('nav.why_us') },
    { id: 'case-studies', text: t('nav.case_studies') },
    { id: 'company', text: t('nav.company') },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      setTimeout(() => scrollToSection(id), 100)
    }
  }, [location])

  const handleNavClick = (e, id) => {
    e.preventDefault()
    setIsOpen(false)
    navigate(`/#${id}`, { replace: true })
    scrollToSection(id)
  }

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-800/90 backdrop-blur-md shadow-lg py-3 border-b border-gray-800' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center cursor-pointer group">
            <img 
              src="/musdar-logo.png" 
              alt="Musdar.dev Logo" 
              width="180"
              height="64"
              className="h-14 md:h-16 w-auto object-contain transition-all duration-300 brightness-0 invert opacity-90 group-hover:opacity-100"
              loading='eager'
              fetchPriority="high"
              decoding="async"
            />
            <span className="ltr:ml-3 rtl:mr-3 text-xl font-bold tracking-tight text-white hidden sm:block">
              Musdar<span className="text-primary-500">.dev</span>
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            onClick={toggleLanguage}
            className="text-gray-300 hover:text-white flex items-center gap-2 text-sm font-medium"
          >
            <FaGlobe /> {i18n.language === 'en' ? 'عربي' : 'EN'}
          </button>
          <button
            className="text-gray-300 hover:text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop menu */}
        <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`text-sm font-medium tracking-wide cursor-pointer transition-colors duration-300 ${activeSection === link.id ? 'text-primary-400' : 'text-gray-400 hover:text-white'}`}
            >
              {link.text}
            </a>
          ))}
          
          <button 
            onClick={toggleLanguage}
            className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <FaGlobe /> {i18n.language === 'en' ? 'عربي' : 'EN'}
          </button>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="btn btn-primary text-sm px-5 py-2.5"
          >
            {t('nav.start_project')}
          </a>
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-dark-800 border-b border-gray-800 shadow-xl">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`block py-2 text-lg font-medium cursor-pointer transition-colors duration-300 ${activeSection === link.id ? 'text-primary-400' : 'text-gray-300 hover:text-white'}`}
              >
                {link.text}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="btn btn-primary w-full mt-4 text-center justify-center"
            >
              {t('nav.start_project')}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar