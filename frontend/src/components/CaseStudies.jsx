import { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowUpLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { axiosInstance } from '../lib/Axios'
import { prepareCaseStudy } from '../lib/caseStudies'
import './CaseStudies.css'

export default function CaseStudies() {
  const { t, i18n } = useTranslation()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const isRTL = i18n.dir() === 'rtl'
  const Arrow = isRTL ? ArrowUpLeft : ArrowUpRight

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(false)
    axiosInstance.get('/projects', { signal: controller.signal })
      .then(({ data }) => {
        if (!Array.isArray(data.projects)) throw new Error('Invalid project response')
        if (!controller.signal.aborted) setProjects(data.projects.map(prepareCaseStudy))
      })
      .catch(() => { if (!controller.signal.aborted) setError(true) })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false) })
    return () => controller.abort()
  }, [reloadKey])

  return (
    <section id="case-studies" className="section-padding scroll-mt-24 border-t border-gray-800 bg-dark-900" aria-labelledby="case-studies-heading">
      <div className="container mx-auto container-padding">
        <div className="mb-12 max-w-2xl animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-500">{t('case_studies.badge')}</span>
          <h2 id="case-studies-heading" className="mb-4 mt-2 text-3xl md:text-5xl">{t('case_studies.title_1')} <span className="gradient-text">{t('case_studies.title_2')}</span></h2>
          <p className="text-lg text-gray-400">{t('case_studies.description')}</p>
        </div>
        <div aria-busy={isLoading}>
          {isLoading ? (
            <div role="status" className="flex items-center justify-center gap-3 py-20 text-gray-400">
              <span aria-hidden="true" className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              {t('case_studies.loading')}
            </div>
          ) : error ? (
            <div role="alert" className="glass-card p-10 text-center">
              <p className="text-gray-400">{t('case_studies.error')}</p>
              <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn btn-secondary mt-5">{t('case_studies.retry')}</button>
            </div>
          ) : projects.length === 0 ? (
            <p className="glass-card p-12 text-center text-gray-400">{t('case_studies.empty')}</p>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {projects.map((project) => (
                  <article key={project._id} className="glass-card group overflow-hidden lg:grid lg:grid-cols-2">
                    <div className="flex h-[360px] items-center justify-center gap-2 overflow-hidden bg-black px-5 py-6 sm:h-[440px] sm:gap-4 sm:px-8 lg:min-h-[460px]">
                      {project.images.slice(0, 2).map((image, imageIndex) => (
                        <img key={image.publicId || image.url} src={image.url}
                          alt={t('case_studies.image_alt', { title: project.title, index: imageIndex + 1 })}
                          loading="lazy" decoding="async" width="899" height="1599"
                          className="h-full min-w-0 flex-1 object-contain transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" />
                      ))}
                    </div>
                    <div className="flex flex-col items-start p-7 sm:p-10 lg:justify-center lg:p-12">
                      <span className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">{t('case_studies.featured')}</span>
                      <h3 dir="auto" className="mb-5 text-2xl leading-snug text-white sm:text-3xl">{project.title}</h3>
                      <p dir="auto" className="mb-8 line-clamp-4 text-sm leading-7 text-gray-400">{project.summary}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-4">
                      <Link to={`/case-studies/${project._id}`}
                        aria-label={t('case_studies.view_named', { title: project.title })}
                        className="mt-auto inline-flex items-center gap-3 rounded-lg border border-primary-500/30 bg-primary-500/10 px-5 py-3 text-sm font-medium text-primary-300 transition-colors hover:border-primary-400 hover:bg-primary-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400">
                        {t('case_studies.view')} <Arrow size={18} aria-hidden="true" />
                      </Link>
                      {project.websiteUrl && <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded text-sm text-gray-400 hover:text-primary-300 focus-visible:outline focus-visible:outline-primary-400">
                        {t('case_studies.visit_website')} <Arrow size={17} aria-hidden="true" />
                      </a>}
                      </div>
                    </div>
                  </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
