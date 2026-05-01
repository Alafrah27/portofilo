# Musdar.dev Frontend | Crafting Digital Legacies

**Welcome to Musdar.dev.** 

We don't just write code; we breathe life into ideas. Born from a deep passion for technology and a relentless drive for perfection, Musdar is where your vision finds its digital heartbeat. We understand that behind every application is a dream, a business fighting to scale, and a founder trying to make an impact. 

That is why we build more than just software. We craft elegant, scalable, and powerful digital experiences that empower businesses to thrive in a complex world. From the first line of code to the final pixel, everything we build is infused with purpose, dedication, and an unwavering commitment to excellence.

This is the frontend manifestation of that vision—a premium, globally-ready platform built to connect, inspire, and grow.

## 🚀 Key Features

* **Premium UI/UX:** Dark-themed, glassmorphism design with emerald green and cyan accents.
* **Bilingual (i18n):** Full support for English (LTR) and Arabic (RTL) out of the box, powered by `react-i18next`.
* **Dynamic RTL Layout:** Automatically mirrors margins, paddings, and icon directions when switching to Arabic using Tailwind CSS native RTL utilities.
* **Responsive Design:** Mobile-first architecture that scales beautifully to enterprise desktop monitors.
* **Scroll Animations:** Built-in scroll-spy navigation and slide-up reveal animations (`useScrollAnimation` hook).
* **Strong SEO:** Integrated `react-helmet-async` with Open Graph tags, Twitter Cards, and Schema.org JSON-LD structured data for local business and software applications.
* **Lead Generation:** Integrated Web3Forms contact form ready to capture enterprise leads.

## 🛠️ Tech Stack

* **Framework:** React 18
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (v3/v4 architecture)
* **Routing:** React Router v6
* **Internationalization:** `i18next` & `react-i18next`
* **Icons:** Lucide React
* **SEO Management:** React Helmet Async

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── components/       # Reusable UI components (Hero, Navbar, CaseStudies, etc.)
│   ├── hooks/            # Custom React hooks (useActiveSection, useScrollAnimation)
│   ├── locales/          # (Optional) Extracted JSON translations
│   ├── App.jsx           # Main application routing and RTL logic
│   ├── i18n.js           # Internationalization configuration and dictionaries
│   ├── index.css         # Global Tailwind directives and CSS variables
│   └── main.jsx          # React DOM entry point
├── public/               # Static assets (Logos, favicons, etc.)
├── tailwind.config.js    # Tailwind theme configuration
└── vite.config.js        # Vite bundler configuration
```

## 💻 Local Development Setup

1. **Install Dependencies:**
   Make sure you are in the `frontend` directory, then run:
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will usually be available at `http://localhost:5173`.

3. **Build for Production:**
   ```bash
   npm run build
   ```
   This will generate an optimized, minified bundle in the `dist/` directory.

## 🌍 Language Management (i18n)

All copy text is managed inside `src/i18n.js`. To update a translation:
1. Open `src/i18n.js`.
2. Locate the specific component key under `resources.en.translation` or `resources.ar.translation`.
3. Update the text string.
*Note: Due to Vite caching, you may occasionally need to perform a hard refresh in your browser (F5) if i18n dictionary changes do not hot-reload immediately.*

## 📈 Next Steps & Backend Integration
While this frontend is fully operational as a static site, it is designed to be paired with the **Musdar Admin Dashboard** and a Node.js/Express backend to dynamically pull:
* Featured Case Studies
* Dynamic Company Metrics
* Service Offerings
