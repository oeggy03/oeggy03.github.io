/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--color-accent-ink) / <alpha-value>)',
        action: 'rgb(var(--color-action) / <alpha-value>)',
        'action-foreground': 'rgb(var(--color-action-foreground) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        sage: 'rgb(var(--color-surface) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [
    function portfolioColorTokens({ addBase }) {
      addBase({
        body: { overflowWrap: 'anywhere' },
        ':root': {
          colorScheme: 'light dark',
          '--color-canvas': '245 245 247',
          '--color-paper': '255 255 255',
          '--color-surface': '232 232 237',
          '--color-ink': '29 29 31',
          '--color-muted': '98 98 105',
          '--color-line': '210 210 215',
          '--color-accent': '0 102 204',
          '--color-accent-ink': '0 83 166',
          '--color-action': '0 83 166',
          '--color-action-foreground': '255 255 255',
        },
        '@media (prefers-color-scheme: dark)': {
          ':root': {
            '--color-canvas': '22 22 23',
            '--color-paper': '36 36 38',
            '--color-surface': '48 48 50',
            '--color-ink': '245 245 247',
            '--color-muted': '184 184 192',
            '--color-line': '85 85 92',
            '--color-accent': '121 184 255',
            '--color-accent-ink': '121 184 255',
            '--color-action': '0 83 166',
            '--color-action-foreground': '255 255 255',
          },
        },
        '@media (prefers-contrast: more)': {
          ':root': {
            '--color-muted': '74 74 80',
            '--color-line': '154 154 160',
            '--color-action': '0 71 142',
            '--color-action-foreground': '255 255 255',
          },
        },
        '@media (prefers-color-scheme: dark) and (prefers-contrast: more)': {
          ':root': {
            '--color-muted': '213 213 220',
            '--color-line': '148 148 156',
            '--color-action': '0 71 142',
            '--color-action-foreground': '255 255 255',
          },
        },
        '@media (forced-colors: active)': {
          'a:focus-visible': { outline: '2px solid Highlight', outlineOffset: '3px' },
          '[aria-current="page"]': { outline: '1px solid LinkText', outlineOffset: '2px' },
        },
      })
    },
  ],
}
