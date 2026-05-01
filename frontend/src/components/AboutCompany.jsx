import { useTranslation } from 'react-i18next';

const AboutCompany = () => {
  const { t } = useTranslation();
  const stats = t('about.stats', { returnObjects: true }) || [];

  return (
    <section id="company" className="section-padding bg-dark-800 relative">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2 relative animate-on-scroll">
            <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-gray-800 relative z-10">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Our Engineering Team"
                loading="lazy"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-primary-900/20 mix-blend-overlay"></div>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute -bottom-6 ltr:-right-6 rtl:-left-6 w-full h-full border-2 border-primary-500/30 rounded-2xl z-0"></div>
          </div>

          <div className="lg:w-1/2 animate-on-scroll">
            <span className="text-primary-500 font-semibold tracking-wider uppercase text-sm">{t('about.badge')}</span>
            <h2 className="text-3xl md:text-5xl mt-2 mb-6">{t('about.title_1')} <span className="gradient-text">{t('about.title_2')}</span></h2>
            
            <div className="space-y-4 text-gray-400 text-lg leading-relaxed mb-8">
              <p>
                {t('about.desc_1')}
              </p>
              <p>
                {t('about.desc_2')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-800">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutCompany
