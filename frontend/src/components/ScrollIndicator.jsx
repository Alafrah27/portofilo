import { Link } from 'react-scroll'

const ScrollIndicator = ({ activeSection }) => {
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'social', label: 'Social' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <div className="scroll-indicator">
      {sections.map(section => (
        <Link
          key={section.id}
          to={section.id}
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
          title={section.label}
        >
          <div
            className={`scroll-dot ${activeSection === section.id ? 'active' : ''}`}
            aria-label={`Scroll to ${section.label} section`}
          />
        </Link>
      ))}
    </div>
  )
}

export default ScrollIndicator