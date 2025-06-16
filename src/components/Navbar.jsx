import { useState, useEffect } from 'react'
import { Link } from "react-scroll"
  // import { Link } from "react-router-dom"
  ;
import { FaBars, FaTimes } from 'react-icons/fa'

const Navbar = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { id: 'hero', text: 'Home' },
    { id: 'about', text: 'About' },
    { id: 'projects', text: 'Projects' },
    { id: 'skills', text: 'Skills' },
    { id: 'contact', text: 'Contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-green-500 cursor-pointer" onClick={() => window.location.reload()}>Musdar.dev</h1>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-secondary-900 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop menu */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link
              key={link.id}
              to={link.id}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className={`cursor-pointer hover:text-primary-500 transition-colors duration-300 ${activeSection === link.id ? 'nav-active' : ''}`}
            >
              {link.text}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.id}
                to={link.id}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className={`block py-2 cursor-pointer hover:text-primary-500 transition-colors duration-300 ${activeSection === link.id ? 'nav-active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar