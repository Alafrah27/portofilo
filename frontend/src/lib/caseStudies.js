import DOMPurify from 'dompurify'

export function prepareCaseStudy(project) {
  const story = DOMPurify.sanitize(project.description || '', {
    ALLOWED_TAGS: ['p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['href', 'title', 'colspan', 'rowspan'],
  })
  const document = new DOMParser().parseFromString(story, 'text/html')
  const summary = (document.querySelector('p')?.textContent || document.body.textContent || '').replace(/\s+/g, ' ').trim()
  let websiteUrl = ''
  try {
    const url = new URL(project.websiteUrl)
    if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password) websiteUrl = url.href
  } catch { /* Older projects may not have a live website. */ }
  return { ...project, story, summary, websiteUrl }
}
