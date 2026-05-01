import { useNavigate } from 'react-router-dom'
import { scrollToSection } from '../utils/scrollTo'
import { useTranslation } from 'react-i18next'

const ScrollIndicator = ({ activeSection }) => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const sections = [
    { id: 'hero', label: 'Home', tKey: 'nav.company' }, // fallback
    { id: 'services', label: 'Services', tKey: 'nav.services' },
    { id: 'why-us', label: 'Why Us', tKey: 'nav.why_us' },
    { id: 'case-studies', label: 'Case Studies', tKey: 'nav.case_studies' },
    { id: 'company', label: 'Company', tKey: 'nav.company' },
    { id: 'contact', label: 'Contact', tKey: 'nav.contact' }
  ]

  const handleNavClick = (e, id) => {
    e.preventDefault()
    navigate(`/#${id}`, { replace: true })
    scrollToSection(id)
  }

  // Adjust placement based on RTL
  const positionClass = isRTL ? 'left-4' : 'right-4';
  const tooltipClass = isRTL ? 'left-6' : 'right-6';

  return (
    <div className={`fixed top-1/2 transform -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3 ${positionClass}`}>
      {sections.map(section => (
        <a
          key={section.id}
          href={`/#${section.id}`}
          onClick={(e) => handleNavClick(e, section.id)}
          title={t(section.tKey, { defaultValue: section.label })}
          className="block group py-1"
        >
          <div className="flex items-center">
            <div
              className={`scroll-dot ${activeSection === section.id ? 'active' : ''}`}
              aria-label={`Scroll to ${section.id} section`}
            />
            <span className={`absolute ${tooltipClass} bg-dark-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-gray-700 whitespace-nowrap`}>
              {t(section.tKey, { defaultValue: section.label })}
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}

export default ScrollIndicator