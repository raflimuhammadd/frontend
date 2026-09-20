import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      /* NodeWave Design System - Direct Hex Values (Flat Structure) */
      'brand-dark': '#0f1419',
      'brand-red': '#e63946',
      'brand-green': '#2a9d8f',
      'brand-orange': '#f4a261',
      
      'background': '#f4f5f6',
      'background-card': '#ffffff',
      'background-dark': '#252d35',
      
      'text-primary': '#111820',
      'text-secondary': '#7d8a99',
      'text-tertiary': '#aab4bd',
      'text-on-dark': '#e5e5e5',
      
      'border-light': '#cfd6dc',
      'border-dark': '#252d35',
      
      'status-todo': '#3b82f6',
      'status-in-progress': '#f4a261',
      'status-done': '#2a9d8f',
      'status-blocked': '#e63946',
      
      'hover-bg': '#f8fafb',
      
      /* Standard Tailwind */
      'white': '#ffffff',
      'black': '#000000',
      'transparent': 'transparent',
      'foreground': '#111820',
      'card': '#ffffff',
      'primary': '#111820',
      'secondary': '#7d8a99',
      'accent': '#e63946',
      'muted': '#aab4bd',
      'success': '#2a9d8f',
      'error': '#e63946',
      'warning': '#f4a261',
      'info': '#0284c7',
    },
    fontFamily: {
      heading: ['Cabinet Grotesk', 'system-ui', 'sans-serif'],
      sans: ['Satoshi', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Courier New', 'monospace'],
    },
    borderRadius: {
      none: '0px',
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px',
    },
    boxShadow: {
      'none': 'none',
      'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      'red': '4px 4px 0 #e63946',
      'red-hover': '2px 2px 0 #e63946',
      'focus-red': '0 0 0 3px rgba(230, 57, 70, .12)',
    },
    letterSpacing: {
      'tight-05': '-0.05em',
      'tight-06': '-0.06em',
      'tight-07': '-0.07em',
      'wide-08': '0.08em',
      'wide-09': '0.09em',
      'wide-10': '0.10em',
      'wide-11': '0.11em',
      'wide-12': '0.12em',
      'wide-14': '0.14em',
      'wide-15': '0.15em',
      'wide-16': '0.16em',
      'wide-18': '0.18em',
      'wide-20': '0.20em',
      'wide-22': '0.22em',
    },
  },
  plugins: [],
}
export default config
