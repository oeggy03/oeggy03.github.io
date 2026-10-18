import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'

const baseUrl = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173/'
const screenshotDirectory = resolve('docs/screenshots')
const reviewDirectory = resolve('node_modules/.cache/four-view-qa-review')
const socialPreviewPath = resolve('public/social-preview.png')
const socialOnly = process.argv.includes('--social-only')
const screenshotsOnly = process.argv.includes('--screenshots-only')
const overviewReview = process.argv.includes('--overview-review')
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
if (overviewReview) await mkdir(reviewDirectory, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  ...(browserPath ? { executablePath: browserPath } : {}),
})

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready
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

async function saveViewport(page, filename, directory = screenshotDirectory) {
  await settle(page)
  await page.screenshot({ path: resolve(directory, filename), fullPage: false })
  const layout = await page.evaluate(() => ({
    y: window.scrollY,
    height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
  }))
  console.log(`Captured ${filename} at ${page.viewportSize().width}×${page.viewportSize().height}; document height=${layout.height}px, Y=${layout.y}.`)
  return layout
}

async function scrollNaturallyToBottom(page) {
  const viewport = page.viewportSize()
  await page.mouse.move(Math.max(1, viewport.width - 24), Math.max(1, viewport.height - 24))
  for (let step = 0; step < 40; step += 1) {
    const { y, max } = await page.evaluate(() => ({
      y: document.scrollingElement.scrollTop,
      max: document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight,
    }))
    if (y >= max - 2) break
    await page.mouse.wheel(0, 650)
    await page.waitForTimeout(35)
  }
  await page.waitForTimeout(100)
  return page.evaluate(() => document.scrollingElement.scrollTop)
}

async function captureOverviewReview() {
  const captures = [
    { name: 'overview-desktop.png', viewport: { width: 1440, height: 900 } },
    { name: 'overview-mobile.png', viewport: { width: 390, height: 844 }, fullPageName: 'overview-mobile-document.png' },
  ]
  for (const capture of captures) {
    const page = await browser.newPage({ viewport: capture.viewport, deviceScaleFactor: 1, ...(capture.fullPageName ? { isMobile: true, hasTouch: true } : {}) })
    await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
    await settle(page)
    const y = await page.evaluate(() => window.scrollY)
    assert.ok(y <= 2, 'Overview review capture should begin at natural document Y=0')
    await saveViewport(page, capture.name, reviewDirectory)
    if (capture.fullPageName) {
      await page.screenshot({ path: resolve(reviewDirectory, capture.fullPageName), fullPage: true })
      const facts = await page.evaluate(() => {
        const overview = document.querySelector('#overview')
        const rectFor = (element) => {
          if (!element) return null
          const rect = element.getBoundingClientRect()
          return { top: Math.round(rect.top + window.scrollY), bottom: Math.round(rect.bottom + window.scrollY) }
        }
        const exactText = (selector, value) => [...overview.querySelectorAll(selector)].find((element) => element.textContent.trim() === value)
        return {
          documentHeight: document.documentElement.scrollHeight,
          overviewHeight: Math.round(overview.getBoundingClientRect().height),
          interests: rectFor(exactText('p', 'Interests')?.parentElement),
          education: rectFor(overview.querySelector('a[href="https://nus.edu.sg/"]')),
          currentRole: rectFor(overview.querySelector('a[href="https://www.hdb.gov.sg/cs/infoweb/homepage"]')),
        }
      })
      console.log(`Mobile Overview layout metrics (${capture.viewport.width}×${capture.viewport.height}): ${JSON.stringify(facts)}`)
    }
    await page.close()
  }
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
  ]) {
    await activateView(page, label)
    if (label === 'Projects') {
      const chooser = page.getByRole('navigation', { name: 'Choose a project' })
      await chooser.getByRole('button', { name: /FoROOM/i }).click()
      await settle(page)
      assert.equal(await chooser.getByRole('button', { name: /FoROOM/i }).getAttribute('aria-pressed'), 'true')
      assert.ok(await page.getByRole('link', { name: /View code/i }).isVisible(), 'FoROOM should show its primary code action')
    }
    await saveViewport(page, filename)
  }

  await activateView(page, 'Projects')
  await page.mouse.move(1400, 880)
  const scrolledY = await scrollNaturallyToBottom(page)
  assert.ok(scrolledY > 0, 'The scrolled Projects screenshot should retain a real reading offset')
  await saveViewport(page, 'projects-desktop-scrolled.png')
  await page.close()
}

async function captureMobileViews() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  const overviewLayout = await saveViewport(page, 'overview-mobile.png')
  await page.screenshot({ path: resolve(screenshotDirectory, 'overview-mobile-document.png'), fullPage: true })
  console.log(`Captured overview-mobile-document.png at natural document height ${overviewLayout.height}px.`)

  await activateView(page, 'Projects')
  const chooser = page.getByRole('navigation', { name: 'Choose a project' })
  await chooser.getByRole('button', { name: /TeleAI/i }).click()
  await settle(page)
  const heading = page.locator('#project-teleai h2, #project-teleai h3').first()
  const nav = page.getByRole('navigation', { name: 'Portfolio sections' }).last()
  const [headingBounds, navBounds] = await Promise.all([heading.boundingBox(), nav.boundingBox()])
  assert.ok(headingBounds && navBounds && headingBounds.y >= navBounds.y + navBounds.height + 16, 'Selected project heading should clear the sticky mobile navigation')
  assert.equal(new URL(page.url()).hash, '#project-teleai')
  await saveViewport(page, 'projects-mobile.png')
  await page.close()

  const proofPage = await browser.newPage({ viewport: { width: 320, height: 568 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await proofPage.goto(`${baseUrl}#project-teleai`, { waitUntil: 'domcontentloaded' })
  await proofPage.waitForFunction(() => document.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.includes('Projects'))
  await settle(proofPage)
  assert.equal(await proofPage.getByRole('button', { name: /TeleAI/i }).getAttribute('aria-pressed'), 'true')
  const scrolledY = await scrollNaturallyToBottom(proofPage)
  assert.ok(scrolledY > 0, `The narrow mobile social proof should capture a naturally scrolled project, got Y=${scrolledY}`)
  const group = proofPage.getByRole('group', { name: 'Contact and social links' })
  assert.ok(await group.isVisible(), 'The mobile contact/social row should remain visible while reading the project')
  for (const [name, href] of [
    ['Email Tran Ha Thu', 'mailto:tranhathu@u.nus.edu'],
    ['Tran Ha Thu on GitHub', 'https://github.com/oeggy03'],
    ['Tran Ha Thu on LinkedIn', 'https://www.linkedin.com/in/tran-ha-thu/'],
  ]) {
    const link = group.getByRole('link', { name, exact: true })
    assert.equal(await link.getAttribute('href'), href, `${name} destination should be preserved`)
    const bounds = await link.boundingBox()
    assert.ok(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 568 && bounds.width >= 44 && bounds.height >= 44, `${name} should remain a visible 44px target after scrolling`)
  }
  await saveViewport(proofPage, 'mobile-social-links-scrolled.png')
  await proofPage.close()
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
  if (overviewReview) {
    await captureOverviewReview()
  } else {
    if (!screenshotsOnly) await captureSocialPreview()
    if (!socialOnly) {
      await captureDesktopViews()
      await captureMobileViews()
    }
  }
} finally {
  await browser.close()
}
