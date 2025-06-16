import { useState } from 'react'
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import { Link } from "react-router-dom";

const Contact = () => {


  // 92aca851-d1bf-4030-ab58-b0dc3e0182a3
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "92aca851-d1bf-4030-ab58-b0dc3e0182a3");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
      alert("Success! Your message has been sent.");
      event.target.reset();
    } else {
      console.log("Error", res);
      alert("Error! Please try again.");
    }
  };

  return (



    <section id="contact" className="py-20 bg-gradient-primary text-white section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-4"> Get in Touch</h2>
          <p className="max-w-2xl mx-auto opacity-90">
            Lets discuss how we can work together to bring your ideas to life. Reach out through the form below or connect directly via WhatsApp or email.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 max-w-5xl mx-auto">
          <div className="md:w-1/2 animate-on-scroll">
            <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md text-secondary-900">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"

                  className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"

                  className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"

                  rows="5"
                  className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="md:w-1/2 flex flex-col justify-center animate-on-scroll">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-6">
              <h3 className="text-2xl font-bold mb-4">Let&apos;s Connect</h3>
              <p className="mb-6 opacity-90">
                I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your vision.
              </p>

              <div className="space-y-4">
                <Link
                  to="https:/wa.me/+966555475591"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-3 p-4 bg-green-500 hover:bg-green-600 rounded-md transition-colors duration-300"
                >
                  <FaWhatsapp size={24} />
                  <span>WhatsApp Me</span>
                </Link>

                <Link
                  to="mailto:almusdarthafa@gmail.com"
                  className="flex items-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors duration-300"
                >
                  <FaEnvelope size={24} />
                  <span>Email Me</span>
                </Link>
              </div>
            </div>

            <div className="text-center">
              <p className="opacity-80 text-sm">
                Typically responds within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

export default Contact