import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollToSection } from '../utils/scrollTo';
import { ArrowRight, Code, Cpu, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Hero.css';

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
    <section id="hero" aria-labelledby="hero-heading" className="hero-section relative isolate flex items-center overflow-hidden bg-dark-900">
      <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-0 -z-10" />

      <div className="container relative mx-auto container-padding">
        <div className="mx-auto max-w-4xl text-center">
          <div className="hero-eyebrow mb-7 inline-flex max-w-full items-center gap-2.5 rounded-full border border-primary-400/15 bg-primary-500/5 px-3.5 py-2 text-[11px] font-medium leading-5 text-primary-200 sm:mb-8 sm:text-xs">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400 shadow-[0_0_10px_#34d39966]" />
            {t('hero.tagline')}
          </div>

          <h1 id="hero-heading" className="hero-heading mx-auto mb-6 max-w-4xl text-white">
            <span className="block">{t('hero.title_1')}</span>
            <span className="gradient-text mt-1 block">{t('hero.title_2')}</span>
          </h1>

          <p className="mx-auto mb-8 max-w-[35rem] text-[15px] leading-7 text-gray-400 sm:mb-9 sm:text-base sm:leading-8">
            {t('hero.description')}
          </p>

          <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row">
            <a 
              href="/#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="hero-cta inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-primary-400 px-6 py-3 text-sm font-semibold text-dark-900 transition-colors hover:bg-primary-300 sm:w-auto"
            >
              {t('hero.cta_primary')} <ArrowRight aria-hidden="true" size={17} className={isRTL ? 'rotate-180' : ''} />
            </a>
            <a
              href="/#case-studies"
              onClick={(e) => handleNavClick(e, 'case-studies')}
              className="hero-cta inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-gray-700/70 bg-white/[0.02] px-6 py-3 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-white/5 sm:w-auto"
            >
              {t('hero.cta_secondary')}
            </a>
          </div>

          <div className="mx-auto mt-12 max-w-2xl border-t border-white/[0.06] pt-6 sm:mt-14 sm:pt-7">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-500">{t('hero.tech_stack')}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-xs text-gray-400 sm:gap-x-10 sm:text-sm">
              <div className="flex items-center gap-2"><Code aria-hidden="true" size={17} className="text-gray-500" /> <span>React & Next.js</span></div>
              <div className="flex items-center gap-2"><Layers aria-hidden="true" size={17} className="text-gray-500" /> <span>Node.js</span></div>
              <div className="flex items-center gap-2"><Cpu aria-hidden="true" size={17} className="text-gray-500" /> <span>Cloud Native</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
