import { useEffect } from 'react'

/**
 * Observes elements with `.animate-on-scroll` and adds the `active` class
 * when they enter the viewport.
 * @param {number} threshold - Visibility ratio required to trigger (0–1).
 */
export function useScrollAnimation(threshold = 0.1) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      { threshold }
    )

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [threshold])
}
