import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { build } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
process.chdir(root)

// Render the same components as the browser, using production asset URLs.
await build()
await build({
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'node_modules/.cache/portfolio-prerender',
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
  },
})

const { render } = await import(pathToFileURL(resolve(root, 'node_modules/.cache/portfolio-prerender/entry-server.mjs')).href)
const htmlPath = resolve(root, 'dist/index.html')
const html = await readFile(htmlPath, 'utf8')
const placeholder = '<main id="root"></main>'
if (!html.includes(placeholder)) {
  throw new Error('Cannot prerender: the React root placeholder is missing from index.html.')
}
await writeFile(htmlPath, html.replace(placeholder, () => `<main id="root">${render()}</main>`))
console.log('Prerendered the portfolio into dist/index.html.')
