import { useState } from 'react'

const About = () => {
  const [activeTab, setActiveTab] = useState('history')

  return (
    <section id="about" className="py-20 bg-white section-padding">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/5 animate-on-scroll">
            <img
              src="/prog.avif"
              alt="Project book"
              loading='lazy'
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="md:w-3/5 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary-900">How it all started</h2>

            <div className="mb-6">
              <div className="flex space-x-4 mb-4 border-b border-secondary-200">
                <button
                  className={`py-2 px-4 font-medium transition-colors duration-300 ${activeTab === 'history' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-secondary-600'}`}
                  onClick={() => setActiveTab('history')}
                >
                  History
                </button>
                <button
                  className={`py-2 px-4 font-medium transition-colors duration-300 ${activeTab === 'education' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-secondary-600'}`}
                  onClick={() => setActiveTab('education')}
                >
                  Education
                </button>
                <button
                  className={`py-2 px-4 font-medium transition-colors duration-300 ${activeTab === 'experience' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-secondary-600'}`}
                  onClick={() => setActiveTab('experience')}
                >
                  Experience
                </button>
              </div>

              <div className="tab-content py-2">
                {activeTab === 'history' && (
                  <div className="animate-fade-in">
                    <p className="text-secondary-700 mb-4"> I started my journey in programming in 2023, driven by a strong interest in building dynamic and efficient web applications. Over the past year, I have been working as a freelance MERN stack developer, creating professional websites tailored to clients' needs. </p> <p className="text-secondary-700"> I have solid experience with React, including libraries like React Query (@tanstack/query) for state and data management, as well as backend technologies such as Express and MongoDB. My goal is to combine technical proficiency with innovative design to deliver solutions that are both functional and user-friendly. </p>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="animate-fade-in">
                    <div className="mb-4">
                      <h4 className="font-semibold text-secondary-900">High School Education</h4> <p className="text-secondary-600">I am ali edris  • 2013-2014</p> <p className="text-secondary-600"> I completed my high school education, developing a strong foundation in core subjects and cultivating my interests in technology and design. My academic journey laid the groundwork for my continued learning and professional growth in the field of web development and programming. </p>
                    </div>
                    <div>
                    </div>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="animate-fade-in">
                    <div className="mb-4">
                      <h4 className="font-semibold text-secondary-900">Mern Stack Developer</h4>
                      <p className="text-secondary-600">Freelance • 2024-Present</p>
                      <p className="text-secondary-700 mt-1">Worked with various clients to deliver tailored design solutions across multiple platforms.</p>
                    </div>

                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Graphic Design</span> */}
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Web Development</span>
              {/* <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Branding</span> */}
              {/* <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">UI/UX Design</span> */}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center animate-on-scroll">
          <p className="text-secondary-700 italic">"You only work because the capitalists haven't found a replacement to you... yet!"</p>
        </div>
      </div>
    </section>
  )
}

export default About