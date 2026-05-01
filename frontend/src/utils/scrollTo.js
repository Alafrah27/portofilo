/**
 * Smoothly scrolls to a section by its element ID.
 * @param {string} id - The target element's ID (without #).
 * @param {number} offset - Pixel offset from the top (e.g. for a fixed navbar).
 */
export function scrollToSection(id, offset = 70) {
  const element = document.getElementById(id)
  if (!element) return

  const top = element.getBoundingClientRect().top + window.scrollY - offset

  window.scrollTo({
    top,
    behavior: 'smooth',
  })
}
