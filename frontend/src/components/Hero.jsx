import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollToSection } from '../utils/scrollTo';
import { ArrowRight, Code, Cpu, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = memo(() => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleNavClick = (e, id) => {
    e.preventDefault();
    navigate(`/#${id}`, { replace: true });
    scrollToSection(id);
  };

  const isRTL = i18n.language === 'ar';

  return (
    <section id="hero" className="min-h-screen relative flex items-center pt-20 overflow-hidden">
      {/* Background with abstract grid and gradients instead of photo */}
      <div className="absolute inset-0 bg-dark-900 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-gray-700 text-sm text-gray-300 mb-8 animate-slide-up">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse-slow"></span>
            {t('hero.tagline')}
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t('hero.title_1')} <br className="hidden md:block"/>
            <span className="gradient-text">{t('hero.title_2')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="btn btn-primary w-full sm:w-auto"
            >
              {t('hero.cta_primary')} <ArrowRight size={18} className={`mx-2 ${isRTL ? 'rotate-180' : ''}`} />
            </a>
            <a
              href="#case-studies"
              onClick={(e) => handleNavClick(e, 'case-studies')}
              className="btn btn-secondary w-full sm:w-auto"
            >
              {t('hero.cta_secondary')}
            </a>
          </div>

          <div className="mt-20 pt-10 border-t border-gray-800 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-semibold">{t('hero.tech_stack')}</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              <div className="flex items-center gap-2 text-gray-300"><Code size={24} /> <span className="font-medium">React & Next.js</span></div>
              <div className="flex items-center gap-2 text-gray-300"><Layers size={24} /> <span className="font-medium">Node.js</span></div>
              <div className="flex items-center gap-2 text-gray-300"><Cpu size={24} /> <span className="font-medium">Cloud Native</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;