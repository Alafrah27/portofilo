import { FaHeart } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-8 bg-secondary-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm opacity-80"> 
          © Copyright {currentYear} | All rights reserved by Musdar.dev.
        </p>
      </div>
    </footer>
  )
}

export default Footer