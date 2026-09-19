import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(222.2 84% 4.9%)',
        foreground: 'hsl(210 40% 98%)',
        card: {
          DEFAULT: 'hsl(222.2 84% 4.9%)',
          foreground: 'hsl(210 40% 98%)',
        },
        primary: {
          DEFAULT: 'hsl(200 98% 61%)',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        secondary: {
          DEFAULT: 'hsl(217.2 32.6% 17.5%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(217.2 32.6% 17.5%)',
          foreground: 'hsl(215 20.2% 65.1%)',
        },
        accent: {
          DEFAULT: 'hsl(200 98% 61%)',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        border: 'hsl(240 5.9% 10%)',
        input: 'hsl(240 5.9% 10%)',
        ring: 'hsl(200 98% 61%)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
export default config
