import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="pt-16 pb-8 bg-dark-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center cursor-pointer mb-4">
              <img 
                src="/musdar-logo.png" 
                alt="Musdar.dev Logo" 
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <span className="ltr:ml-3 rtl:mr-3 text-xl font-bold tracking-tight text-white">
                Musdar<span className="text-primary-500">.dev</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FaLinkedin size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FaGithub size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FaTwitter size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/#services" className="hover:text-primary-400 transition-colors">{t('services.items.0.title', { defaultValue: 'Web Development' })}</a></li>
              <li><a href="/#services" className="hover:text-primary-400 transition-colors">{t('services.items.1.title', { defaultValue: 'Mobile Apps' })}</a></li>
              <li><a href="/#services" className="hover:text-primary-400 transition-colors">{t('services.items.2.title', { defaultValue: 'SaaS Platforms' })}</a></li>
              <li><a href="/#services" className="hover:text-primary-400 transition-colors">{t('services.items.4.title', { defaultValue: 'UI/UX Design' })}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/#company" className="hover:text-primary-400 transition-colors">{t('footer.about')}</a></li>
              <li><a href="/#case-studies" className="hover:text-primary-400 transition-colors">{t('footer.case_studies')}</a></li>
              <li><a href="/#contact" className="hover:text-primary-400 transition-colors">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">{t('footer.privacy')}</a></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500"> 
            © {currentYear} Musdar.dev. {t('footer.rights')}
          </p>
          <div className="text-sm text-gray-500">
            {t('footer.location')}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer