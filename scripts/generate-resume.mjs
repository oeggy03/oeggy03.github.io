import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'

const root = fileURLToPath(new URL('../', import.meta.url))
const sourcePath = resolve(root, 'docs/resume.html')
const outputPath = resolve(root, 'src/assets/Resume_TranHaThu.pdf')
const previewPath = resolve(root, 'docs/screenshots/resume-preview.png')
const sourceHtml = readFileSync(sourcePath, 'utf8')
const sourceLinks = Array.from(sourceHtml.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi), (match) => match[1])
for (const href of sourceLinks) {
  const url = new URL(href)
  if (!['https:', 'mailto:'].includes(url.protocol)) {
    throw new Error(`Unsupported resume link: ${href}`)
  }
  if (url.protocol === 'https:' && !url.hostname) {
    throw new Error(`Resume link has no hostname: ${href}`)
  }
  if (url.protocol === 'mailto:' && !url.pathname.includes('@')) {
    throw new Error(`Resume email link is invalid: ${href}`)
  }
}
const browserPaths = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  chromium.executablePath(),
].filter(Boolean)
const executablePath = browserPaths.find((candidate) => existsSync(candidate))

const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
})

try {
  const sourcePage = await browser.newPage({ viewport: { width: 1440, height: 1600 }, deviceScaleFactor: 1 })
  await sourcePage.goto(pathToFileURL(sourcePath).href, { waitUntil: 'networkidle' })
  const pdf = await sourcePage.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  })
  const pageCount = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length
  if (pageCount !== 2) {
    throw new Error(`Expected a two-page resume, found ${pageCount} pages.`)
  }
  const pdfContents = pdf.toString('latin1')
  const linkCount = (pdfContents.match(/\/Subtype\s*\/Link\b/g) || []).length
  const pdfLinks = Array.from(pdfContents.matchAll(/\/URI\s*\(([^)]*)\)/g), (match) => match[1])
  const missingLinks = sourceLinks.filter((href) => !pdfLinks.includes(href))
  if (linkCount !== sourceLinks.length || missingLinks.length > 0) {
    throw new Error(`PDF link check failed: ${linkCount} clickable annotations, ${sourceLinks.length} source links, ${missingLinks.length} missing destinations.`)
  }

  const pdfPage = await browser.newPage({ viewport: { width: 1350, height: 1500 }, deviceScaleFactor: 2 })
  await pdfPage.goto(`${pathToFileURL(outputPath).href}#page=1&zoom=50`, { waitUntil: 'domcontentloaded' })
  await pdfPage.waitForTimeout(1000)
  await pdfPage.screenshot({ path: previewPath })

  console.log(`Generated ${outputPath}`)
  console.log(`PDF pages: ${pageCount || 'unable to inspect automatically'}`)
  console.log(`Clickable links: ${linkCount} / ${sourceLinks.length} source URLs verified`)
  console.log(`PDF viewer preview: ${previewPath}`)
  console.log(`Chromium executable: ${executablePath || 'Playwright default'}`)
} finally {
  await browser.close()
}
