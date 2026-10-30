import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'

const baseUrl = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173/'
const screenshotDirectory = resolve('docs/screenshots')
const reviewDirectory = resolve('node_modules/.cache/clean-route-qa-review')
const socialPreviewPath = resolve('public/social-preview.png')
const args = new Set(process.argv.slice(2))
const socialOnly = args.has('--social-only')
const screenshotsOnly = args.has('--screenshots-only')
const reviewOnly = args.has('--review-only') || args.has('--overview-review')
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
if (reviewOnly) await mkdir(reviewDirectory, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  ...(browserPath ? { executablePath: browserPath } : {}),
})

function urlFor(path) {
  return new URL(path, baseUrl).href
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready
    const images = [...document.images]
    for (const image of images) image.loading = 'eager'
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)))
    const content = document.getElementById('portfolio-content')
    const activeAnimations = content?.getAnimations().filter((animation) => animation.playState === 'running') || []
    await Promise.all(activeAnimations.map((animation) => animation.finished.catch(() => undefined)))
    for (let frame = 0; frame < 4; frame += 1) await new Promise(requestAnimationFrame)
    await new Promise((resolve) => setTimeout(resolve, 120))
  })
  await page.mouse.move(-10, -10)
}

async function openRoute(page, path) {
  await page.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
  await settle(page)
  await assert.equal(new URL(page.url()).pathname, path, `${path} should be loaded as a clean route.`)
  await assert.equal(new URL(page.url()).hash, '', `${path} should not retain an authored hash.`)
}

async function activateSection(page, path) {
  const link = page.locator(`nav[aria-label="Portfolio sections"]:visible a[href="${path}"]`)
  await assert.equal(await link.count(), 1, `Section route ${path} should have one visible real link.`)
  await link.click()
  await page.waitForFunction((expected) => window.location.pathname === expected && window.location.hash === '', path)
  await settle(page)
  const y = await page.evaluate(() => window.scrollY)
  await assert.ok(y <= 2, `${path} should open at document Y=0 for capture, got ${y}.`)
  const current = page.locator(`nav[aria-label="Portfolio sections"]:visible a[href="${path}"]`)
  await assert.equal(await current.getAttribute('aria-current'), 'page')
}

async function saveViewport(page, filename, directory = screenshotDirectory) {
  await settle(page)
  const path = resolve(directory, filename)
  await page.screenshot({ path, fullPage: false })
  const metrics = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    y: window.scrollY,
    documentHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
  }))
  console.log(`Captured ${filename} at ${metrics.width}×${metrics.height}; document height=${metrics.documentHeight}px, Y=${metrics.y}.`)
  return metrics
}

async function scrollToExperience(page, viewportLabel) {
  const experience = page.locator('#work-history')
  await assert.equal(await experience.count(), 1, 'The Experience landing should contain its work-history section.')
  const details = experience.locator('details')
  if (!await details.evaluate((element) => element.open)) await details.locator('summary').click()
  await assert.equal(await details.evaluate((element) => element.open), true, `${viewportLabel} expanded experience capture should open earlier roles.`)
  await assert.equal(await experience.locator('[data-experience-id]').count(), 8, `${viewportLabel} expanded experience capture should include all roles.`)
  await experience.evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await settle(page)
  const bounds = await page.evaluate(() => ({
    section: document.querySelector('#work-history').getBoundingClientRect(),
    header: document.querySelector('[data-portfolio-toolbar]').getBoundingClientRect(),
    scrollY: window.scrollY,
  }))
  await assert.equal(new URL(page.url()).pathname, '/', 'The work-history captures should stay on the Experience landing.')
  await assert.equal(new URL(page.url()).hash, '', 'The experience captures should not introduce a route hash.')
  await assert.ok(bounds.scrollY > 0, `${viewportLabel} should scroll naturally to the experience timeline.`)
  await assert.ok(bounds.section.top >= bounds.header.bottom, `${viewportLabel} experience heading should clear the complete sticky header.`)
  return experience
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

async function captureReviewSet() {
  for (const viewport of [
    { label: 'desktop', width: 1440, height: 900, mobile: false },
    { label: 'mobile', width: 390, height: 844, mobile: true },
  ]) {
    for (const [routeName, routePath] of [['overview', '/'], ['projects', '/projects/'], ['skills', '/skills/']]) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        ...(viewport.mobile ? { isMobile: true, hasTouch: true } : {}),
      })
      await openRoute(page, routePath)
      const basename = `${routeName}-${viewport.label}`
      const metrics = await saveViewport(page, `${basename}.png`, reviewDirectory)
      if (viewport.mobile || routeName === 'overview') {
        await page.screenshot({ path: resolve(reviewDirectory, `${basename}-document.png`), fullPage: true })
        console.log(`Captured ${basename}-document.png at full document height ${metrics.documentHeight}px.`)
      }
      await page.close()
    }
  }
}

