import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        cream: '#F5F0E8',
        ink: '#1a1a18',
        brand: '#C4500A',
        'brand-dark': '#A8420A',
        purple: {
          DEFAULT: '#534AB7',
          light: '#7F77DD',
          pale: '#EEEDFE',
        },
      },
    },
  },
  plugins: [],
}

export default config
