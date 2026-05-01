/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#050505',
          800: '#0A0A0B',
          700: '#121214',
          600: '#1C1C1F',
          500: '#2A2A2E',
        },
        primary: {
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald tech color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        accent: {
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Cyan tech accent
          600: '#0891b2',
          700: '#0e7490',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Cairo', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Cairo', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-glow': 'linear-gradient(to right, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
        'gradient-primary': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'glow-lg': '0 0 30px -5px rgba(16, 185, 129, 0.5)',
      }
    },
  },
  plugins: [],
}