async function captureDesktopViews() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  await openRoute(page, '/')
  await saveViewport(page, 'overview-desktop.png')
  const overviewDesktopHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  await page.screenshot({ path: resolve(screenshotDirectory, 'overview-desktop-document.png'), fullPage: true })
  console.log(`Captured overview-desktop-document.png at full document height ${overviewDesktopHeight}px.`)

  await scrollToExperience(page, 'Desktop')
  await saveViewport(page, 'experience-desktop.png')

  await page.emulateMedia({ colorScheme: 'dark' })
  await openRoute(page, '/')
  await saveViewport(page, 'overview-dark-desktop.png')
  await page.emulateMedia({ colorScheme: 'light' })
  await openRoute(page, '/')

  await activateSection(page, '/projects/')
  const projectIndex = page.locator('#projects [data-project-index]')
  await assert.equal(await projectIndex.locator('a[href^="/projects/"]').count(), 8, 'Projects index should show all eight project cards.')
  await assert.equal(await page.getByRole('group', { name: 'Filter projects' }).getByRole('button').count(), 4)
  await saveViewport(page, 'projects-desktop.png')

  await activateSection(page, '/skills/')
  await saveViewport(page, 'skills-desktop.png')

  await activateSection(page, '/projects/')
  const scrolledY = await scrollNaturallyToBottom(page)
  await assert.ok(scrolledY > 0, 'The Projects capture should retain a real reading offset.')
  await saveViewport(page, 'projects-desktop-scrolled.png')
  await page.close()

  const casePage = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  for (const [project, basename] of [['openclaw', 'openclaw'], ['chinese-learning', 'chinese-learning']]) {
    await openRoute(casePage, `/projects/${project}/`)
    await assert.equal(await casePage.locator(`#project-heading-${project}`).isVisible(), true)
    await saveViewport(casePage, `${basename}-desktop.png`)
    await casePage.screenshot({ path: resolve(screenshotDirectory, `${basename}-desktop-document.png`), fullPage: true })
    console.log(`Captured ${basename}-desktop-document.png at full project-story height.`)
  }
  await casePage.close()
}

async function captureMobileViews() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await openRoute(page, '/')
  const overviewMetrics = await saveViewport(page, 'overview-mobile.png')
  await page.screenshot({ path: resolve(screenshotDirectory, 'overview-mobile-document.png'), fullPage: true })
  console.log(`Captured overview-mobile-document.png at natural document height ${overviewMetrics.documentHeight}px.`)

  const experience = await scrollToExperience(page, 'Mobile')
  await saveViewport(page, 'experience-mobile.png')
  await experience.screenshot({ path: resolve(screenshotDirectory, 'experience-mobile-document.png') })
  console.log('Captured experience-mobile-document.png from the expanded work-history section.')

  await page.emulateMedia({ colorScheme: 'dark' })
  await openRoute(page, '/')
  await saveViewport(page, 'overview-dark-mobile.png')
  await page.emulateMedia({ colorScheme: 'light' })

  await openRoute(page, '/skills/')
  await saveViewport(page, 'skills-mobile.png')

  await openRoute(page, '/projects/teleai/')
  const chooser = page.getByRole('navigation', { name: 'Choose a project' })
  const teleAi = chooser.getByRole('link', { name: /TeleAI/i })
  await assert.equal(await teleAi.getAttribute('href'), '/projects/teleai/')
  await assert.equal(await page.locator('#project-heading-teleai').isVisible(), true)
  const nav = page.locator('[data-portfolio-mobile-navigation]')
  const [headingBounds, navBounds] = await Promise.all([
    page.locator('#project-heading-teleai').boundingBox(),
    nav.boundingBox(),
  ])
  await assert.ok(headingBounds && navBounds && headingBounds.y >= navBounds.y + navBounds.height + 16, 'The selected project heading should clear mobile sticky navigation.')
  await saveViewport(page, 'projects-mobile.png')
  await openRoute(page, '/projects/openclaw/')
  await saveViewport(page, 'openclaw-mobile.png')
  await openRoute(page, '/projects/chinese-learning/')
  await saveViewport(page, 'chinese-learning-mobile.png')
  await page.close()

  const proofPage = await browser.newPage({ viewport: { width: 320, height: 568 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await openRoute(proofPage, '/projects/teleai/')
  const scrolledY = await scrollNaturallyToBottom(proofPage)
  await assert.ok(scrolledY > 0, `The narrow mobile social proof should capture a naturally scrolled project, got Y=${scrolledY}.`)
  const group = proofPage.getByRole('group', { name: 'Contact and social links' })
  await assert.ok(await group.isVisible(), 'The mobile contact/social row should remain visible while reading the project.')
  for (const [name, href] of [
    ['Email Tran Ha Thu', 'mailto:tranhathuwork@gmail.com'],
    ['Tran Ha Thu on GitHub', 'https://github.com/oeggy03'],
    ['Tran Ha Thu on LinkedIn', 'https://www.linkedin.com/in/tran-ha-thu/'],
  ]) {
    const link = group.getByRole('link', { name, exact: true })
    await assert.equal(await link.getAttribute('href'), href, `${name} destination should be preserved.`)
    const bounds = await link.boundingBox()
    await assert.ok(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 568 && bounds.width >= 44 && bounds.height >= 44, `${name} should remain a visible 44px target after scrolling.`)
  }
  await saveViewport(proofPage, 'mobile-social-links-scrolled.png')
  await proofPage.close()
}

async function captureSocialPreview() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 756 }, deviceScaleFactor: 1 })
  await openRoute(page, '/')
  await assert.ok((await page.evaluate(() => window.scrollY)) <= 2, 'Experience social preview should begin at document Y=0.')
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
  if (reviewOnly) {
    await captureReviewSet()
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
