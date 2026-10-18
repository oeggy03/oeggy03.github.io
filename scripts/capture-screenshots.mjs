import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'

const baseUrl = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173/'
const screenshotDirectory = resolve('docs/screenshots')
const socialPreviewPath = resolve('public/social-preview.png')
const socialOnly = process.argv.includes('--social-only')
const screenshotsOnly = process.argv.includes('--screenshots-only')
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

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    const images = [...document.images]
    for (const image of images) image.loading = 'eager'
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)))
    for (let frame = 0; frame < 4; frame += 1) await new Promise(requestAnimationFrame)
    await new Promise((resolve) => setTimeout(resolve, 120))
  })
  await page.mouse.move(-10, -10)
}

async function activateView(page, label) {
  await page.getByRole('tab', { name: label, exact: true }).click()
  await page.waitForFunction((expected) => document.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.includes(expected), label)
  await settle(page)
  const y = await page.evaluate(() => window.scrollY)
  assert.ok(y <= 2, `${label} should open at document Y=0 before screenshot capture, got ${y}`)
  const heading = page.getByRole('tabpanel').getByRole('heading').first()
  const bounds = await heading.boundingBox()
  assert.ok(bounds && bounds.y >= 0 && bounds.y < page.viewportSize().height, `${label} heading should be visible in the viewport`)
}

async function saveViewport(page, filename) {
  await settle(page)
  await page.screenshot({ path: resolve(screenshotDirectory, filename), fullPage: false })
  const layout = await page.evaluate(() => ({
    y: window.scrollY,
    height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
  }))
  console.log(`Captured ${filename} at ${page.viewportSize().width}×${page.viewportSize().height}; document height=${layout.height}px, Y=${layout.y}.`)
}

async function captureDesktopViews() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  await saveViewport(page, 'overview-desktop.png')

  for (const [label, filename] of [
    ['Projects', 'projects-desktop.png'],
    ['Experience', 'experience-desktop.png'],
    ['Skills', 'skills-desktop.png'],
    ['About', 'about-desktop.png'],
    ['Contact', 'contact-desktop.png'],
  ]) {
    await activateView(page, label)
    if (label === 'Projects') {
      await page.getByRole('navigation', { name: 'Choose a project' }).getByRole('button', { name: /FoROOM/i }).click()
      await settle(page)
      assert.equal(await page.getByRole('button', { name: /FoROOM/i }).getAttribute('aria-pressed'), 'true')
      assert.ok(await page.getByRole('link', { name: /View code/i }).isVisible(), 'FoROOM should show its primary code action')
    }
    await saveViewport(page, filename)
  }

  await activateView(page, 'Projects')
  await page.mouse.move(1400, 880)
  for (let step = 0; step < 40; step += 1) {
    const { y, max } = await page.evaluate(() => ({ y: window.scrollY, max: document.documentElement.scrollHeight - innerHeight }))
    if (y >= max - 2) break
    await page.mouse.wheel(0, 650)
    await page.waitForTimeout(35)
  }
  await saveViewport(page, 'projects-desktop-scrolled.png')
  await page.close()
}

async function captureMobileViews() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  await saveViewport(page, 'overview-mobile.png')
  await activateView(page, 'Projects')
  const chooser = page.getByRole('navigation', { name: 'Choose a project' })
  await chooser.getByRole('button', { name: /TeleAI/i }).click()
  await settle(page)
  const heading = page.locator('#project-teleai h2, #project-teleai h3').first()
  const nav = page.getByRole('navigation', { name: 'Portfolio sections' }).last()
  const [headingBounds, navBounds] = await Promise.all([heading.boundingBox(), nav.boundingBox()])
  assert.ok(headingBounds && navBounds && headingBounds.y >= navBounds.y + navBounds.height + 16, 'Selected project heading should clear the sticky mobile navigation')
  await assert.equal(new URL(page.url()).hash, '#project-teleai')
  await saveViewport(page, 'projects-mobile.png')
  await activateView(page, 'Skills')
  const skillsHeight = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight))
  console.log(`Layout Skills mobile 390×844: document height=${skillsHeight}px.`)
  await page.close()
}

async function captureKeyboardContact(viewport, filename) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  await page.goto(`${baseUrl}#skills`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  const skills = page.getByRole('navigation', { name: 'Portfolio sections' }).last().getByRole('tab', { name: 'Skills', exact: true })
  await skills.focus()
  await page.mouse.move(viewport.width - 24, viewport.height - 24)
  for (let step = 0; step < 40; step += 1) {
    const { y, max } = await page.evaluate(() => ({ y: window.scrollY, max: document.documentElement.scrollHeight - innerHeight }))
    if (y >= max - 2) break
    await page.mouse.wheel(0, 650)
    await page.waitForTimeout(35)
  }
  await skills.press('End')
  await page.waitForFunction(() => document.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.includes('Contact'))
  await settle(page)
  assert.ok((await page.evaluate(() => window.scrollY)) <= 2, 'End should navigate to Contact at document Y=0')
  const panel = page.getByRole('tabpanel')
  const emailAction = panel.getByRole('link', { name: 'Email me', exact: true })
  const emailBounds = await emailAction.boundingBox()
  assert.ok(emailBounds && emailBounds.y >= 0 && emailBounds.y + emailBounds.height <= viewport.height, 'The full primary email action should fit in the viewport after keyboard navigation')
  await saveViewport(page, filename)
  await page.close()
}

async function captureSocialPreview() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 756 }, deviceScaleFactor: 1 })
  await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  assert.ok((await page.evaluate(() => window.scrollY)) <= 2, 'Overview social preview should begin at document Y=0')
  const viewportImage = await page.screenshot({ fullPage: false })
  const resizedImage = await page.evaluate(async (base64) => {
    const image = new Image()
    image.src = `data:image/png;base64,${base64}`
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png').split(',')[1]
  }, viewportImage.toString('base64'))
  await writeFile(socialPreviewPath, Buffer.from(resizedImage, 'base64'))
  console.log('Captured public/social-preview.png at 1200×630 without browser chrome.')
  await page.close()
}

try {
  if (!screenshotsOnly) await captureSocialPreview()
  if (!socialOnly) {
    await captureDesktopViews()
    await captureMobileViews()
    await captureKeyboardContact({ width: 390, height: 600 }, 'after-contact-keyboard-mobile.png')
    await captureKeyboardContact({ width: 1024, height: 600 }, 'after-contact-keyboard-desktop.png')
  }
} finally {
  await browser.close()
}
