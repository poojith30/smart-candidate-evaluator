/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          darkest: '#070a12',
          darker: '#0c1222',
          card: '#11192e',
          cardHover: '#16213d',
          border: '#1e2d4d',
        },
        agent: {
          tech: {
            DEFAULT: '#06b6d4',
            subtle: 'rgba(6, 182, 212, 0.1)',
            border: 'rgba(6, 182, 212, 0.3)',
          },
          culture: {
            DEFAULT: '#10b981',
            subtle: 'rgba(16, 185, 129, 0.1)',
            border: 'rgba(16, 185, 129, 0.3)',
          },
          manager: {
            DEFAULT: '#f59e0b',
            subtle: 'rgba(245, 158, 11, 0.1)',
            border: 'rgba(245, 158, 11, 0.3)',
          },
          skeptic: {
            DEFAULT: '#f43f5e',
            subtle: 'rgba(244, 63, 94, 0.1)',
            border: 'rgba(244, 63, 94, 0.3)',
          },
          debate: {
            DEFAULT: '#a855f7',
            subtle: 'rgba(168, 85, 247, 0.1)',
            border: 'rgba(168, 85, 247, 0.3)',
          },
          decision: {
            DEFAULT: '#6366f1',
            subtle: 'rgba(99, 102, 241, 0.1)',
            border: 'rgba(99, 102, 241, 0.3)',
          }
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.25)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.25)',
        'glow-rose': '0 0 20px -5px rgba(244, 63, 94, 0.25)',
        'glow-purple': '0 0 20px -5px rgba(168, 85, 247, 0.25)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
}
