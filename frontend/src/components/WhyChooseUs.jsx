import { ShieldCheck, Zap, Users, Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhyChooseUs = () => {
  const { t, i18n } = useTranslation();

  const features = [
    {
      icon: <Zap size={24} className="text-primary-500" />,
      title: t('why_us.items.0.title'),
      description: t('why_us.items.0.desc')
    },
    {
      icon: <ShieldCheck size={24} className="text-accent-500" />,
      title: t('why_us.items.1.title'),
      description: t('why_us.items.1.desc')
    },
    {
      icon: <Code2 size={24} className="text-primary-400" />,
      title: t('why_us.items.2.title'),
      description: t('why_us.items.2.desc')
    },
    {
      icon: <Users size={24} className="text-accent-400" />,
      title: t('why_us.items.3.title'),
      description: t('why_us.items.3.desc')
    }
  ];

  const bullets = t('why_us.bullets', { returnObjects: true }) || [];

  return (
    <section id="why-us" className="section-padding bg-dark-800 relative overflow-hidden">
      {/* Background glow - flip depending on RTL */}
      <div className={`absolute top-0 w-1/2 h-full bg-gradient-glow opacity-30 pointer-events-none ${i18n.language === 'ar' ? 'left-0' : 'right-0'}`}></div>

      <div className="container mx-auto container-padding relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="lg:w-1/2 animate-on-scroll">
            <span className="text-primary-500 font-semibold tracking-wider uppercase text-sm">{t('why_us.badge')}</span>
            <h2 className="text-3xl md:text-5xl mt-2 mb-6">{t('why_us.title_1')} <span className="text-white">{t('why_us.title_2')}</span></h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {t('why_us.description')}
            </p>
            
            <ul className="space-y-4 mb-8">
              {bullets.map((item, i) => (
                <li key={i} className="flex items-center text-gray-300">
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full bg-primary-500/20 text-primary-500 ${i18n.language === 'ar' ? 'ml-3' : 'mr-3'}`}>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-on-scroll">
            {features.map((feature, idx) => (
              <div key={idx} className="glass-card p-6 hover:bg-dark-700/80 transition-colors duration-300">
                <div className="mb-4 bg-dark-900 w-12 h-12 rounded-lg flex items-center justify-center border border-gray-800 shadow-glow">
                  {feature.icon}
                </div>
                <h3 className="text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
