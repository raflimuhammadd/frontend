import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        /* Background & Surfaces (from nodew.css) */
        background: '#f4f5f6',
        'background-card': '#ffffff',
        'sidebar-bg': '#0f1419',
        'sidebar-border': '#252d35',
        
        /* Text Colors */
        'text-primary': '#111820',
        'text-secondary': '#7d8a99',
        'text-tertiary': '#aab4bd',
        'text-on-dark': '#e5e5e5',
        
        /* Brand Accent Colors */
        'brand-primary': '#0369a1',
        'brand-red': '#e63946',
        'brand-green': '#2a9d8f',
        'brand-orange': '#f4a261',
        
        /* Borders & Dividers */
        'border-light': '#cfd6dc',
        'border-medium': '#cbd5e1',
        'border-dark': '#252d35',
        
        /* Status Colors (Task States) */
        'status-todo': '#3b82f6',
        'status-in-progress': '#f97316',
        'status-done': '#059669',
        'status-blocked': '#dc2626',
        
        /* Interactive States */
        'hover-bg': '#f9fafb',
        'focus-ring': '#e63946',
        'shadow-color': '#e63946',
        
        /* Legacy mappings for compatibility */
        foreground: '#111820',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#111820',
        },
        primary: {
          DEFAULT: '#0369a1',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#7d8a99',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#e63946',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#aab4bd',
          foreground: '#7d8a99',
        },
        border: '#cfd6dc',
        input: '#ffffff',
        ring: '#e63946',
        success: '#2a9d8f',
        error: '#e63946',
        warning: '#f4a261',
        info: '#0284c7',
        
        // Task status colors (legacy)
        todo: '#3b82f6',
        'in-progress': '#f97316',
        done: '#059669',
        blocked: '#dc2626',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
        full: '9999px',
      },
      boxShadow: {
        'red': '4px 4px 0 #dc2626',
        'red-hover': '2px 2px 0 #dc2626',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.25)' },
          '50%': { boxShadow: '0 0 0 5px rgba(220, 38, 38, 0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
