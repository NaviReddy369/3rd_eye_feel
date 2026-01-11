/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Tech/AI Color Palette - Dark, minimal, professional
        'tech-dark': '#0a0a0a',
        'tech-darker': '#050505',
        'tech-gray': '#1a1a1a',
        'tech-gray-light': '#2a2a2a',
        'tech-gray-lighter': '#3a3a3a',
        'tech-border': '#333333',
        'tech-text': '#e5e5e5',
        'tech-text-muted': '#a3a3a3',
        'tech-cyan': '#00d9ff',
        'tech-cyan-dark': '#00b8d9',
        'tech-blue': '#0066ff',
        'tech-blue-dark': '#0052cc',
        'tech-accent': '#00ff88',
        'tech-accent-dark': '#00cc6a',
      },
      backgroundImage: {
        'tech-primary': 'linear-gradient(135deg, #0066ff 0%, #00d9ff 100%)',
        'tech-secondary': 'linear-gradient(135deg, #00ff88 0%, #00d9ff 100%)',
        'tech-mesh': 'radial-gradient(at 0% 0%, rgba(0, 217, 255, 0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0, 255, 136, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 102, 255, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(0, 217, 255, 0.1) 0px, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 217, 255, 0.5), 0 0 10px rgba(0, 217, 255, 0.3)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0, 217, 255, 0.5)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
