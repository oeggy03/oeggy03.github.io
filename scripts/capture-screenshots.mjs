import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'

const baseUrl = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173/'
const screenshotDirectory = resolve('docs/screenshots')
const configuredBrowserPath = process.env.BROWSER_EXECUTABLE_PATH
const browserCandidates = process.platform === 'win32'
  ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ]
  : ['/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/microsoft-edge']
if (configuredBrowserPath && !existsSync(configuredBrowserPath)) {
  throw new Error(`BROWSER_EXECUTABLE_PATH does not exist: ${configuredBrowserPath}`)
}
const browserPath = configuredBrowserPath || browserCandidates.find((path) => existsSync(path))

await mkdir(screenshotDirectory, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  ...(browserPath ? { executablePath: browserPath } : {}),
})

async function captureView(page, view, label, filename, project = false) {
  const tab = page.getByRole('tab', { name: label, exact: true })
  await tab.click()
  await page.getByRole('tabpanel').waitFor({ state: 'visible' })
  if (project) {
    await page.getByRole('button', { name: /FoROOM/ }).click()
    await page.locator('#project-foroom').waitFor({ state: 'visible' })
  }
  await page.evaluate(async () => {
    const images = [...document.images]
    for (const image of images) image.loading = 'eager'
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)))
    await document.fonts.ready
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    window.scrollTo(0, 0)
  })
  await page.mouse.move(page.viewportSize().width - 2, page.viewportSize().height - 2)
  await page.evaluate(() => new Promise(requestAnimationFrame))
  const fullPage = filename.endsWith('-mobile.png') || ['projects-desktop.png', 'experience-desktop.png', 'skills-desktop.png'].includes(filename)
  await page.screenshot({ path: resolve(screenshotDirectory, filename), fullPage })
  console.log(`Captured ${view}: ${filename}`)
}

try {
  for (const { name, width, height, prefix, views } of [
    {
      name: 'desktop', width: 1440, height: 1000, prefix: 'desktop',
      views: [
        ['overview', 'Overview'], ['projects', 'Projects', true], ['experience', 'Experience'],
        ['skills', 'Skills'], ['about', 'About'], ['contact', 'Contact'],
      ],
    },
    {
      name: 'mobile', width: 390, height: 844, prefix: 'mobile',
      views: [['overview', 'Overview'], ['projects', 'Projects', true]],
    },
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.evaluate(async () => {
      await document.fonts.ready
      await new Promise(requestAnimationFrame)
      await new Promise(requestAnimationFrame)
    })
    for (const [view, label, project] of views) {
      await captureView(page, view, label, `${view}-${prefix}.png`, project)
    }
    await page.close()
    console.log(`Finished ${name} screenshots at ${width} × ${height}.`)
  }
} finally {
  await browser.close()
}
