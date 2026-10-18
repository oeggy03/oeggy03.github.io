/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F3ED',
        ink: '#172124',
        paper: '#FFFEFA',
        muted: '#606B6B',
        line: '#DCDDD4',
        accent: '#C84B23',
        'accent-ink': '#A43A18',
        sage: '#DCE6DD',
      },
      fontFamily: {
        sans: ['Manrope Variable', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
