import { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowUpLeft } from 'lucide-react'
import { axiosInstance } from '../lib/Axios'
import { useTranslation } from 'react-i18next'

const CaseStudies = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get('/project/all');
        if (Array.isArray(res.data)) {
          setProjects(res.data);
        } else {
          setProjects([]);
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message || t('case_studies.error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [t]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="text-center py-10 bg-dark-800 border border-red-900/50 rounded-lg max-w-2xl mx-auto">
      <p className="text-red-400">{t('case_studies.error')}</p>
    </div>
  );

  return (
    <section id='case-studies' className="section-padding bg-dark-900 border-t border-gray-800">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 animate-on-scroll">
          <div className="max-w-2xl">
            <span className="text-primary-500 font-semibold tracking-wider uppercase text-sm">{t('case_studies.badge')}</span>
            <h2 className="text-3xl md:text-5xl mt-2 mb-4">{t('case_studies.title_1')} <span className="gradient-text">{t('case_studies.title_2')}</span></h2>
            <p className="text-gray-400 text-lg">
              {t('case_studies.description')}
            </p>
          </div>
        </div>

        {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay /> : (
          projects.length === 0 ? (
            <div className="text-center py-20 bg-dark-800 rounded-2xl border border-gray-800">
              <p className="text-gray-500">{t('case_studies.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-on-scroll">
              {projects.map((project, index) => (
                <a 
                  key={project?._id || index} 
                  href={project?.url || '#'} 
                  target={project?.url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group block glass-card overflow-hidden hover:border-primary-500/30"
                >
                  <div className="relative h-60 overflow-hidden bg-dark-900 border-b border-gray-800">
                    <img
                      src={project?.image}
                      alt={project?.title}
                      loading='lazy'
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                    
                    {/* Floating icon on hover */}
                    <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-primary-500 text-white p-2 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-glow`}>
                      {isRTL ? <ArrowUpLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-dark-700 text-primary-400 rounded-md uppercase tracking-wider">Web App</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-white group-hover:text-primary-400 transition-colors">
                      {project?.title || 'Enterprise Solution'}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {project?.description || 'A comprehensive digital solution addressing complex business requirements and scaling challenges.'}
                    </p>
                    
                    {/* Fake Metrics */}
                    <div className="mt-6 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xl font-bold text-white">40%</div>
                        <div className="text-xs text-gray-500 uppercase">{t('case_studies.metrics.speed')}</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">2.5x</div>
                        <div className="text-xs text-gray-500 uppercase">{t('case_studies.metrics.conversion')}</div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default CaseStudies;
