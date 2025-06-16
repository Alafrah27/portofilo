import { FaYoutube, FaFacebookF, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import { Link } from "react-router-dom";
const SocialLinks = () => {
  return (
    <section id="/social" className="py-16 bg-secondary-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">— FIND ME ON —</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center animate-on-scroll">
            <Link to="https://github.com/Alafrah27" target="_blank" rel="noopener" className="flex flex-col items-center">
              <div className="text-secondary-600 mb-4">
                <FaGithub size={36} />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1"> github


              </h3>
              <p className="text-sm text-secondary-600">@Musdar.dev</p>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center animate-on-scroll">
            <Link to="https://www.linkedin.com/in/ali-edris-5a1032295/" target="_blank" rel="noopener" className="flex flex-col items-center">
              <div className="text-red-600 mb-4">
                <FaLinkedin size={36} />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Linkdin


              </h3>
              <p className="text-sm text-secondary-600">@Musdar.dev</p>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center animate-on-scroll">
            <Link to="https://facebook.com" target="_blank" rel="noopener" className="flex flex-col items-center">
              <div className="text-blue-600 mb-4">
                <FaFacebookF size={32} />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Facebook</h3>
              <p className="text-sm text-secondary-600">Ali Edris </p>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center animate-on-scroll">
            <Link target="_blank" rel="noopener" className="flex flex-col items-center">
              <div className="text-pink-600 mb-4">
                <FaInstagram size={32} />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Instagram</h3>
              <p className="text-sm text-secondary-600">@ali_edris</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SocialLinks