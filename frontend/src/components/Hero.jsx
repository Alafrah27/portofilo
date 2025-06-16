import { Link } from "react-scroll";
// import { FaChevronDown } from 'react-icons/fa';
import { memo, useMemo } from 'react';

const Hero = memo(() => {
  // Memoize static content to prevent unnecessary re-renders
 
  const heroContent = useMemo(() => ({
    title: "Hi, I'm Ali Edris",
    description: "I'm a passionate MERN Stack Developer dedicated to building responsive and user-friendly web applications with clean, modern code. I thrive on transforming ideas into seamless digital experiences and constantly seek to learn and incorporate the latest technologies. Committed to writing efficient, scalable solutions that deliver exceptional performance and security. My goal is to create impactful, innovative apps that users love."
  }), []);



  return (
    <section id="hero" className="min-h-screen relative overflow-hidden pt-20">
      {/* Use transform3d for hardware acceleration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-700 opacity-90 will-change-transform transform translate3d(0,0,0)"></div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="lg:w-1/2 text-white mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 will-change-transform">
            {heroContent.title}
          </h1>
          <p className=" block text-[15px] md:text-xl mb-8 ">
            {heroContent.description}
          </p>
          <div className="flex space-x-4">
            <Link to="projects"

              className="btn btn-primary transform transition-transform hover:scale-105 will-change-transform"
            >
              View Projects
            </Link>
            <Link
              to="contact"

              className="btn btn-secondary text-white border-white transform transition-transform hover:scale-105 will-change-transform"
            >
              Contact Me
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/20 flex items-center justify-center will-change-transform">
            {/* Optimized image with proper loading attributes */}
            <img
              src="/hero3.png"
              alt="Ali Edris - MERN Stack Developer"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'




            // Force hardware acceleration


            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce will-change-transform">

      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;