import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { axiosInstance } from '../lib/Axios'
import { prepareCaseStudy } from '../lib/caseStudies'
import '../components/CaseStudies.css'

export default function CaseStudyPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [result, setResult] = useState({ id: null, status: 'loading', project: null })
  const [reloadKey, setReloadKey] = useState(0)
  const status = result.id === id ? result.status : 'loading'
  const project = status === 'success' ? result.project : null
  const BackArrow = i18n.dir() === 'rtl' ? ArrowRight : ArrowLeft

  useEffect(() => {
    const controller = new AbortController()
    if (!/^[a-f\d]{24}$/i.test(id)) {
      setResult({ id, status: 'not-found', project: null })
      return () => controller.abort()
    }
    setResult({ id, status: 'loading', project: null })
    axiosInstance.get(`/projects/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!data.project || data.project._id !== id) throw new Error('Invalid project response')
        if (!controller.signal.aborted) setResult({ id, status: 'success', project: prepareCaseStudy(data.project) })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ id, status: error.response?.status === 404 ? 'not-found' : 'error', project: null })
      })
    return () => controller.abort()
  }, [id, reloadKey])

  return (
    <div className="min-h-screen bg-dark-900">
      <SEO title={project ? `${project.title} | Musdar.dev` : `${t('case_studies.case_study')} | Musdar.dev`}
        description={project?.summary || t('case_studies.description')}
        image={project?.images[0]?.url} url={`https://musdar.dev/case-studies/${encodeURIComponent(id)}`} />
      <Navbar activeSection="case-studies" />
      <main id="case-study-content" className="container mx-auto container-padding pb-20 pt-36 sm:pt-44" aria-busy={status === 'loading'}>
        <Link to="/#case-studies" className="mb-10 inline-flex items-center gap-2 rounded text-sm text-gray-400 transition-colors hover:text-primary-300 focus-visible:outline focus-visible:outline-primary-400">
          <BackArrow size={17} aria-hidden="true" /> {t('case_studies.back')}
        </Link>
        {status === 'loading' ? (
          <div role="status" className="flex min-h-64 items-center justify-center gap-3 text-gray-400">
            <span aria-hidden="true" className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            {t('case_studies.loading')}
          </div>
        ) : status === 'not-found' ? (
          <div className="glass-card px-6 py-20 text-center">
            <p className="mb-3 text-sm text-primary-400">404</p>
            <h1 className="mb-4 text-3xl">{t('case_studies.not_found')}</h1>
            <p className="text-gray-400">{t('case_studies.not_found_description')}</p>
          </div>
        ) : status === 'error' ? (
          <div role="alert" className="glass-card px-6 py-20 text-center">
            <h1 className="mb-4 text-2xl">{t('case_studies.error')}</h1>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn btn-secondary">{t('case_studies.retry')}</button>
          </div>
        ) : project && (
          <article>
            <header className="mb-10 max-w-4xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-400">{t('case_studies.case_study')}</p>
              <h1 dir="auto" className="text-3xl leading-tight sm:text-5xl">{project.title}</h1>
              {project.websiteUrl && <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-primary mt-6 gap-2 text-sm">{t('case_studies.visit_website')} <ArrowUpRight size={17} aria-hidden="true" /></a>}
            </header>
            <div className={`mb-14 grid gap-6 rounded-2xl border border-gray-800 bg-black p-5 sm:p-10 ${project.images.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {project.images.map((image, index) => (
                <a key={image.publicId || image.url} href={image.url} target="_blank" rel="noopener noreferrer"
                  aria-label={t('case_studies.open_image', { index: index + 1 })}
                  className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-400">
                  <img src={image.url} alt={t('case_studies.image_alt', { title: project.title, index: index + 1 })}
                    loading={index === 0 ? 'eager' : 'lazy'} decoding="async" width="899" height="1599"
                    className="max-h-[560px] w-full object-contain" />
                </a>
              ))}
            </div>
            <div dir="auto" className="case-study-story" dangerouslySetInnerHTML={{ __html: project.story }} />
            <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-between gap-5 border-t border-gray-800 pt-8">
              <Link to="/#case-studies" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary-300"><BackArrow size={17} /> {t('case_studies.back')}</Link>
              <Link to="/#contact" className="btn btn-primary gap-2">{t('nav.start_project')} <ArrowUpRight size={17} /></Link>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  )
}
