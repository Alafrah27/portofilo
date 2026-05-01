import { useState } from 'react'
import { Mail, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CTASection = () => {
  const [formStatus, setFormStatus] = useState('idle');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(event.target);
    formData.append("access_key", "92aca851-d1bf-4030-ab58-b0dc3e0182a3");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      }).then((res) => res.json());

      if (res.success) {
        setFormStatus('success');
        event.target.reset();
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      setFormStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-dark-900 relative overflow-hidden border-t border-gray-800">
      {/* Background Orbs */}
      <div className={`absolute top-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] ${isRTL ? 'left-0' : 'right-0'}`}></div>
      
      <div className="container mx-auto container-padding relative z-10">
        <div className="glass-card max-w-6xl mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left side info */}
            <div className={`lg:w-5/12 bg-dark-800 p-10 md:p-14 flex flex-col justify-center border-b lg:border-b-0 ${isRTL ? 'lg:border-l' : 'lg:border-r'} border-gray-800`}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('cta.title')}</h2>
              <p className="text-gray-400 mb-8 text-lg">
                {t('cta.description')}
              </p>
              
              <div className="space-y-6">
                <a href="mailto:almusdarthafa@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-dark-900 rounded-lg flex items-center justify-center text-primary-500 border border-gray-800 group-hover:border-primary-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{t('cta.email_label')}</p>
                    <p className="text-white font-medium">almusdarthafa@gmail.com</p>
                  </div>
                </a>
                
                <a href="https://wa.me/966555475591" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-dark-900 rounded-lg flex items-center justify-center text-accent-500 border border-gray-800 group-hover:border-accent-500 transition-colors">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{t('cta.whatsapp_label')}</p>
                    <p className="text-white font-medium">+966 55 547 5591</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right side form */}
            <div className="lg:w-7/12 p-10 md:p-14 bg-dark-900/50">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">{t('cta.form.name')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder={t('cta.form.name_placeholder')}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">{t('cta.form.email')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder={t('cta.form.email_placeholder')}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">{t('cta.form.details')}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder={t('cta.form.details_placeholder')}
                    className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`btn w-full ${formStatus === 'success' ? 'bg-green-600 text-white' : 'btn-primary'}`}
                >
                  {formStatus === 'idle' && t('cta.form.btn_idle')}
                  {formStatus === 'submitting' && t('cta.form.btn_submitting')}
                  {formStatus === 'success' && t('cta.form.btn_success')}
                  {formStatus === 'error' && t('cta.form.btn_error')}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
