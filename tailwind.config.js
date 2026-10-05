/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        textMain: 'var(--color-text)',
        textMuted: 'var(--color-text-muted)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
