import { useState, useEffect } from 'react'

const SECTION_IDS = ['hero', 'services', 'why-us', 'case-studies', 'company', 'contact']

/**
 * Tracks which section is currently in view based on scroll position.
 * @param {number} offset - Pixel offset from the top for activation threshold.
 * @returns {string} The id of the currently active section.
 */
export function useActiveSection(offset = 200) {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + offset

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue

        const top = el.offsetTop
        const height = el.offsetHeight

        if (scrollY >= top && scrollY < top + height) {
          setActiveSection(id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // set initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  return activeSection
}
