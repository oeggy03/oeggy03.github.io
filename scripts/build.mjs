import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
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

const serverBundle = await import(pathToFileURL(resolve(root, 'node_modules/.cache/portfolio-prerender/entry-server.mjs')).href)
const { compatibilityPages, prerenderPages, render } = serverBundle
const dist = resolve(root, 'dist')
const htmlTemplate = await readFile(resolve(dist, 'index.html'), 'utf8')
const rootPlaceholder = '<main id="root"></main>'
if (!htmlTemplate.includes(rootPlaceholder)) {
  throw new Error('Cannot prerender: the React root placeholder is missing from index.html.')
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function applyMetadata(html, { title, description, canonicalUrl }) {
  const titleHtml = escapeHtml(title)
  const descriptionHtml = escapeHtml(description)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titleHtml}</title>`)
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${descriptionHtml}" />`)
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${titleHtml}" />`)
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${descriptionHtml}" />`)
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`)
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${titleHtml}" />`)
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${descriptionHtml}" />`)

  const schemaPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  const schemaMatch = html.match(schemaPattern)
  if (schemaMatch) {
    const schema = JSON.parse(schemaMatch[1])
    schema['@id'] = `${canonicalUrl}#profile`
    schema.url = canonicalUrl
    schema.name = title
    html = html.replace(schemaPattern, `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>`)
  }
  return html
}

for (const { route, project, metadata } of [...prerenderPages, ...compatibilityPages]) {
  const rendered = htmlTemplate.replace(rootPlaceholder, () => `<main id="root">${render(route)}</main>`)
  const pageHtml = applyMetadata(rendered, metadata)
  const outputPath = route.outputPath || route.path
  const relativeFile = outputPath === '/' ? 'index.html' : `${outputPath.slice(1)}index.html`
  const pagePath = resolve(dist, relativeFile)
  await mkdir(dirname(pagePath), { recursive: true })
  await writeFile(pagePath, pageHtml)
  console.log(`Prerendered ${outputPath}${project ? ` (${project.title})` : ''}${route.outputPath ? ' (legacy alias)' : ''}`)
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...prerenderPages.map(({ metadata }) => `  <url><loc>${metadata.canonicalUrl}</loc></url>`),
  '</urlset>',
].join('\n')
await writeFile(resolve(dist, 'sitemap.xml'), `${sitemap}\n`)

console.log(`Prerendered ${prerenderPages.length} static portfolio routes.`)
