module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './modules/**/*.{ts,tsx,js,jsx}',
    './hooks/**/*.{ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        primary: {
          50: '#f5f7ff',
          100: '#e6edff',
          500: '#7c5cff'
        }
      }
    }
  },
  plugins: []
}
