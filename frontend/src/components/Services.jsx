import { Smartphone, MonitorPlay, Database, Bot, LayoutTemplate } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <MonitorPlay size={32} className="text-primary-500" />,
      title: t('services.items.0.title', { defaultValue: 'Web Application Development' }),
      description: t('services.items.0.desc', { defaultValue: 'Custom, scalable web applications built with React, Node.js, and modern cloud architecture for high performance.' })
    },
    {
      icon: <Smartphone size={32} className="text-accent-500" />,
      title: t('services.items.1.title'),
      description: t('services.items.1.desc')
    },
    {
      icon: <Database size={32} className="text-primary-400" />,
      title: t('services.items.2.title'),
      description: t('services.items.2.desc')
    },
    {
      icon: <Bot size={32} className="text-accent-400" />,
      title: t('services.items.3.title'),
      description: t('services.items.3.desc')
    },
    {
      icon: <LayoutTemplate size={32} className="text-gray-300" />,
      title: t('services.items.4.title'),
      description: t('services.items.4.desc')
    }
  ];

  return (
    <section id="services" className="section-padding bg-dark-900 border-t border-gray-800">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="text-primary-500 font-semibold tracking-wider uppercase text-sm">{t('services.badge')}</span>
          <h2 className="text-3xl md:text-5xl mt-2 mb-4">{t('services.title_1')} <span className="gradient-text">{t('services.title_2')}</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t('services.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
          {services.map((service, index) => (
            <div key={index} className="tech-card group">
              <div className="mb-6 p-4 rounded-xl bg-dark-700/50 inline-block w-fit group-hover:bg-primary-900/20 transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl mb-3">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
