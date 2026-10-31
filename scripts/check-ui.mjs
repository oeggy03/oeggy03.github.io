import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { portfolioCompatibilityRoutePaths, portfolioRoutePaths, resolvePortfolioRoute } from '../src/navigation/routes.js'

const baseUrl = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173/'
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
const origin = new URL(baseUrl).origin
const sectionPaths = {
  Experience: '/', Projects: '/projects/', Skills: '/skills/',
}
const terminalIndexAliases = portfolioRoutePaths.map((route) => ({
  alias: route === '/' ? '/index.html' : `${route}index.html`,
  route,
}))
const compatibilityRoutePaths = new Map([
  ['/experience/', '/'],
  ['/projects/openclaw/', '/openclaw_agent/info/'],
  ['/projects/chinese-learning/', '/call_analyzer_chinese_learning/info/'],
  ['/projects/openclaw_agent/', '/openclaw_agent/'],
  ['/projects/call_analyzer_chinese_learning/', '/call_analyzer_chinese_learning/'],
  ['/projects/traders_edge/', '/traders_edge/'],
])
const compatibilityIndexAliases = portfolioCompatibilityRoutePaths.map((alias) => ({
  alias: `${alias}index.html`, route: compatibilityRoutePaths.get(alias),
}))
const compatibilityAliases = [
  ...portfolioCompatibilityRoutePaths.map((alias) => ({ alias, route: compatibilityRoutePaths.get(alias) })),
  ...compatibilityIndexAliases,
]
const projectNames = ['FoROOM', 'Buddy4Good', 'Eggbot', 'TeleAI', 'FoodHero', 'Portfolio Website', 'My OpenClaw Lab', 'Chinese Learning Toolkit', 'Trader’s Edge']
const projectIds = {
  FoROOM: 'foroom', Buddy4Good: 'buddy4good', Eggbot: 'eggbot',
  TeleAI: 'teleai', FoodHero: 'foodhero', 'Portfolio Website': 'portfolio',
  'My OpenClaw Lab': 'openclaw', 'Chinese Learning Toolkit': 'chinese-learning', 'Trader’s Edge': 'traders-edge',
}
const projectPaths = {
  foroom: '/projects/foroom/',
  buddy4good: '/projects/buddy4good/',
  eggbot: '/projects/eggbot/',
  teleai: '/projects/teleai/',
  foodhero: '/projects/foodhero/',
  portfolio: '/projects/portfolio/',
  openclaw: '/openclaw_agent/',
  'chinese-learning': '/call_analyzer_chinese_learning/',
  'traders-edge': '/traders_edge/',
}
const projectInfoPaths = {
  openclaw: '/openclaw_agent/info/',
  'chinese-learning': '/call_analyzer_chinese_learning/info/',
  'traders-edge': '/traders_edge/info/',
}
const caseStudySynopses = {
  openclaw: 'A personal agent lab for connecting real tools and building an assistant that remembers useful context about how I work.',
  'chinese-learning': 'A local-first Chinese vocabulary workflow that turns reviewed lesson words into a daily Telegram recall message.',
  'traders-edge': 'A trading education game where learners practice market orders, read price signals and test strategies in guided, historical and multiplayer scenarios.',
}
const expectedExperienceIds = ['tiktok-backend', 'tiktok-intern', 'nus-ta', 'gic', 'uptale', 'hdb', 'eastspring', 'astar']
const expectedExperienceDates = [
  'Jul 2026 - Present',
  'Jan 2026 - Mar 2026',
  'Aug 2023 - Dec 2025',
  'Jun 2025 - Sep 2025',
  'Jan 2025 - Jun 2025',
  'May 2024 - Aug 2024',
  'May 2023 - Aug 2023',
  'Dec 2019 - Jan 2020',
]
const expectedExperienceDateTimes = [
  ['2026-07'],
  ['2026-01', '2026-03'],
  ['2023-08', '2025-12'],
  ['2025-06', '2025-09'],
  ['2025-01', '2025-06'],
  ['2024-05', '2024-08'],
  ['2023-05', '2023-08'],
  ['2019-12', '2020-01'],
]
function experienceDateRanges(text) {
  return [...text.matchAll(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(?:to\s+)?(?:Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/g)]
    .map((match) => match[0].replace(/\s+to\s+/gi, ' ').replace(/\s+/g, ' ').replace(/[–—]/g, '-').replace(/\s*-\s*/g, ' - '))
}
const experiences = [
  'GIC',
  'Uptale',
  'National University of Singapore',
  'Housing Development Board (HDB)',
  'Eastspring Investments',
  'A*STAR - Agency for Science, Technology and Research',
]
const skills = [
  'Git', 'Object-oriented programming', 'HTML', 'CSS', 'JavaScript', 'React', 'Go',
  'Express.js', 'MySQL', 'PostgreSQL', 'Microsoft SQL Server', 'Java', 'Python', 'C++',
  'JWT', 'bcrypt', 'SQLite', 'Pandas', 'OpenCV', 'TensorFlow', 'Keras', 'JavaFX',
]
const legacyRoutes = {
  homepage: '/',
  overview: '/',
  about: '/',
  aboutSection: '/',
  contact: '/',
  contactSec: '/',
  experience: '/',
  experiencesSec: '/',
  projectsSec: '/projects/',
  skills: '/skills/',
  'project-teleai': '/projects/teleai/',
}
const projectOutboundLinks = [
  'https://devpost.com/software/foroom',
  'https://github.com/oeggy03/cvwo-frontend',
  'https://github.com/oeggy03/cvwo-backend',
  'https://oeggy03.github.io/h4g-frontend/',
  'https://devpost.com/software/buddy4good',
  'https://github.com/oeggy03/h4g-frontend',
  'https://github.com/oeggy03/h4g-backend',
  'https://github.com/oeggy03/ip/releases/tag/A-Release',
  'https://oeggy03.github.io/ip/',
  'https://github.com/oeggy03/ip',
  'https://oeggy03.github.io/TeleAI/',
  'https://github.com/oeggy03/TeleAI',
  'https://oeggy03.github.io/FoodHeroBot/',
  'https://devpost.com/software/kalilinux',
  'https://github.com/oeggy03/FoodHeroBot',
  'https://github.com/oeggy03/oeggy03.github.io',
]
const projectOutboundLinksById = {
  foroom: projectOutboundLinks.slice(0, 3),
  buddy4good: projectOutboundLinks.slice(3, 7),
  eggbot: projectOutboundLinks.slice(7, 10),
  teleai: projectOutboundLinks.slice(10, 12),
  foodhero: projectOutboundLinks.slice(12, 15),
  portfolio: projectOutboundLinks.slice(15, 16),
  openclaw: [
    'https://docs.openclaw.ai/',
    'https://developers.openai.com/api/docs/',
    'https://github.com/microsoft/playwright-mcp',
    'https://github.com/CortexReach/memory-lancedb-pro',
    'https://developers.openai.com/api/docs/guides/decisions',
  ],
  'chinese-learning': [
    'https://github.com/oeggy03/call_analyzer',
    'https://github.com/oeggy03/call_analyzer_lesson_db',
    'https://github.com/oeggy03/call_analyzer_active_recall',
  ],
  'traders-edge': ['https://github.com/Traders-Edge/traders_edge'],
}
const experienceOutboundLinks = [
  'https://www.tiktok.com/',
  'https://nus.edu.sg/',
  'https://www.gic.com.sg/',
  'https://www.uptale.io/en/',
  'https://www.hdb.gov.sg/cs/infoweb/homepage',
  'https://www.eastspring.com/sg',
  'https://www.a-star.edu.sg/',
]
const failures = []
const consoleErrors = []
const pageErrors = []
const internalRequestFailures = []
const externalRequestFailures = new Set()

async function assertEmailToastLayout(page, label, { maxHeight, maxTopInset = 24 } = {}) {
  const toast = page.locator('[data-copy-email-toast]')
  await assert.ok(await toast.isVisible(), `${label} toast should be visible.`)
  const layout = await toast.evaluate((element) => {
    const message = element.querySelector('[data-copy-email-message]')
    const dismiss = element.querySelector('button[aria-label="Dismiss email copy message"]')
    const range = document.createRange()
    range.selectNodeContents(message)
    const firstLine = [...range.getClientRects()]
      .filter((rect) => rect.width > 0 && rect.height > 0)
      .sort((first, second) => first.top - second.top || first.left - second.left)[0]
    const style = getComputedStyle(element)
    const channels = (color) => color.match(/[\d.]+/g).slice(0, 3).map(Number).map((value) => {
      const normalized = value / 255
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
    })
    const [foregroundR, foregroundG, foregroundB] = channels(style.color)
    const [backgroundR, backgroundG, backgroundB] = channels(style.backgroundColor)
    const foregroundLuminance = 0.2126 * foregroundR + 0.7152 * foregroundG + 0.0722 * foregroundB
    const backgroundLuminance = 0.2126 * backgroundR + 0.7152 * backgroundG + 0.0722 * backgroundB
    const contrast = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
    const rect = (node) => {
      const { x, y, width, height, right, bottom } = node.getBoundingClientRect()
      return { x, y, width, height, right, bottom }
    }
    return {
      toast: rect(element),
      message: rect(message),
      dismiss: rect(dismiss),
      firstLine: firstLine ? { left: firstLine.left, right: firstLine.right, top: firstLine.top, bottom: firstLine.bottom } : null,
      foreground: style.color,
      background: style.backgroundColor,
      contrast,
    }
  })
  const viewport = page.viewportSize()
  await assert.ok(layout.firstLine, `${label} toast should expose a measurable message line.`)
  await assert.ok(layout.toast.x >= 0 && layout.toast.y >= 0 && layout.toast.right <= viewport.width + 1 && layout.toast.bottom <= viewport.height + 1, `${label} toast should fit in the viewport: ${JSON.stringify(layout.toast)}.`)
  await assert.ok(layout.dismiss.width >= 44 && layout.dismiss.height >= 44, `${label} dismiss control should retain a 44px touch target.`)
  await assert.ok(layout.contrast >= 4.5, `${label} toast text should retain 4.5:1 contrast, received ${layout.contrast.toFixed(2)}:1 (${layout.foreground} on ${layout.background}).`)
  await assert.ok(Math.abs(layout.firstLine.top - layout.dismiss.y) <= 20, `${label} message and dismiss control should share the first row: ${JSON.stringify(layout)}.`)
  await assert.ok(layout.firstLine.right <= layout.dismiss.x + 1, `${label} first message row should not overlap the dismiss control: ${JSON.stringify(layout)}.`)
  await assert.ok(layout.firstLine.top - layout.toast.y >= 8 && layout.firstLine.top - layout.toast.y <= maxTopInset, `${label} message should have modest top padding without a blank row: ${JSON.stringify(layout)}.`)
  if (maxHeight) await assert.ok(layout.toast.height <= maxHeight, `${label} toast should remain compact at ${maxHeight}px or less, received ${layout.toast.height}px.`)
  return layout
}

function urlFor(path) {
  return new URL(path, baseUrl).href
}

function check(name, work) {
  return work().then(() => console.log(`PASS ${name}`)).catch((error) => {
    failures.push({ name, error })
    console.error(`FAIL ${name}: ${error.message}`)
    if (process.env.QA_DEBUG_STACKS) console.error(error.stack)
  })
}

function trackPage(page) {
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('requestfailed', (request) => {
    if (new URL(request.url()).origin === origin) {
      internalRequestFailures.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText || 'request failed'}`)
    } else {
      externalRequestFailures.add(`${request.url()}: ${request.failure()?.errorText || 'request failed'}`)
    }
  })
  page.on('response', (response) => {
    if (response.status() < 400) return
    const url = response.url()
    if (new URL(url).origin === origin) internalRequestFailures.push(`${response.status()} ${url}`)
    else externalRequestFailures.add(`${response.status()} ${url}`)
  })
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready
    const content = document.getElementById('portfolio-content')
    const activeAnimations = content?.getAnimations().filter((animation) => animation.playState === 'running') || []
    await Promise.all(activeAnimations.map((animation) => animation.finished.catch(() => undefined)))
    for (let frame = 0; frame < 4; frame += 1) await new Promise(requestAnimationFrame)
    await new Promise((resolve) => setTimeout(resolve, 100))
  })
  await waitForStableScroll(page)
}

async function installRouteFadeProbe(page) {
  await page.evaluate(() => {
    window.__portfolioRouteFades = []
    const originalAnimate = Element.prototype.animate
    Element.prototype.animate = function trackPortfolioFade(keyframes, options) {
      const animation = originalAnimate.call(this, keyframes, options)
      if (this.id === 'portfolio-content') {
        const frames = animation.effect?.getKeyframes() || keyframes
        window.__portfolioRouteFades.push({
          fromOpacity: Number(frames[0]?.opacity),
          toOpacity: Number(frames.at(-1)?.opacity),
          duration: animation.effect?.getTiming().duration,
        })
      }
      return animation
    }
  })
}

async function waitForStableScroll(page, { stableFrames = 4, maxFrames = 240 } = {}) {
  return page.evaluate(({ requiredStableFrames, maximumFrames }) => new Promise((resolve, reject) => {
    let previousY = window.scrollY
    let stableFrameCount = 0
    let frameCount = 0
    const inspect = () => {
      const currentY = window.scrollY
      stableFrameCount = Math.abs(currentY - previousY) < 0.5 ? stableFrameCount + 1 : 0
      previousY = currentY
      frameCount += 1
      if (stableFrameCount >= requiredStableFrames) {
        resolve(currentY)
      } else if (frameCount >= maximumFrames) {
        reject(new Error(`Scroll did not settle after ${maximumFrames} animation frames.`))
      } else {
        requestAnimationFrame(inspect)
      }
    }
    requestAnimationFrame(inspect)
  }), { requiredStableFrames: stableFrames, maximumFrames: maxFrames })
}

async function waitForScrollProgress(page, startingY) {
  await page.waitForFunction((previousY) => Math.abs(window.scrollY - previousY) > 1, startingY, { timeout: 4000 })
  return page.evaluate(() => window.scrollY)
}

function activeSection(page, sectionId) {
  return page.locator(`main section#${sectionId}:not([hidden])`)
}

function navLinks(page) {
  return page.locator('nav[aria-label="Portfolio sections"]:visible a[href]')
}

async function renderedVisibleText(locator) {
  return locator.evaluate((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    const visible = []
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (!node.textContent.trim()) continue
      let current = node.parentElement
      let hidden = false
      while (current && current !== element.parentElement) {
        if (current.matches('.sr-only, [aria-hidden="true"]')) {
          hidden = true
          break
        }
        const style = getComputedStyle(current)
        if (style.display === 'none' || style.visibility === 'hidden') {
          hidden = true
          break
        }
        current = current.parentElement
      }
      if (hidden) continue
      range.selectNodeContents(node)
      if ([...range.getClientRects()].some((rect) => rect.width > 0 && rect.height > 0)) visible.push(node.textContent.trim())
    }
    return visible.join(' ').replace(/\s+/g, ' ').trim()
  })
}

async function assertWholeWords(locator, phrase, label) {
  const splitWords = await locator.evaluate((element, phraseToFind) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    while (walker.nextNode()) {
      const node = walker.currentNode
      const phraseStart = node.textContent.indexOf(phraseToFind)
      if (phraseStart < 0) continue
      const phrase = node.textContent.slice(phraseStart, phraseStart + phraseToFind.length)
      const split = []
      for (const word of phrase.matchAll(/\S+/g)) {
        range.setStart(node, phraseStart + word.index)
        range.setEnd(node, phraseStart + word.index + word[0].length)
        const rects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0)
        if (rects.length !== 1) split.push({ word: word[0], rects: rects.length })
      }
      return split
    }
    return [{ error: `Visible phrase “${phraseToFind}” was not found.` }]
  }, phrase)
  await assert.deepEqual(splitWords, [], `${label} should wrap only between words: ${JSON.stringify(splitWords)}.`)
}

async function assertCleanRoute(page, path) {
  await page.waitForFunction((expected) => window.location.pathname === expected && window.location.hash === '', path)
  await assert.equal(new URL(page.url()).pathname, path)
  await assert.equal(new URL(page.url()).hash, '')
}

async function assertActiveView(page, label) {
  const path = sectionPaths[label]
  const sectionId = label.toLowerCase()
  await assertCleanRoute(page, path)
  await settle(page)
  await assert.equal(await activeSection(page, sectionId).count(), 1, `${label} content should be the only visible section.`)
  const selectedLinks = await navLinks(page).evaluateAll((links) => links.filter((link) => link.getAttribute('aria-current') === 'page').map((link) => link.textContent.trim()))
  await assert.ok(selectedLinks.some((text) => text.includes(label)), `${label} should be selected in the real-link section navigation.`)
}

async function assertRouteMetadata(page, path) {
  const route = resolvePortfolioRoute(path)
  const response = await page.request.get(urlFor(route.path))
  await assert.equal(response.status(), 200, `${path} should have a static metadata source at ${route.path}.`)
  const source = await response.text()
  const expectedTitle = source.match(/<title>([\s\S]*?)<\/title>/)?.[1].replaceAll('&amp;', '&')
  const expectedDescription = source.match(/<meta name="description" content="([^"]+)"/)?.[1].replaceAll('&amp;', '&')
  const expectedCanonical = source.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  await assert.equal(await page.title(), expectedTitle, `${path} should update the document title.`)
  await assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), expectedCanonical)
  await assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), expectedDescription)
  await assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), expectedCanonical)
  const schema = await page.locator('script[type="application/ld+json"]').evaluate((element) => JSON.parse(element.textContent))
  const expectedSchema = JSON.parse(source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null')
  await assert.deepEqual(schema, expectedSchema, `${path} browser metadata and JSON-LD should match the static route output.`)
}

async function assertProjectRoute(page, project) {
  const path = projectPaths[projectIds[project]]
  await assertCleanRoute(page, path)
  await settle(page)
  await assert.equal(await activeSection(page, 'projects').count(), 1, 'Project details should belong to the visible Projects section.')
  await assert.ok(await page.locator(`#project-heading-${projectIds[project]}`).isVisible(), `${project} detail heading should be visible.`)
  const selectedProject = page.locator(`nav[aria-label="Choose a project"] a[href="${path}"][aria-current="page"]`)
  if (await selectedProject.count()) await assert.equal(await selectedProject.count(), 1, `${project} should be the selected real project link.`)
}

async function assertProjectInfoRoute(page, project) {
  const id = projectIds[project]
  const path = projectInfoPaths[id]
  await assertCleanRoute(page, path)
  await settle(page)
  await assert.equal(await activeSection(page, 'projects').count(), 1, 'Full writeups should belong to the visible Projects section.')
  await assert.ok(await page.locator(`#project-heading-${id}`).isVisible(), `${project} writeup heading should be visible.`)
  const selectedProject = page.locator(`nav[aria-label="Choose a project"] a[href="${projectPaths[id]}"][aria-current="page"]`)
  if (await selectedProject.count()) await assert.equal(await selectedProject.count(), 1, `${project} overview should remain selected while reading its writeup.`)
}

async function assertExperienceTimeline(page, { openState = false } = {}) {
  const details = page.locator('#work-history details')
  await assert.equal(await details.count(), 1, 'Earlier roles should share one native disclosure control.')
  await assert.equal(await details.evaluate((element) => element.open), openState, `Earlier roles should be ${openState ? 'expanded' : 'collapsed'} in this state.`)
  const items = page.locator('#work-history [data-experience-id]')
  await assert.equal(await items.count(), 8, 'Experience should render all eight supplied entries.')
  const ids = await items.evaluateAll((entries) => entries.map((entry) => entry.getAttribute('data-experience-id')))
  await assert.deepEqual(ids, expectedExperienceIds, 'Experience should put the current role first, then order completed roles by end date descending.')
  const dateTimes = await items.evaluateAll((entries) => entries.map((entry) => [...entry.querySelectorAll('time')].map((time) => time.getAttribute('datetime'))))
  await assert.deepEqual(dateTimes, expectedExperienceDateTimes, 'Every timeline role should preserve its confirmed machine-readable month bounds.')
  const dateLabels = await items.evaluateAll((entries) => entries.map((entry) => {
    const dates = [...entry.querySelectorAll('time')].map((time) => time.textContent.trim())
    return `${dates[0]} – ${dates[1] || 'Present'}`
  }))
  const dateRanges = experienceDateRanges(dateLabels.join(' '))
  await assert.deepEqual(dateRanges, expectedExperienceDates, 'Experience should preserve every supplied date period in timeline order.')
  const text = await items.evaluateAll((entries) => entries.map((entry) => entry.textContent).join(' '))
  await assert.equal((text.match(/TikTok/g) || []).length, 2, 'Both TikTok roles should appear as distinct entries.')
  await assert.ok(text.includes('Backend and Site Reliability Engineer'), 'The current TikTok role should retain its updated title.')
  await assert.match(text, /12 teams.{0,70}200 unique users/i, 'The current role should describe the teams and users served.')
  await assert.match(text, /around 50 service issues each week/i, 'The current role should describe the on-call workload.')
  await assert.match(text, /close to \$5 million/i, 'The current role should preserve the supplied savings scale.')
  await assert.match(text, /English and Chinese/i, 'The current role should retain the two working languages.')
  await assert.match(text, /1,000 students/i, 'The NUS teaching role should retain its student reach.')
  await assert.match(text, /4\.8\/5.{0,40}4\.7\/5/i, 'The teaching role should preserve both course feedback scores.')
  await assert.match(text, /300 staff/i, 'The GIC role should preserve the staff workflow reach.')
  await assert.match(text, /100 customers/i, 'The Uptale role should preserve the customer reach.')
  await assert.ok(text.includes('Artificial Intelligence Intern'), 'The A*STAR role should retain its supplied title.')
  await assert.match(text, /average.{0,30}88% accuracy/i, 'The HDB entry should retain the supplied average accuracy metric.')
  await assert.match(text, /80%/, 'The HDB role should retain the reporting-efficiency metric.')
  await assert.match(text, /100 production and raw database tables/i, 'The Eastspring role should preserve its database scale.')
  await assert.match(text, /10 types of trash/i, 'The A*STAR role should preserve the robot task detail.')

  const decodedImages = await items.locator('img').evaluateAll(async (images) => Promise.all(images.map(async (image) => {
    image.loading = 'eager'
    await image.decode()
    return { src: image.currentSrc || image.src, width: image.naturalWidth, height: image.naturalHeight }
  })))
  await assert.equal(decodedImages.length, 8, 'Each experience entry should have its company logo.')
  for (const image of decodedImages) {
    await assert.ok(image.src.startsWith('data:image/') || new URL(image.src).origin === origin, `Experience logo should be a local or inlined asset: ${image.src}`)
    await assert.ok(image.width > 0 && image.height > 0, `Experience logo should decode successfully: ${image.src}`)
  }
}

async function assertProfileCardState(page, state) {
  const card = page.locator('button[data-profile-card]')
  const showingProfile = state === 'profile-id'
  await assert.equal(await card.count(), 1, 'Experience should render one semantic profile-card button.')
  await assert.equal(await card.getAttribute('data-state'), state)
  await assert.equal(await card.getAttribute('aria-pressed'), String(showingProfile), 'The profile-card button state should be exposed to assistive technology.')
  const accessibleName = await card.getAttribute('aria-label')
  await assert.equal(accessibleName, showingProfile ? 'Show photo' : 'Flip card to show profile details', 'The profile-card button should retain its accessible action name.')
  await assert.equal((await card.innerText()).trim(), '', 'The profile-card control should show only its reverse glyph, without Flip card or Photo text.')
  const icon = card.locator('span[aria-hidden="true"] > svg')
  await assert.equal(await icon.count(), 1, 'The profile-card control should show one decorative reverse glyph.')
  await assert.ok(await icon.isVisible(), 'The reverse glyph should remain visible on each card face.')
  const glyphCircle = icon.locator('xpath=ancestor::span[1]')
  const glyphBounds = await glyphCircle.boundingBox()
  const glyphStyle = await glyphCircle.evaluate((element) => getComputedStyle(element).borderRadius)
  await assert.ok(glyphBounds && glyphBounds.width >= 44 && glyphBounds.height >= 44, 'The reverse glyph overlay should meet the 44px touch target minimum.')
  await assert.match(glyphStyle, /9999px/, 'The reverse glyph should sit in a circular overlay.')
}

function profileCardSurface(page) {
  return page.locator('button[data-profile-card]').locator('xpath=ancestor::figure[1]')
}

async function assertProfilePhotoFillsFace(page, label, viewportWidth) {
  const photo = page.locator('img[alt="Ha Thu outdoors with a camera"]')
  const geometry = await photo.evaluate(async (image) => {
    image.loading = 'eager'
    await image.decode()
    const rect = (element) => {
      const { x, y, width, height, right, bottom } = element.getBoundingClientRect()
      return { x, y, width, height, right, bottom }
    }
    return {
      image: rect(image),
      face: rect(image.parentElement),
      back: rect(document.querySelector('#profile-card-back')),
      button: rect(document.querySelector('button[data-profile-card]')),
      fit: getComputedStyle(image).objectFit,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
    }
  })
  await assert.equal(geometry.naturalWidth, 2100, `${label} should keep the original portrait asset width.`)
  await assert.equal(geometry.naturalHeight, 3000, `${label} should keep the original portrait asset height.`)
  await assert.equal(geometry.fit, 'cover', `${label} should crop the unchanged portrait to cover the face.`)
  for (const edge of ['x', 'y', 'right', 'bottom']) {
    await assert.ok(Math.abs(geometry.image[edge] - geometry.face[edge]) <= 1, `${label} portrait ${edge} should match its card face: ${JSON.stringify(geometry)}.`)
    await assert.ok(Math.abs(geometry.back[edge] - geometry.face[edge]) <= 1, `${label} reverse face ${edge} should match the photo face: ${JSON.stringify(geometry)}.`)
    await assert.ok(Math.abs(geometry.button[edge] - geometry.face[edge]) <= 1, `${label} full-card button ${edge} should match the face: ${JSON.stringify(geometry)}.`)
  }
  await assert.ok(geometry.face.x >= 0 && geometry.face.right <= viewportWidth, `${label} photo face should fit within the viewport: ${JSON.stringify(geometry.face)}.`)
}

async function assertSingleVisibleMatch(locator, label) {
  const visibleCount = await locator.evaluateAll((elements) => elements.filter((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden').length)
  await assert.equal(visibleCount, 1, `${label} should have exactly one visible responsive copy.`)
}

async function assertAllVisibleTargets(page, label) {
  const controls = await page.locator('a[href]:not([href="#portfolio-content"]), button, summary').all()
  for (const control of controls) {
    if (!await control.isVisible()) continue
    const bounds = await control.boundingBox()
    const name = await control.getAttribute('aria-label') || (await control.innerText()).trim()
    await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, `${label} ${name || 'control'} should provide a 44px target.`)
  }
}

async function assertVisibleTextFitsViewport(page, label, viewportWidth) {
  const overflow = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    const outside = []
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent.trim() || walker.currentNode.parentElement?.closest('.sr-only')) continue
      range.selectNodeContents(walker.currentNode)
      for (const rect of range.getClientRects()) {
        if (rect.width && (rect.left < -1 || rect.right > window.innerWidth + 1)) {
          outside.push({ text: walker.currentNode.textContent.trim().slice(0, 80), left: rect.left, right: rect.right })
        }
      }
    }
    return outside.slice(0, 10)
  })
  await assert.deepEqual(overflow, [], `${label} visible text should fit within ${viewportWidth}px: ${JSON.stringify(overflow)}`)
}

async function assertSelectedLinkStyle(page, label) {
  const selected = page.locator('nav[aria-label="Portfolio sections"]:visible a[aria-current="page"]')
  await assert.ok(await selected.isVisible(), `${label} should visibly identify the active section.`)
  const style = await selected.evaluate((element) => ({
    weight: getComputedStyle(element).fontWeight,
    decoration: getComputedStyle(element).textDecorationLine,
    decorationStyle: getComputedStyle(element).textDecorationStyle,
    current: element.getAttribute('aria-current'),
  }))
  await assert.equal(style.current, 'page')
  await assert.ok(Number(style.weight) >= 600, `${label} active link should use a weight cue as well as color.`)
  await assert.ok(style.decoration.includes('underline'), `${label} active link should use an underline as well as color.`)
}

async function scrollNaturallyTo(page, targetY, delta = 420) {
  const viewport = page.viewportSize()
  await page.mouse.move(Math.max(1, viewport.width - 24), Math.max(1, viewport.height - 24))
  for (let step = 0; step < 30; step += 1) {
    const y = await page.evaluate(() => window.scrollY)
    if (y >= targetY) break
    await page.mouse.wheel(0, delta)
    await page.waitForTimeout(40)
  }
  return page.evaluate(() => window.scrollY)
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

async function assertSocialActionsVisible(page, label) {
  const group = page.getByRole('group', { name: 'Contact and social links' })
  await assert.equal(await group.count(), 1, `${label} should expose one social links group.`)
  await assert.ok(await group.isVisible(), `${label} social links should be visible.`)
  for (const [name, selector, href] of [
    ['Copy work email to clipboard', group.getByRole('button', { name: 'Copy work email to clipboard', exact: true }), null],
    ['Tran Ha Thu on GitHub', group.getByRole('link', { name: 'Tran Ha Thu on GitHub', exact: true }), 'https://github.com/oeggy03'],
    ['Tran Ha Thu on LinkedIn', group.getByRole('link', { name: 'Tran Ha Thu on LinkedIn', exact: true }), 'https://www.linkedin.com/in/tran-ha-thu/'],
  ]) {
    if (href) await assert.equal(await selector.getAttribute('href'), href, `${label} ${name} destination should be preserved.`)
    const bounds = await selector.boundingBox()
    await assert.ok(bounds && bounds.y >= 0 && bounds.y + bounds.height <= page.viewportSize().height, `${label} ${name} should fit in the viewport.`)
    await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, `${label} ${name} should provide a 44px touch target.`)
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true, ...(browserPath ? { executablePath: browserPath } : {}) })
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    trackPage(page)

    await check('ordinary static HTTP server serves each generated route directly and on refresh', async () => {
      assert.equal(portfolioRoutePaths.length, 15, 'The static route matrix should cover three views, six ordinary details, and three overview/writeup pairs.')
      assert.deepEqual(portfolioCompatibilityRoutePaths, [
        '/experience/', '/projects/openclaw/', '/projects/chinese-learning/',
        '/projects/openclaw_agent/', '/projects/call_analyzer_chinese_learning/', '/projects/traders_edge/',
      ], 'The six compatibility paths should preserve the legacy Experience, case-study and PDF project links.')
      for (const path of portfolioRoutePaths) {
        const response = await context.request.get(urlFor(path))
        await assert.equal(response.status(), 200, `${path} should resolve directly over HTTP.`)
        await assert.match(response.headers()['content-type'] || '', /text\/html/i, `${path} should be a static HTML page.`)
        const body = await response.text()
        const canonical = `https://www.tranhathu.com${path}`
        await assert.ok(body.includes(`rel="canonical" href="${canonical}"`), `${path} should return its own prerendered page.`)
        await page.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
        await assert.equal(new URL(page.url()).pathname, path, `${path} direct load should not fall back to another route.`)
        await assert.ok(await page.locator('main#root').count(), `${path} should contain its server-rendered application.`)
        await page.reload({ waitUntil: 'domcontentloaded' })
        await assert.equal(new URL(page.url()).pathname, path, `${path} refresh should retain the direct route.`)
      }
      for (const [alias, route] of compatibilityRoutePaths) {
        for (const path of [alias, `${alias}index.html`]) {
          const response = await context.request.get(urlFor(path))
          await assert.equal(response.status(), 200, `${path} should resolve to a generated compatibility HTML file.`)
          await assert.match(response.headers()['content-type'] || '', /text\/html/i)
          await assert.ok((await response.text()).includes(`rel="canonical" href="https://www.tranhathu.com${route}"`), `${path} should serve canonical metadata for ${route}.`)
        }
      }
    })

    await check('terminal index.html aliases hydrate to their matching clean routes', async () => {
      for (const { alias, route } of terminalIndexAliases) {
        await page.goto(urlFor(alias), { waitUntil: 'domcontentloaded' })
        await page.waitForFunction((expected) => window.location.pathname === expected && window.location.hash === '', route)
        const label = Object.entries(sectionPaths).find(([, sectionRoute]) => sectionRoute === route)?.[0]
        if (label) {
          await assertActiveView(page, label)
        } else {
          const resolvedRoute = resolvePortfolioRoute(route)
          const projectId = resolvedRoute.projectId
          const project = Object.entries(projectIds).find(([, id]) => id === projectId)?.[0]
          await assert.ok(project, `${alias} should map to a known project route.`)
          if (resolvedRoute.projectView === 'info') await assertProjectInfoRoute(page, project)
          else await assertProjectRoute(page, project)
        }
        await assertRouteMetadata(page, route)
      }
    })

    await check('real links provide clean route navigation and open new tabs', async () => {
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Experience')
      const sections = await navLinks(page).evaluateAll((links) => links.map((link) => ({ href: link.getAttribute('href'), text: link.textContent.trim() })))
      await assert.deepEqual(sections.map(({ text }) => text), ['Experience', 'Projects', 'Skills'])
      await assert.deepEqual(sections.map(({ href }) => href), Object.values(sectionPaths), 'Section navigation must use real clean-route anchors.')
      await assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href'))), ['#portfolio-content', '#work-history', '#education', '#what-im-building'], 'Only the skip link and three explicit Experience in-page links may use anchors.')

      for (const label of ['Projects', 'Skills', 'Experience']) {
        await navLinks(page).getByText(label, { exact: true }).click()
        await assertActiveView(page, label)
        await assertRouteMetadata(page, sectionPaths[label])
      }

      await page.goto(urlFor('/experience/'), { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => window.location.pathname === '/')
      await assertActiveView(page, 'Experience')
      await assertRouteMetadata(page, '/')

      for (const { alias, route } of compatibilityAliases) {
        await page.goto(urlFor(alias), { waitUntil: 'domcontentloaded' })
        await page.waitForFunction((expected) => window.location.pathname === expected && window.location.hash === '', route)
        if (route === '/') {
          await assertActiveView(page, 'Experience')
        } else {
          const resolvedRoute = resolvePortfolioRoute(route)
          const project = Object.entries(projectIds).find(([, id]) => id === resolvedRoute.projectId)?.[0]
          await assert.ok(project, `${alias} should resolve to a known project.`)
          if (resolvedRoute.projectView === 'info') await assertProjectInfoRoute(page, project)
          else await assertProjectRoute(page, project)
        }
        await assertRouteMetadata(page, route)
      }

      const newTabContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const newTabSource = await newTabContext.newPage()
      trackPage(newTabSource)
      await newTabSource.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const projectsLink = newTabSource.locator('nav[aria-label="Portfolio sections"]:visible a[href="/projects/"]')
      const newTabWait = newTabContext.waitForEvent('page')
      await projectsLink.click({ button: 'middle' })
      const newTab = await newTabWait
      trackPage(newTab)
      await newTab.waitForLoadState('domcontentloaded')
      await assert.equal(new URL(newTab.url()).pathname, '/projects/', 'A modified link should open its actual href in a new tab.')
      await assert.equal(new URL(newTabSource.url()).pathname, '/', 'Opening a route in a new tab should leave the source route unchanged.')
      await newTabContext.close()
    })

    await check('legacy hashes canonicalize after matching SSR hydration without errors', async () => {
      const before = { console: consoleErrors.length, pages: pageErrors.length }
      legacyRoutes['project-openclaw'] = projectPaths.openclaw
      legacyRoutes['project-chinese-learning'] = projectPaths['chinese-learning']
      for (const [fragment, path] of Object.entries(legacyRoutes)) {
        await page.goto(`${urlFor('/')}#${fragment}`, { waitUntil: 'domcontentloaded' })
        await page.waitForFunction((expected) => window.location.pathname === expected && window.location.hash === '', path)
        await settle(page)
        await assert.equal(new URL(page.url()).pathname, path, `#${fragment} should map to ${path}.`)
        const sectionId = path.startsWith('/projects/') || projectPaths.openclaw === path || projectPaths['chinese-learning'] === path || projectPaths['traders-edge'] === path ? 'projects' : path.slice(1, -1) || 'experience'
        await assert.equal(await activeSection(page, sectionId).count(), 1, `#${fragment} should hydrate to the correct visible section.`)
      }
      await assert.deepEqual(consoleErrors.slice(before.console), [], 'Legacy route hydration should not produce console errors or hydration mismatch warnings.')
      await assert.deepEqual(pageErrors.slice(before.pages), [], 'Legacy route hydration should not produce uncaught errors.')
    })

    await check('Back and Forward restore clean routes and reading position', async () => {
      await page.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      await assertCleanRoute(page, '/projects/')
      const readingY = await scrollNaturallyTo(page, 180)
      await assert.ok(readingY > 20, `History test should save a nonzero reading position, got ${readingY}px.`)
      await navLinks(page).getByText('Skills', { exact: true }).click()
      await assertActiveView(page, 'Skills')
      await page.goBack()
      await page.waitForFunction(() => window.location.pathname === '/projects/')
      await assert.equal(await activeSection(page, 'projects').count(), 1)
      await settle(page)
      const restoredY = await page.evaluate(() => window.scrollY)
      const maximum = await page.evaluate(() => document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight)
      await assert.ok(Math.abs(restoredY - Math.min(readingY, maximum)) <= 2, `Back should restore the Projects reading offset (${readingY}px), received ${restoredY}px.`)
      await page.goForward()
      await assertActiveView(page, 'Skills')
    })

    await check('all project cards, filters, case studies, explorer links and project history', async () => {
      await page.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Projects')
      const index = page.locator('#projects [data-project-index]')
      const cards = index.locator('article')
      await assert.equal(await cards.count(), 9, 'All nine project cards should appear on the index.')
      const filters = page.getByRole('group', { name: 'Filter projects' })
      const categoryCounts = ['All', 'Backend', 'AI & bots', 'Frontend']
      const expectedCounts = [9, 3, 5, 1]
      for (let index = 0; index < categoryCounts.length; index += 1) {
        const categoryButton = filters.getByRole('button').nth(index)
        await assert.equal((await categoryButton.innerText()).replace(/\s+/g, ' ').trim().replace(/\D/g, ''), String(expectedCounts[index]), `${categoryCounts[index]} should show its correct project count.`)
        await assert.equal((await categoryButton.innerText()).replace(String(expectedCounts[index]), '').trim(), categoryCounts[index])
      }
      for (const project of projectNames) {
        const path = projectPaths[projectIds[project]]
        const link = index.locator(`a[href="${path}"]`)
        await assert.equal(await link.getAttribute('href'), path, `${project} should link to its clean overview/detail route.`)
      }

      const aiFilter = page.getByRole('button', { name: /^AI & bots/ })
      await aiFilter.click()
      await assert.equal(new URL(page.url()).pathname, '/projects/', 'Filtering should not navigate to a project detail.')
      await assert.equal(await aiFilter.getAttribute('aria-pressed'), 'true')
      await assert.equal(await cards.count(), 5, 'AI & bots should filter to five project cards.')
      const aiCardOrder = await cards.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href')))
      await assert.deepEqual(aiCardOrder.slice(0, 2), [projectPaths.openclaw, projectPaths['chinese-learning']], 'Featured projects should lead the filtered grid.')
      const scrolledY = await scrollNaturallyTo(page, 150)
      await assert.ok(scrolledY > 0, 'The filtered index should retain a real scroll position before opening a project overview.')
      await index.locator(`a[href="${projectPaths.openclaw}"]`).click()
      await assertProjectRoute(page, 'My OpenClaw Lab')
      const cardHeadingTop = await page.locator('#project-heading-openclaw').evaluate((element) => element.getBoundingClientRect().top)
      await assert.ok(cardHeadingTop >= 0 && cardHeadingTop < 400, 'Opening a project overview from a scrolled index should align its title near the viewport top.')
      const fullWriteupLink = page.getByRole('link', { name: 'Read full project writeup for My OpenClaw Lab', exact: true })
      await assert.ok(await fullWriteupLink.isVisible(), 'The overview card should clearly offer access to the full writeup.')
      const fullWriteupBounds = await fullWriteupLink.boundingBox()
      await assert.ok(fullWriteupBounds && fullWriteupBounds.height >= 44, 'The full-writeup action should remain comfortably large.')
      await fullWriteupLink.click()
      await assertProjectInfoRoute(page, 'My OpenClaw Lab')
      await assertRouteMetadata(page, projectInfoPaths.openclaw)
      await page.goBack()
      await assertProjectRoute(page, 'My OpenClaw Lab')
      await page.goBack()
      await page.waitForFunction(() => window.location.pathname === '/projects/' && window.location.hash === '')
      await assert.equal(await cards.count(), 5, 'Back should restore the filtered project index.')
      await assert.equal(await aiFilter.getAttribute('aria-pressed'), 'true', 'Back should preserve the chosen category filter.')
      const teleAiCard = index.locator('a[href="/projects/teleai/"]')
      await teleAiCard.click()
      await assertProjectRoute(page, 'TeleAI')
      const teleAiHeading = page.locator('#project-heading-teleai')
      await assert.ok(await teleAiHeading.evaluate((element) => element === document.activeElement), 'A desktop project selection from the index should focus the selected title.')
      await assert.ok((await teleAiHeading.boundingBox()).y < 400, 'Opening an older compact project from a scrolled index should place its title near the viewport top.')
      await page.goBack()
      await page.waitForFunction(() => window.location.pathname === '/projects/')
      await assert.equal(await cards.count(), 5, 'Back should restore the category filter after an older detail.')

      const backendFilter = page.getByRole('button', { name: /^Backend/ })
      await backendFilter.click()
      await assert.equal(new URL(page.url()).pathname, '/projects/')
      await assert.equal(await cards.count(), 3)
      await assert.equal(await backendFilter.getAttribute('aria-pressed'), 'true')
      const frontendFilter = page.getByRole('button', { name: /^Frontend/ })
      await frontendFilter.click()
      await assert.equal(await cards.count(), 1, 'Frontend should filter to the one supplied project.')
      await page.getByRole('button', { name: /^All/ }).click()
      await assert.equal(await cards.count(), 9)

      const traderCard = index.locator(`a[href="${projectPaths['traders-edge']}"]`)
      await traderCard.click()
      await assertProjectRoute(page, 'Trader’s Edge')
      const traderRepoAction = page.getByRole('link', { name: 'View code', exact: true })
      await assert.equal(await traderRepoAction.getAttribute('href'), 'https://github.com/Traders-Edge/traders_edge')
      await assert.ok(await traderRepoAction.isVisible(), 'Trader’s Edge overview should expose its source repository.')
      await page.getByRole('link', { name: 'Read full project writeup for Trader’s Edge', exact: true }).click()
      await assertProjectInfoRoute(page, 'Trader’s Edge')

      await page.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      for (const project of projectNames) {
        await page.goto(urlFor(projectPaths[projectIds[project]]), { waitUntil: 'domcontentloaded' })
        await assertProjectRoute(page, project)
        const synopsis = caseStudySynopses[projectIds[project]]
        if (synopsis) {
          await assert.ok(await page.locator(`#project-${projectIds[project]}`).getByText(synopsis, { exact: true }).isVisible(), `${project} overview should show its project synopsis before the full writeup.`)
          const fullWriteupLink = page.getByRole('link', { name: `Read full project writeup for ${project}`, exact: true })
          await assert.ok(await fullWriteupLink.isVisible(), `${project} overview should clearly link to its full writeup.`)
          const titleBounds = await page.locator(`#project-heading-${projectIds[project]}`).boundingBox()
          const actionBounds = await fullWriteupLink.boundingBox()
          await assert.ok(actionBounds && actionBounds.height >= 44 && titleBounds && actionBounds.x + actionBounds.width / 2 > titleBounds.x + titleBounds.width / 2, `${project} should have a large top-right full-writeup action.`)
        }
        const heading = page.locator(`#project-heading-${projectIds[project]}`)
        await heading.focus()
        await assert.ok(await heading.evaluate((element) => element === document.activeElement), `${project} heading should remain keyboard focusable.`)
        for (const href of projectOutboundLinksById[projectIds[project]]) {
          await assert.ok(await page.locator(`a[href="${href}"]`).count() > 0, `Missing ${project} destination ${href}.`)
        }
        const imagesByProject = {
          'My OpenClaw Lab': [['OpenClaw brand banner showing its lobster mascot and wordmark, with the line “Your personal AI assistant, running on your own devices.”', 1280, 358]],
          'Chinese Learning Toolkit': [['A daily Telegram message with a sample of collected Chinese vocabulary.', 533, 257]],
        }
        for (const [alt, expectedWidth, expectedHeight] of imagesByProject[project] || []) {
          const image = page.locator(`img[alt="${alt}"]`).first()
          await assert.ok(await image.count(), `${project} should include the supplied image: ${alt}`)
          const imageData = await image.evaluate(async (element) => {
            element.loading = 'eager'
            await element.decode()
            return { src: element.currentSrc || element.src, width: element.naturalWidth, height: element.naturalHeight }
          })
          await assert.ok(imageData.src.startsWith('data:image/') || new URL(imageData.src).origin === origin, `${project} image should be local or inlined: ${alt}`)
          await assert.equal(imageData.width, expectedWidth, `${project} should preserve the supplied image width.`)
          await assert.equal(imageData.height, expectedHeight, `${project} should preserve the supplied image height.`)
        }
      }

      for (const project of ['My OpenClaw Lab', 'Chinese Learning Toolkit', 'Trader’s Edge']) {
        const path = projectInfoPaths[projectIds[project]]
        await page.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
        await assertProjectInfoRoute(page, project)
        await assertRouteMetadata(page, path)
        const imagesByCaseStudy = {
          'My OpenClaw Lab': [
            ['OpenClaw conversation about comparing gaming mice and adding a Tecware EX2 to the cart.', 608, 726],
            ['Shopee cart showing one Tecware EX2 mouse.', 1230, 636],
          ],
          'Chinese Learning Toolkit': [['Telegram message showing a sample of daily Chinese vocabulary with readings and meanings.', 533, 257]],
        }
        for (const [alt, expectedWidth, expectedHeight] of imagesByCaseStudy[project] || []) {
          const image = page.locator(`img[alt="${alt}"]`).first()
          await assert.ok(await image.count(), `${project} full writeup should retain its supplied report image: ${alt}`)
          const imageData = await image.evaluate(async (element) => {
            element.loading = 'eager'
            await element.decode()
            return { src: element.currentSrc || element.src, width: element.naturalWidth, height: element.naturalHeight }
          })
          await assert.ok(imageData.src.startsWith('data:image/') || new URL(imageData.src).origin === origin, `${project} image should use a local or inlined asset: ${alt}`)
          await assert.equal(imageData.width, expectedWidth)
          await assert.equal(imageData.height, expectedHeight)
        }
        if (project === 'My OpenClaw Lab') {
          await assert.equal(await page.locator('#architecture-openclaw').locator('..').locator('ul').count(), 1, 'OpenClaw should describe connected tools without false ordering.')
        } else if (project === 'Chinese Learning Toolkit') {
          await assert.equal(await page.locator('#architecture-chinese-learning').locator('..').locator('ol').count(), 1, 'The Chinese-learning workflow should retain its real sequence.')
        }
        const backLabel = project === 'Trader’s Edge' ? 'Back to Trader’s Edge' : 'Back to project overview'
        const backToOverview = page.getByRole('link', { name: backLabel, exact: true })
        await assert.ok(await backToOverview.isVisible(), `${project} writeup should link back to its overview.`)
        await backToOverview.click()
        await assertProjectRoute(page, project)
      }

      await page.goto(urlFor('/projects/foroom/'), { waitUntil: 'domcontentloaded' })
      const chooser = page.getByRole('navigation', { name: 'Choose a project' })
      await assert.equal(await chooser.getByRole('link').count(), 9, 'The existing detail explorer should offer all nine project routes.')
      await chooser.getByRole('link', { name: /My OpenClaw Lab/i }).click()
      await assertProjectRoute(page, 'My OpenClaw Lab')
      await page.goBack()
      await assertProjectRoute(page, 'FoROOM')
    })

    await check('experience content is chronological and destination links remain available', async () => {
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Experience')
      await assertRouteMetadata(page, '/')
      const experienceSection = page.locator('#experience')
      const details = experienceSection.locator('details')
      const summary = details.locator('summary')
      await assert.equal(await details.evaluate((element) => element.open), false, 'Earlier roles should start collapsed on a fresh Experience load.')
      await assert.ok(await experienceSection.locator('[data-experience-id="tiktok-backend"]').isVisible(), 'The current role should remain visible while earlier roles are collapsed.')
      await assert.equal(await experienceSection.locator('[data-experience-id="tiktok-intern"]').isVisible(), false, 'Past roles should stay tucked away until requested.')
      const summaryBounds = await summary.boundingBox()
      await assert.ok(summaryBounds && summaryBounds.width >= 44 && summaryBounds.height >= 44, 'The native experience disclosure should have a 44px target.')
      const summaryActionBounds = await summary.locator('[data-earlier-experience-action]').boundingBox()
      await assert.ok(summaryActionBounds && Math.abs(summaryActionBounds.x + summaryActionBounds.width - summaryBounds.x - summaryBounds.width) <= 2, 'The earlier-role action should align with the disclosure’s right edge on desktop.')
      await assert.equal((await summary.innerText()).replace(/\s+/g, ' ').trim(), 'I also engineered at View earlier experience')
      const preview = summary.locator('[role="img"]')
      await assert.equal(await preview.count(), 1, 'The earlier-role summary should present one accessible employer-logo group.')
      await assert.match(await preview.getAttribute('aria-label'), /^Earlier employers:/)
      const previewLogoAlts = await preview.locator('img').evaluateAll((images) => images.map((image) => image.alt))
      await assert.deepEqual(previewLogoAlts, ['TikTok', 'National University of Singapore', 'GIC', 'Uptale', 'Housing & Development Board (HDB)', 'Eastspring Investments', 'Agency for Science, Technology and Research (A*STAR)'])

      await summary.click()
      await assert.equal(await details.evaluate((element) => element.open), true, 'Clicking the summary should expand the earlier roles.')
      await assert.ok(await experienceSection.locator('[data-experience-id="tiktok-intern"]').isVisible())
      await assertExperienceTimeline(page, { openState: true })
      const disclosureSpacing = await details.evaluate((element) => parseFloat(getComputedStyle(element).marginTop))
      await assert.ok(disclosureSpacing >= 24, `The earlier-role disclosure should have at least 24px separation from the current role, received ${disclosureSpacing}px.`)
      const employerMarkMetrics = await experienceSection.locator('[data-experience-id]').evaluateAll((entries) => entries.map((entry) => {
        const header = entry.querySelector('article > div.flex')
        const logo = header.querySelector('a[aria-label$="website"]')
        const copy = logo?.nextElementSibling
        const title = copy?.querySelector('h3')
        const company = title?.nextElementSibling
        const titleBounds = title?.getBoundingClientRect()
        const companyBounds = company?.getBoundingClientRect()
        return {
          height: logo?.getBoundingClientRect().height,
          gap: copy && logo ? copy.getBoundingClientRect().left - logo.getBoundingClientRect().right : Number.NaN,
          titleAndCompanyHeight: titleBounds && companyBounds ? companyBounds.bottom - titleBounds.top : Number.NaN,
        }
      }))
      await assert.ok(employerMarkMetrics.every(({ height, gap, titleAndCompanyHeight }) => height >= 64 && height <= 72 && gap >= 12 && Math.abs(height - titleAndCompanyHeight) <= 12), `Employer marks should match the 64–72px title-and-company block with at least 12px of breathing room, received ${JSON.stringify(employerMarkMetrics)}.`)
      const text = await experienceSection.innerText()
      for (const company of experiences) await assert.ok(text.includes(company), `Experience should show ${company}.`)
      const dateRanges = experienceDateRanges(await page.locator('#work-history').innerText())
      await assert.deepEqual(dateRanges, expectedExperienceDates)
      await assert.ok(text.indexOf('National University of Singapore') < text.indexOf('GIC'), 'The NUS teaching role ending in Dec 2025 should precede the GIC role ending in Sep 2025.')
      for (const href of experienceOutboundLinks) await assert.ok(await experienceSection.locator(`a[href="${href}"]`).count() > 0, `Missing employer destination ${href}.`)

      await summary.focus()
      await summary.press('Enter')
      await assert.equal(await details.evaluate((element) => element.open), false, 'Enter should collapse the native disclosure.')
      await assert.equal(await experienceSection.locator('[data-experience-id="tiktok-intern"]').isVisible(), false)
      await summary.focus()
      await summary.press('Space')
      await assert.equal(await details.evaluate((element) => element.open), true, 'Space should expand the native disclosure.')
      await assert.ok(await experienceSection.locator('[data-experience-id="tiktok-intern"]').isVisible())
    })

    await check('profile card prerenders its photo, limits the timed demo to Experience, and toggles by keyboard', async () => {
      const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
      const staticPage = await staticContext.newPage()
      trackPage(staticPage)
      await staticPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const staticCard = staticPage.locator('button[data-profile-card]')
      const staticSurface = profileCardSurface(staticPage)
      await assert.equal(await staticCard.count(), 1, 'The Experience profile card should be present in prerendered HTML.')
      await assert.equal(await staticCard.getAttribute('data-state'), 'photo', 'The prerendered card should start on its photo face.')
      await assert.equal(await staticCard.getAttribute('aria-pressed'), 'false')
      await assert.ok(await staticSurface.locator('img[alt="Ha Thu outdoors with a camera"]').isVisible(), 'The initial photo should be visible without JavaScript.')
      await staticContext.close()

      const demoContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const demoPage = await demoContext.newPage()
      trackPage(demoPage)
      await demoPage.emulateMedia({ reducedMotion: 'no-preference' })
      await demoPage.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      const card = demoPage.locator('button[data-profile-card]')
      await assert.equal(await card.count(), 1, 'The Experience card should remain prerendered on the Projects route.')
      await assert.equal(await card.isVisible(), false, 'The Experience card should stay hidden on the Projects route.')
      await demoPage.waitForTimeout(1100)
      await assert.equal(await card.getAttribute('data-state'), 'photo', 'A hidden Experience view should not start or consume the profile preview.')

      await demoPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await assertProfileCardState(demoPage, 'photo')
      await demoPage.waitForTimeout(500)
      await assertProfileCardState(demoPage, 'photo')
      await demoPage.waitForFunction(() => document.querySelector('button[data-profile-card]')?.dataset.state === 'profile-id', null, { timeout: 1700 })
      const profileShownAt = Date.now()
      await demoPage.waitForTimeout(2200)
      await assertProfileCardState(demoPage, 'profile-id')
      await demoPage.waitForFunction(() => document.querySelector('button[data-profile-card]')?.dataset.state === 'photo', null, { timeout: 1600 })
      const previewDuration = Date.now() - profileShownAt
      await assert.ok(previewDuration >= 2500 && previewDuration <= 3900, `The profile details should remain up for about three seconds, received ${previewDuration}ms.`)

      await demoPage.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      await demoPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await demoPage.waitForTimeout(1100)
      await assertProfileCardState(demoPage, 'photo')
      await demoContext.close()

      const keyboardContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
      const keyboardPage = await keyboardContext.newPage()
      trackPage(keyboardPage)
      await keyboardPage.emulateMedia({ reducedMotion: 'no-preference' })
      await keyboardPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const keyboardCard = keyboardPage.locator('button[data-profile-card]')
      await keyboardPage.waitForTimeout(100)
      await keyboardCard.focus()
      await keyboardPage.waitForTimeout(1100)
      await assertProfileCardState(keyboardPage, 'photo')
      await keyboardCard.press('Enter')
      await assertProfileCardState(keyboardPage, 'profile-id')
      await keyboardCard.press('Space')
      await assertProfileCardState(keyboardPage, 'photo')
      await keyboardPage.waitForTimeout(1000)
      await assertProfileCardState(keyboardPage, 'photo')
      await keyboardContext.close()

      const pointerContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
      const pointerPage = await pointerContext.newPage()
      trackPage(pointerPage)
      await pointerPage.emulateMedia({ reducedMotion: 'no-preference' })
      await pointerPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await pointerPage.waitForTimeout(100)
      await pointerPage.locator('nav[aria-label="Portfolio sections"] a[href="/"]').click()
      await pointerPage.waitForTimeout(1100)
      await assertProfileCardState(pointerPage, 'photo')
      await pointerContext.close()

      const keyboardActivityContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
      const keyboardActivityPage = await keyboardActivityContext.newPage()
      trackPage(keyboardActivityPage)
      await keyboardActivityPage.emulateMedia({ reducedMotion: 'no-preference' })
      await keyboardActivityPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await keyboardActivityPage.waitForTimeout(100)
      const experienceLink = keyboardActivityPage.locator('nav[aria-label="Portfolio sections"] a[href="/"]')
      await experienceLink.focus()
      await experienceLink.press('Enter')
      await keyboardActivityPage.waitForTimeout(1100)
      await assertProfileCardState(keyboardActivityPage, 'photo')
      await keyboardActivityContext.close()

      const activationContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
      const activationPage = await activationContext.newPage()
      trackPage(activationPage)
      await activationPage.emulateMedia({ reducedMotion: 'no-preference' })
      await activationPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await activationPage.waitForTimeout(100)
      const activationCard = activationPage.locator('button[data-profile-card]')
      await activationCard.evaluate((element) => element.click())
      await assertProfileCardState(activationPage, 'profile-id')
      await activationPage.waitForTimeout(4200)
      await assertProfileCardState(activationPage, 'profile-id')
      await activationContext.close()

      const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
      const reducedPage = await reducedContext.newPage()
      trackPage(reducedPage)
      await reducedPage.emulateMedia({ reducedMotion: 'reduce' })
      await reducedPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const reducedCard = reducedPage.locator('button[data-profile-card]')
      await reducedPage.waitForTimeout(1100)
      await assertProfileCardState(reducedPage, 'photo')
      await reducedCard.click()
      await assertProfileCardState(reducedPage, 'profile-id')
      const reducedMotion = await reducedCard.evaluate((element) => {
        const wrapper = element.parentElement
        const flipper = wrapper.querySelector(':scope > span > span')
        return {
          transitionProperty: getComputedStyle(flipper).transitionProperty,
          runningAnimations: [...wrapper.querySelectorAll('*')].flatMap((child) => child.getAnimations()).filter((animation) => animation.playState === 'running').length,
        }
      })
      await assert.equal(reducedMotion.transitionProperty, 'none', 'Manual card flips should have no transition when reduced motion is requested.')
      await assert.equal(reducedMotion.runningAnimations, 0, 'Manual card flips should be immediate when reduced motion is requested.')
      await reducedContext.close()
    })

    await check('profile photo fills both card faces from 320px to desktop at normal and 200% text', async () => {
      for (const viewport of [
        { width: 320, height: 568 },
        { width: 390, height: 844 },
        { width: 768, height: 1024 },
        { width: 1024, height: 768 },
        { width: 1440, height: 900 },
      ]) {
        for (const textScale of [100, 200]) {
          const cardContext = await browser.newContext({ viewport })
          const cardPage = await cardContext.newPage()
          trackPage(cardPage)
          await cardPage.emulateMedia({ reducedMotion: 'reduce' })
          await cardPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
          if (textScale === 200) await cardPage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
          await settle(cardPage)
          const label = `${viewport.width}px/${textScale}%`
          const card = cardPage.locator('button[data-profile-card]')
          const backFace = cardPage.locator('#profile-card-back')
          await assertProfileCardState(cardPage, 'photo')
          await assertProfilePhotoFillsFace(cardPage, label, viewport.width)
          await card.click()
          await assertProfileCardState(cardPage, 'profile-id')
          await assert.equal(await backFace.locator('img').count(), 0, `${label} reverse face should contain no portrait image.`)
          const visibleBackText = await renderedVisibleText(backFace)
          await assert.doesNotMatch(visibleBackText.toLowerCase(), /\bsingapore\b|fictional/, `${label} reverse face should omit decorative country/fiction headers.`)
          await assert.match(visibleBackText.toLowerCase(), /singaporean/, `${label} reverse face should retain the citizenship fact.`)
          await assert.match(visibleBackText.toLowerCase(), /h1b1 visa eligible|eligible for h1b1 visa/, `${label} reverse face should retain the visa fact.`)
          if (viewport.width < 768) {
            await assert.doesNotMatch(visibleBackText, /Tran Ha Thu|Backend Engineer/, `${label} should use the compact mobile facts.`)
          } else {
            await assert.ok(visibleBackText.includes('Tran Ha Thu'), `${label} desktop ID should retain the name.`)
            await assert.ok(visibleBackText.includes('Backend Engineer at TikTok'), `${label} desktop ID should retain the current role.`)
          }
          if (textScale === 200) await assertVisibleTextFitsViewport(cardPage, `${label} reverse card`, viewport.width)
          await cardContext.close()
        }
      }
    })

    await check('profile card presents compact mobile details, full desktop details, and readable 200% text', async () => {
      const profileContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
      const profilePage = await profileContext.newPage()
      trackPage(profilePage)
      await profilePage.emulateMedia({ reducedMotion: 'reduce' })
      await profilePage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const card = profilePage.locator('button[data-profile-card]')
      const surface = profileCardSurface(profilePage)
      await card.click()
      await assertProfileCardState(profilePage, 'profile-id')
      await assert.equal(await card.getAttribute('aria-describedby'), 'profile-card-description', 'The active profile face should be described accessibly.')
      const description = surface.locator('#profile-card-description')
      const backFace = surface.locator('#profile-card-back')
      await assert.equal(await description.innerText(), 'Singaporean. Eligible for H1B1 Visa.', 'The mobile card description should contain only its compact facts.')
      const mobileDetails = (await renderedVisibleText(backFace)).toLowerCase()
      await assert.match(mobileDetails, /\bsingaporean\b/, 'The compact ID should preserve the citizenship fact.')
      await assert.match(mobileDetails, /h1b1 visa eligible/, 'The compact ID should preserve the visa fact.')
      await assert.doesNotMatch(mobileDetails, /\bsingapore\b|fictional/, 'The compact ID should not add a country or fictional-card heading.')
      await assert.equal(await backFace.locator('img').count(), 0, 'The reverse ID face should not show the portrait.')
      await assert.equal(await surface.getByText('Tran Ha Thu', { exact: true }).isVisible(), false, 'Mobile details should omit the full name and desktop-only fields.')

      await profilePage.setViewportSize({ width: 1440, height: 900 })
      await profilePage.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      await assert.equal(await description.innerText(), 'Tran Ha Thu. Singaporean Citizen. Eligible for H1B1 Visa. Backend Engineer at TikTok.', 'The desktop accessible description should include all four profile facts.')
      const desktopDetails = await renderedVisibleText(backFace)
      for (const value of ['Tran Ha Thu', 'Singaporean Citizen', 'Eligible for H1B1 Visa', 'Backend Engineer at TikTok']) {
        await assert.ok(desktopDetails.includes(value), `The desktop profile card should visibly include ${value}.`)
      }
      await assert.doesNotMatch(desktopDetails.toLowerCase(), /\bsingapore\b|fictional/, 'The desktop ID should omit a Singapore or fictional-card heading.')

      await profilePage.setViewportSize({ width: 320, height: 568 })
      await profilePage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
      await profilePage.evaluate(async () => {
        await document.fonts?.ready
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      })
      await assert.equal(await description.innerText(), 'Singaporean. Eligible for H1B1 Visa.', 'The 320px card should return to the compact accessible description.')
      const cardGeometry = await surface.evaluate((element) => {
        const rect = element.getBoundingClientRect()
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }
      })
      await assert.ok(cardGeometry.width > 0 && cardGeometry.left >= 0 && cardGeometry.right <= 320, `The 320px profile card should fit within the viewport: ${JSON.stringify(cardGeometry)}.`)
      await assert.ok(cardGeometry.height < 568, `The expanded profile details should remain reachable in the 568px viewport: ${JSON.stringify(cardGeometry)}.`)
      await assertVisibleTextFitsViewport(profilePage, 'Expanded mobile profile card at 200%', 320)
      const cardTextOverflow = await surface.evaluate((element) => {
        const cardBounds = element.getBoundingClientRect()
        const back = element.querySelector('#profile-card-back')
        const walker = document.createTreeWalker(back, NodeFilter.SHOW_TEXT)
        const range = document.createRange()
        const outside = []
        while (walker.nextNode()) {
          const node = walker.currentNode
          const parent = node.parentElement
          if (!node.textContent.trim() || parent.closest('[aria-hidden="true"], .sr-only')) continue
          if (getComputedStyle(parent).display === 'none' || getComputedStyle(parent).visibility === 'hidden') continue
          range.selectNodeContents(node)
          for (const line of range.getClientRects()) {
            if (line.width && (line.left < cardBounds.left - 1 || line.right > cardBounds.right + 1)) {
              outside.push({ text: node.textContent.trim(), left: line.left, right: line.right })
            }
          }
        }
        return outside
      })
      await assert.deepEqual(cardTextOverflow, [], `The 200% profile details should wrap within the card: ${JSON.stringify(cardTextOverflow)}.`)
      await profileContext.close()
    })

    await check('Experience facts and shared profile actions', async () => {
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Experience')
      const experience = activeSection(page, 'experience')
      const text = (await experience.innerText()).toLowerCase()
      for (const fact of [
        'backend engineer', 'tiktok', 'national university of singapore', 'bachelor of computing', 'computer science',
        '2022', '2026', '4.6/5.0', 'first class honours', 'distinction in software engineering', "dean's list",
      ]) await assert.ok(text.includes(fact), `Experience should include the confirmed fact: ${fact}.`)
      const interestsHeading = experience.getByRole('heading', { name: 'Interests', exact: true })
      const interests = await interestsHeading.locator('xpath=following-sibling::ul[1]/li').allTextContents()
      await assert.deepEqual(interests.map((interest) => interest.trim()), [
        'Software engineering', 'Scalable systems and architecture', 'Tinkering with the latest technologies',
      ], 'Experience should preserve the requested interests in order.')
      const skillsHeading = experience.getByRole('heading', { name: 'Skills', exact: true })
      const skillNames = (await skillsHeading.locator('xpath=following-sibling::p[1]').innerText())
        .split(/\s*\u00b7\s*/).map((skill) => skill.trim())
      await assert.deepEqual(skillNames, ['Software Development', 'Agentic Development', 'Scalable Systems', 'Version Control'], 'Experience should show the requested software skills in their own group.')
      const priorLanguagesHeading = experience.getByRole('heading', { name: 'Previously worked with', exact: true })
      const priorLanguages = (await priorLanguagesHeading.locator('xpath=following-sibling::p[1]').innerText())
        .split(/\s*\u00b7\s*/).map((language) => language.trim())
      await assert.deepEqual(priorLanguages, ['Go', 'Python', 'C#', 'Java', 'TypeScript'], 'Experience should show the requested previously used languages in their own group.')
      await assert.ok(!text.includes('i want to build useful software and help others learn to program'), 'The old aspiration paragraph should be removed.')
      await assert.equal(await experience.getByRole('heading', { name: 'I build useful and scalable software.', exact: true }).count(), 1, 'Experience should use the requested headline exactly.')
      await assert.ok(text.includes('hey, i’m ha thu, a backend engineer and computer science graduate of the national university of singapore.'), 'Experience should retain the requested friendly introduction.')
      await assert.ok(text.includes('i’m committed to building practical, useful software with the future in mind'), 'Experience should include the supplied purpose statement.')
      await assert.ok(text.includes('i enjoy experimenting with new technologies along the way'), 'Experience should include the supplied interest in experimenting.')
      for (const project of projectNames.slice(0, 6)) await assert.ok(!text.includes(project.toLowerCase()), `Experience should not contain older project ${project}.`)
      await assert.equal(await experience.locator('img[src*="proj_images"]').count(), 0, 'Experience should not contain project images.')

      const education = experience.locator('#education')
      await assert.ok(!/\bminors?\b/i.test(await education.innerText()), 'Education should not list minors.')
      const honors = education.getByText("First Class Honours, Distinction in Software Engineering, Dean's List", { exact: true })
      await assert.equal(await honors.count(), 1, 'Honours should appear together in one paragraph.')
      await assert.equal(await honors.evaluate((element) => element.tagName), 'P', 'The combined honours line should use paragraph structure.')
      const requestedAwards = [
        'Best Work Award - Tembusu College',
        'NUS Computing Student Life Award - Bronze',
        'SMU Hack For Cities hackathon runner-up',
      ]
      const awardLines = await education.getByRole('group', { name: 'Awards', exact: true }).locator(':scope > p').allTextContents()
      const normalizedAwardLines = awardLines.map((line) => line.replace(/\s+/g, ' ').trim())
      await assert.deepEqual(normalizedAwardLines, requestedAwards, 'Education should show each requested award on its own line and in the supplied order.')
      const heroNavigation = experience.getByRole('navigation', { name: 'Explore this page', exact: true })
      await assert.deepEqual(await heroNavigation.getByRole('link').evaluateAll((links) => links.map((link) => ({ href: link.getAttribute('href'), name: link.textContent.replace(/\s+/g, ' ').trim() }))), [
        { href: '#work-history', name: 'View experience' },
        { href: '#education', name: 'View education' },
        { href: '#what-im-building', name: 'What I’m building' },
      ], 'The grouped hero links should follow the work-history, education, and featured-project order with visible accessible names.')
      await assert.ok(await heroNavigation.evaluate((navigation) => navigation.previousElementSibling?.tagName === 'P'), 'The grouped links should follow the complete hero introduction.')
      const educationPeriod = education.getByText('Aug 2022 – May 2026', { exact: true })
      const educationDateStyle = await educationPeriod.evaluate((element) => ({ size: parseFloat(getComputedStyle(element).fontSize), weight: parseFloat(getComputedStyle(element).fontWeight) }))
      await assert.ok(educationDateStyle.size >= 16 && educationDateStyle.weight >= 500, 'The education dates should remain distinct and legible at 16px or larger.')
      await assert.ok(await education.getByText('GPA 4.6/5.0', { exact: true }).isVisible(), 'Education should keep the GPA separate from the dates.')
      await assert.equal(await education.getByRole('heading', { name: 'Education', exact: true }).count(), 1, 'The native education teaser should lead to the complete section.')
      const portrait = experience.locator('img[alt="Ha Thu outdoors with a camera"]')
      await assert.equal(await portrait.count(), 1, 'The hero should contain one semantic portrait image.')
      const portraitImage = await portrait.evaluate(async (image) => {
        image.loading = 'eager'
        await image.decode()
        return { src: image.currentSrc || image.src, width: image.naturalWidth, height: image.naturalHeight }
      })
      await assert.ok(portraitImage.src.startsWith('data:image/') || new URL(portraitImage.src).origin === origin, 'The portrait should load from a local bundled asset.')
      await assert.ok(portraitImage.width === 2100 && portraitImage.height === 3000, 'The original portrait should remain unchanged.')
      for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1440, height: 900 }]) {
        await page.setViewportSize(viewport)
        await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
        await settle(page)
        const navBounds = await page.locator('nav[aria-label="Explore this page"]').boundingBox()
        const descriptionBounds = await page.locator('#experience-intro-heading + div > p').boundingBox()
        await assert.ok(navBounds && descriptionBounds && navBounds.x >= 0 && navBounds.x + navBounds.width <= viewport.width, `The grouped hero links should stay within the ${viewport.width}px viewport.`)
        await assert.ok(navBounds.y >= descriptionBounds.y + descriptionBounds.height, 'The grouped links should follow the entire friendly introduction.')
        if (viewport.width === 390) await assert.ok(navBounds.y + navBounds.height <= viewport.height, 'The grouped links should remain visible in the normal 390x844 first viewport.')
        const disclosure = page.locator('#work-history details')
        const summaryBounds = await disclosure.locator('summary').boundingBox()
        const actionBounds = await disclosure.locator('summary [data-earlier-experience-action]').boundingBox()
        await assert.ok(summaryBounds && actionBounds && Math.abs(actionBounds.x + actionBounds.width - summaryBounds.x - summaryBounds.width) <= 2, `The earlier-role action should align to the right on the ${viewport.width}px layout.`)
      }
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const experienceJump = page.getByRole('navigation', { name: 'Explore this page' }).getByRole('link', { name: 'View experience', exact: true })
      await experienceJump.click()
      await assert.equal(new URL(page.url()).hash, '#work-history', 'The hero should link to the in-page work history.')
      await waitForStableScroll(page)
      await assert.ok(await page.locator('#work-history').isVisible(), 'The work-history anchor target should be available.')
      await assert.equal(await page.locator('#work-history').evaluate((element) => element === document.activeElement), true, 'Following the work-history link should focus its heading container.')
      const workHistoryBounds = await page.locator('#work-history').boundingBox()
      const workHistoryHeaderBounds = await page.locator('[data-portfolio-toolbar]').boundingBox()
      await assert.ok(workHistoryBounds && workHistoryHeaderBounds && workHistoryBounds.y >= workHistoryHeaderBounds.y + workHistoryHeaderBounds.height, 'The work-history section should clear the sticky header.')
      await page.goBack()
      await page.waitForFunction(() => window.location.pathname === '/' && window.location.hash === '')
      await settle(page)
      await assert.ok(Math.abs(await page.evaluate(() => window.scrollY)) <= 2, 'Back from work history should restore the Experience hero position.')
      await page.goForward()
      await page.waitForFunction(() => window.location.hash === '#work-history')
      await settle(page)
      await assert.equal(await page.locator('#work-history').count(), 1, 'Forward should restore the work-history anchor entry.')
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await page.locator('a[href="#education"]').click()
      await assert.equal(new URL(page.url()).pathname, '/', 'Education should remain an in-page link rather than a routed view.')
      await assert.equal(new URL(page.url()).hash, '#education', 'Education should use its native fragment target.')
      await waitForStableScroll(page)
      const educationBounds = await page.locator('#education').boundingBox()
      const toolbarBounds = await page.locator('[data-portfolio-toolbar]').boundingBox()
      await assert.ok(educationBounds && toolbarBounds && educationBounds.y >= toolbarBounds.y + toolbarBounds.height, 'The Education section should clear the sticky header.')
      await page.goBack()
      await page.waitForFunction(() => window.location.pathname === '/' && window.location.hash === '')
      await settle(page)
      await assert.ok(Math.abs(await page.evaluate(() => window.scrollY)) <= 2, 'Back from Education should restore the Experience hero position.')
      await page.goForward()
      await page.waitForFunction(() => window.location.hash === '#education')
      await settle(page)
      await assert.equal(await page.locator('#education').count(), 1, 'Forward should restore the Education anchor entry.')
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await page.locator('a[href="#what-im-building"]').click()
      await assert.equal(new URL(page.url()).hash, '#what-im-building', 'The featured-project link should remain a native in-page anchor.')
      await waitForStableScroll(page)
      const buildingBounds = await page.locator('#what-im-building').boundingBox()
      const buildingHeaderBounds = await page.locator('[data-portfolio-toolbar]').boundingBox()
      await assert.ok(buildingBounds && buildingHeaderBounds && buildingBounds.y >= buildingHeaderBounds.y + buildingHeaderBounds.height, 'The featured-project section should clear the sticky header.')
      await page.goBack()
      await page.waitForFunction(() => window.location.hash === '')
      await settle(page)
      await assert.ok(Math.abs(await page.evaluate(() => window.scrollY)) <= 2, 'Back from featured projects should restore the Experience hero position.')
      await page.goForward()
      await page.waitForFunction(() => window.location.hash === '#what-im-building')
      await settle(page)
      await assert.equal(await page.locator('#what-im-building').count(), 1, 'Forward should restore the featured-project anchor entry.')
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const currentDates = await page.locator('#work-history [data-experience-id="tiktok-backend"] time').first().evaluate((element) => ({ size: parseFloat(getComputedStyle(element).fontSize), weight: parseFloat(getComputedStyle(element.parentElement).fontWeight) }))
      await assert.ok(currentDates.size >= 16 && currentDates.weight >= 500, 'Experience dates should remain at least 16px and medium weight.')
      await assertSocialActionsVisible(page, 'Desktop')

      const resume = page.locator('[data-portfolio-toolbar]').getByRole('link', { name: 'Resume', exact: true })
      await assert.ok(await resume.isVisible(), 'The shared toolbar should expose Resume.')
      const resumeResponse = await context.request.get(new URL(await resume.getAttribute('href'), baseUrl).href)
      await assert.equal(resumeResponse.status(), 200, 'Resume should resolve to a built PDF.')
      await assert.match(resumeResponse.headers()['content-type'] || '', /application\/pdf/i)
      const resumeSource = await readFile(new URL('../src/assets/Resume_TranHaThu.pdf', import.meta.url))
      const expectedResumeSha256 = '1397baf8f3068943c8d8ea488a7753824fa4662fdf20c6f185223629268f6b14'
      await assert.equal(createHash('sha256').update(resumeSource).digest('hex'), expectedResumeSha256, 'The supplied one-page resume PDF should retain its confirmed source bytes.')
      await assert.deepEqual(await resumeResponse.body(), resumeSource, 'The served resume PDF should match the supplied source byte for byte.')
    })

    await check('JavaScript-disabled direct loads and refreshes preserve every route', async () => {
      const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } })
      const staticPage = await staticContext.newPage()
      trackPage(staticPage)
      for (const path of portfolioRoutePaths) {
        await staticPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
        await assert.equal(new URL(staticPage.url()).pathname, path, `No-JavaScript direct load should stay on ${path}.`)
        await assert.ok(await staticPage.locator('main#root').count(), `${path} should contain usable server-rendered content without JavaScript.`)
        const canonical = `https://www.tranhathu.com${path}`
        await assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), canonical)
        const projectRoute = resolvePortfolioRoute(path)
        const sectionId = path === '/' ? 'experience' : projectRoute.projectId || path.startsWith('/projects/') ? 'projects' : path.slice(1, -1)
        await assert.equal(await staticPage.locator(`main section#${sectionId}:not([hidden])`).count(), 1, `${path} should show its matching section without JavaScript.`)
        const projectId = projectRoute.projectId
        if (projectId) {
          await assert.ok(await staticPage.locator(`#project-heading-${projectId}`).isVisible(), `${path} should show its matching project without JavaScript.`)
          if (projectRoute.projectView === 'overview' && projectInfoPaths[projectId]) {
            const name = projectNames.find((project) => projectIds[project] === projectId)
            await assert.ok(await staticPage.getByRole('link', { name: `Read full project writeup for ${name}`, exact: true }).isVisible(), `${path} should offer a real full-writeup anchor without JavaScript.`)
          }
          for (const href of projectOutboundLinksById[projectId] || []) {
            await assert.ok(await staticPage.locator(`a[href="${href}"]`).count() > 0, `No-JavaScript ${path} should expose ${href}.`)
          }
          if (projectRoute.projectView === 'info' && (projectId === 'openclaw' || projectId === 'chinese-learning')) {
            const architectureHeading = projectId === 'openclaw' ? 'Architecture and components' : 'How it works'
            for (const heading of ['Why I started', 'What it does', architectureHeading, 'Examples', 'Deployment', 'Currently working on and future plans']) {
              await assert.ok(await staticPage.getByRole('heading', { name: heading, exact: true }).isVisible(), `No-JavaScript ${path} should retain the ${heading} section.`)
            }
          }
        }
        if (path === '/') {
          await assert.equal(await staticPage.locator('[data-portfolio-toolbar]').evaluate((element) => getComputedStyle(element).position), 'relative', 'No-JavaScript output should keep the header in document flow.')
          await assertExperienceTimeline(staticPage)
          const details = staticPage.locator('#experience details')
          const summary = details.locator('summary')
          await summary.click()
          await assert.equal(await details.evaluate((element) => element.open), true, 'Native details should open in a browser with JavaScript disabled.')
          await assert.ok(await staticPage.locator('#experience [data-experience-id="tiktok-intern"]').isVisible())
          await assertExperienceTimeline(staticPage, { openState: true })
          await staticPage.getByRole('navigation', { name: 'Explore this page' }).getByRole('link', { name: 'View experience', exact: true }).click()
          await assert.equal(new URL(staticPage.url()).hash, '#work-history', 'A native work-history anchor should work without JavaScript.')
          await assert.ok(await staticPage.locator('#work-history').isVisible(), 'The work-history target should remain available without JavaScript.')
          await staticPage.locator('a[href="#education"]').click()
          await assert.equal(new URL(staticPage.url()).hash, '#education', 'A native Education anchor should work without JavaScript.')
          await assert.ok(await staticPage.locator('#education-heading').isVisible(), 'The Education heading should remain visible after its native anchor is followed.')
          await assert.ok(await staticPage.getByRole('heading', { name: 'Interests', exact: true }).isVisible(), 'The Education section should retain the supplied Interests heading without JavaScript.')
          await staticPage.locator('a[href="#what-im-building"]').click()
          await assert.equal(new URL(staticPage.url()).hash, '#what-im-building', 'A native featured-project anchor should work without JavaScript.')
          await assert.ok(await staticPage.locator('#what-im-building').isVisible(), 'The featured-project section should remain available without JavaScript.')
          await assert.equal(await staticPage.getByRole('group', { name: 'Filter projects' }).count(), 0, 'JavaScript-only index filters should not be presented in no-JavaScript output.')
        }
        if (path === '/skills/') {
          for (const skill of skills) {
            await assert.ok(await staticPage.locator('#skills').getByText(skill, { exact: true }).first().isVisible(), `No-JavaScript Skills should expose ${skill}.`)
          }
        }
        if (path === '/projects/') {
          await assert.equal(await staticPage.getByRole('group', { name: 'Filter projects' }).count(), 0, 'JavaScript-only filters should remain hidden without hydration.')
          for (const project of projectNames) {
            const cardLink = staticPage.locator(`#projects a[href="${projectPaths[projectIds[project]]}"]`)
            await assert.ok(await cardLink.isVisible(), `No-JavaScript project cards should expose ${project}.`)
          }
        }
        await staticPage.reload({ waitUntil: 'domcontentloaded' })
        await assert.equal(new URL(staticPage.url()).pathname, path, `No-JavaScript refresh should remain on ${path}.`)
        if (path === '/') {
          await assert.equal(await staticPage.locator('#experience details').evaluate((element) => element.open), false, 'A direct refresh should return earlier roles to the collapsed state.')
          await assert.equal(await staticPage.locator('#experience [data-experience-id="tiktok-intern"]').isVisible(), false)
        }
      }

      for (const { alias, route } of terminalIndexAliases) {
        await staticPage.goto(urlFor(alias), { waitUntil: 'domcontentloaded' })
        await assert.equal(new URL(staticPage.url()).pathname, alias, `No-JavaScript ${alias} should retain its static file URL.`)
        await assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://www.tranhathu.com${route}`, `${alias} should serve the canonical metadata for ${route}.`)
        const projectRoute = resolvePortfolioRoute(route)
        const sectionId = route === '/' ? 'experience' : projectRoute.projectId || route.startsWith('/projects/') ? 'projects' : route.slice(1, -1)
        await assert.equal(await staticPage.locator(`main section#${sectionId}:not([hidden])`).count(), 1, `No-JavaScript ${alias} should show its matching view.`)
        const projectId = projectRoute.projectId
        if (projectId) {
          await assert.ok(await staticPage.locator(`#project-heading-${projectId}`).isVisible(), `No-JavaScript ${alias} should expose its project detail.`)
          const resolvedRoute = resolvePortfolioRoute(route)
          if (resolvedRoute.projectView === 'overview' && projectInfoPaths[projectId]) {
            const project = Object.entries(projectIds).find(([, id]) => id === projectId)?.[0]
            await assert.ok(await staticPage.getByRole('link', { name: `Read full project writeup for ${project}`, exact: true }).isVisible(), `No-JavaScript ${alias} should expose the overview’s real writeup link.`)
          }
        }
      }

      for (const { alias, route } of compatibilityIndexAliases) {
        await staticPage.goto(urlFor(alias), { waitUntil: 'domcontentloaded' })
        await assert.equal(new URL(staticPage.url()).pathname, alias, `No-JavaScript ${alias} should keep its static compatibility URL.`)
        await assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://www.tranhathu.com${route}`)
        if (route === '/') {
          await assert.ok(await staticPage.locator('#experience').isVisible(), `${alias} should keep the Experience readable without JavaScript.`)
          await assertExperienceTimeline(staticPage)
        } else {
          const resolvedRoute = resolvePortfolioRoute(route)
          const projectId = resolvedRoute.projectId
          const project = Object.entries(projectIds).find(([, id]) => id === projectId)?.[0]
          await assert.ok(await staticPage.locator(`#project-heading-${projectId}`).isVisible(), `${alias} should keep its project view readable without JavaScript.`)
          if (resolvedRoute.projectView === 'info') {
            const backLabel = project === 'Trader’s Edge' ? 'Back to Trader’s Edge' : 'Back to project overview'
            await assert.ok(await staticPage.getByRole('link', { name: backLabel, exact: true }).isVisible())
          } else if (projectInfoPaths[projectId]) {
            await assert.ok(await staticPage.getByRole('link', { name: `Read full project writeup for ${project}`, exact: true }).isVisible())
          }
        }
      }

      await staticPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const sections = await staticPage.locator('#portfolio-content > section[id]').evaluateAll((items) => items.map((item) => item.id))
      await assert.deepEqual(sections, ['experience', 'projects', 'skills'])
      for (const alias of ['homepage', 'overview', 'about', 'aboutSection', 'contact', 'contactSec', 'experiencesSec', 'projectsSec']) {
        await assert.equal(await staticPage.locator(`[id="${alias}"]`).count(), 1, `No-JavaScript output should retain the legacy ${alias} target.`)
      }
      const staticExperience = staticPage.locator('#experience')
      const experienceImages = await staticExperience.locator('img').evaluateAll((images) => images.map((image) => image.currentSrc || image.src))
      const projectImages = await staticPage.locator('[id^="project-"] img').evaluateAll((images) => images.map((image) => image.currentSrc || image.src))
      for (const source of experienceImages) await assert.ok(!projectImages.includes(source), `Experience should not reuse project imagery: ${source}.`)
      const authoredHashLinks = await staticPage.locator('a[href^="#"]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')))
      await assert.deepEqual(authoredHashLinks, ['#portfolio-content', '#work-history', '#education', '#what-im-building'], 'Static output may use only the native skip and three Experience in-page anchors.')
      await staticContext.close()
    })

    await check('11 viewport responsive matrix, touch targets and reading controls', async () => {
      const viewports = [
        { width: 1440, height: 900 },
        { width: 1366, height: 768 },
        { width: 1024, height: 600 },
        { width: 1440, height: 600 },
        { width: 390, height: 844 },
        { width: 390, height: 600 },
        { width: 320, height: 568 },
        { width: 720, height: 450 },
        { width: 768, height: 1024 },
        { width: 844, height: 390 },
        { width: 1920, height: 1080 },
      ]
      const layoutPage = await browser.newPage({ viewport: viewports[0] })
      trackPage(layoutPage)
      const overflow = []
      for (const viewport of viewports) {
        await layoutPage.setViewportSize(viewport)
        for (const [label, path] of Object.entries(sectionPaths)) {
          await layoutPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          await settle(layoutPage)
          if (label === 'Experience') {
            const tiktokEyebrow = layoutPage.getByText('As a Backend engineer at TikTok...', { exact: true })
            await assert.equal(await tiktokEyebrow.count(), 1, 'The supplied TikTok eyebrow should remain available at its desktop breakpoint.')
            if (viewport.width < 768) await assert.equal(await tiktokEyebrow.isVisible(), false, 'The mobile hero should hide the TikTok eyebrow beside the top portrait.')
            else await assert.equal(await tiktokEyebrow.isVisible(), true, 'The desktop hero should retain its supplied TikTok eyebrow.')
            if (viewport.width < 768) {
              const resume = layoutPage.locator('[data-portfolio-toolbar]').getByRole('link', { name: 'Resume', exact: true })
              await assert.ok(await resume.isVisible(), 'Resume should remain visible in mobile navigation.')
              const colors = await resume.evaluate((element) => ({ background: getComputedStyle(element).backgroundColor, foreground: getComputedStyle(element).color }))
              await assert.equal(colors.background, 'rgb(0, 83, 166)', `Mobile Resume should keep the filled blue action background, received ${colors.background}.`)
              await assert.equal(colors.foreground, 'rgb(255, 255, 255)', 'Mobile Resume should use white text over the blue fill.')
            }
          }
          if (label === 'Experience' && [320, 390].includes(viewport.width)) {
            await layoutPage.waitForFunction(() => {
              const header = document.querySelector('[data-portfolio-toolbar]')
              return header?.dataset.portfolioStickyReady === 'true' && header.dataset.portfolioSticky === 'true'
            })
          }
          const size = await layoutPage.evaluate(() => ({
            viewport: window.innerWidth,
            document: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          }))
          if (size.document > size.viewport) overflow.push(`${label} at ${viewport.width}×${viewport.height}: ${size.document}px document width`)
        }
      }
      await assert.deepEqual(overflow, [], `Horizontal overflow cases:\n${overflow.map((item) => `  ${item}`).join('\n')}`)

      for (const viewport of viewports) {
        await layoutPage.setViewportSize(viewport)
        for (const path of [...Object.values(projectPaths), ...Object.values(projectInfoPaths)]) {
          await layoutPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          await settle(layoutPage)
          const size = await layoutPage.evaluate(() => ({
            viewport: window.innerWidth,
            document: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          }))
          await assert.ok(size.document <= size.viewport, `${path} should not overflow at ${viewport.width}x${viewport.height}.`)
          await assertAllVisibleTargets(layoutPage, `${path} at ${viewport.width}px`)
        }
      }

      for (const viewport of viewports) {
        await layoutPage.setViewportSize(viewport)
        for (const [label, path] of Object.entries(sectionPaths)) {
          await layoutPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          await assertAllVisibleTargets(layoutPage, `${label} at ${viewport.width}px`)
          if (label === 'Experience') {
            await layoutPage.locator('#experience details').evaluate((element) => { element.open = true })
            await settle(layoutPage)
            await assertVisibleTextFitsViewport(layoutPage, `Expanded Experience at ${viewport.width}px`, viewport.width)
            await assertAllVisibleTargets(layoutPage, `Expanded Experience at ${viewport.width}px`)
            const expandedWidth = await layoutPage.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth))
            await assert.ok(expandedWidth <= viewport.width, `Expanded Experience should not overflow horizontally at ${viewport.width}px.`)
          }
        }
      }

      for (const width of [320, 390]) {
        await layoutPage.setViewportSize({ width, height: 844 })
        for (const [label, path] of Object.entries(sectionPaths)) {
          await layoutPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          const navigationLabels = await layoutPage.locator('nav[aria-label="Portfolio sections"]:visible a[href]').evaluateAll((links) => links.map((link) => {
            const range = document.createRange()
            range.selectNodeContents(link)
            return { label: link.textContent.trim(), lines: range.getClientRects().length }
          }))
          await assert.deepEqual(navigationLabels, [
            { label: 'Experience', lines: 1 },
            { label: 'Projects', lines: 1 },
            { label: 'Skills', lines: 1 },
          ], `${label} section labels should stay on one line at ${width}px.`)
        }
      }

      await layoutPage.setViewportSize({ width: 390, height: 844 })
      await layoutPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const mobileNavigation = layoutPage.locator('nav[aria-label="Portfolio sections"]:visible')
      await assert.equal(await mobileNavigation.count(), 1)
      const mobileLinks = await mobileNavigation.locator('a[href]').all()
      await assert.equal(mobileLinks.length, 3)
      const navigationLayout = await mobileNavigation.locator('ul').evaluate((element) => ({
        wrapping: getComputedStyle(element).flexWrap,
        labels: [...element.querySelectorAll('a')].map((link) => link.textContent.trim()),
      }))
      await assert.equal(navigationLayout.wrapping, 'wrap', 'Section links should reflow when increased text size needs additional lines.')
      await assert.deepEqual(navigationLayout.labels, ['Experience', 'Projects', 'Skills'])
      for (const link of mobileLinks) {
        const bounds = await link.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Mobile navigation links should be at least 44px square.')
        await assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= 844, 'All mobile section links should be visible at the top.')
      }
      await assertSelectedLinkStyle(layoutPage, 'Mobile')
      await assertSocialActionsVisible(layoutPage, '390px mobile top')

      await layoutPage.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      await layoutPage.getByRole('group', { name: 'Filter projects' }).waitFor()
      const filters = await layoutPage.getByRole('group', { name: 'Filter projects' }).getByRole('button').all()
      await assert.equal(filters.length, 4)
      for (const control of filters) {
        const bounds = await control.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Project filters should be at least 44px square.')
      }
      const projectLinks = await layoutPage.locator('#projects [data-project-index] article a[href]').all()
      for (const link of projectLinks) {
        const bounds = await link.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Project links should be at least 44px square.')
      }

      await layoutPage.setViewportSize({ width: 320, height: 568 })
      await layoutPage.goto(urlFor('/projects/teleai/'), { waitUntil: 'domcontentloaded' })
      await assertProjectRoute(layoutPage, 'TeleAI')
      const stickyNav = layoutPage.locator('[data-portfolio-toolbar]')
      const navBounds = await stickyNav.boundingBox()
      const projectHeading = await layoutPage.locator('#project-heading-teleai').boundingBox()
      await assert.ok(navBounds && projectHeading && projectHeading.y >= navBounds.y + navBounds.height + 16, 'A direct project heading should clear the full sticky header.')
      const browseLink = layoutPage.getByRole('link', { name: /Back to projects/i })
      await assert.ok(await browseLink.isVisible(), 'A project detail should keep a Back to projects link nearby on mobile.')
      await browseLink.click()
      await assertActiveView(layoutPage, 'Projects')
      await assert.ok(await layoutPage.locator('#projects [data-project-index]').isVisible())
      await layoutPage.emulateMedia({ reducedMotion: 'reduce' })
      const navStyle = await layoutPage.locator('nav[aria-label="Portfolio sections"]:visible a[href="/projects/"]').evaluate((element) => ({
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        transition: getComputedStyle(element).transitionProperty,
      }))
      await assert.ok(navStyle.reduced)
      await assert.equal(navStyle.transition, 'none', 'Section navigation should respect reduced motion.')
      await layoutPage.close()
    })

    await check('hero anchors make cancellable smooth progress on desktop and mobile', async () => {
      for (const viewport of [
        { width: 1440, height: 900 },
        { width: 390, height: 844 },
      ]) {
        const motionPage = await browser.newPage({ viewport })
        trackPage(motionPage)
        await motionPage.emulateMedia({ reducedMotion: 'no-preference' })
        await motionPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
        await settle(motionPage)
        await motionPage.evaluate(() => {
          const originalScrollIntoView = Element.prototype.scrollIntoView
          window.__scrollIntoViewRequests = []
          Element.prototype.scrollIntoView = function scrollIntoViewWithTracking(options) {
            window.__scrollIntoViewRequests.push({ id: this.id, behavior: options?.behavior || 'auto' })
            return originalScrollIntoView.call(this, options)
          }
        })
        const startY = await motionPage.evaluate(() => window.scrollY)
        await motionPage.getByRole('navigation', { name: 'Explore this page' }).getByRole('link', { name: 'What I’m building', exact: true }).click()
        await assert.equal(new URL(motionPage.url()).hash, '#what-im-building')
        const intermediateY = await waitForScrollProgress(motionPage, startY)
        const finalY = await waitForStableScroll(motionPage)
        await assert.ok(intermediateY > startY && finalY > intermediateY + 1, `${viewport.width}px smooth scrolling should pass through an intermediate position before reaching the target.`)
        await assert.deepEqual(await motionPage.evaluate(() => window.__scrollIntoViewRequests.at(-1)), { id: 'what-im-building', behavior: 'smooth' })
        await assert.equal(await motionPage.locator('#what-im-building').evaluate((element) => element === document.activeElement), true, 'The anchor target should receive focus while the document scrolls smoothly.')
        const targetBounds = await motionPage.locator('#what-im-building').boundingBox()
        const headerBounds = await motionPage.locator('[data-portfolio-toolbar]').boundingBox()
        await assert.ok(targetBounds && headerBounds && targetBounds.y >= headerBounds.y + headerBounds.height, `${viewport.width}px smooth scrolling should clear the sticky header.`)
        await motionPage.close()
      }
    })

    await check('only explicit changed routes fade the portfolio content', async () => {
      const motionPage = await browser.newPage({ viewport: { width: 1280, height: 900 } })
      trackPage(motionPage)
      await motionPage.emulateMedia({ reducedMotion: 'no-preference' })
      await motionPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await settle(motionPage)
      await installRouteFadeProbe(motionPage)
      const content = motionPage.locator('#portfolio-content')
      await assert.deepEqual(await content.evaluate((element) => ({ opacity: getComputedStyle(element).opacity, running: element.getAnimations().some((animation) => animation.playState === 'running') })), { opacity: '1', running: false }, 'Direct loads should not start a route fade.')

      await motionPage.locator('nav[aria-label="Portfolio sections"] a[href="/skills/"]').click()
      const sectionFade = await motionPage.evaluate(() => window.__portfolioRouteFades)
      await assert.deepEqual(sectionFade, [{ fromOpacity: 0.3, toOpacity: 1, duration: 190 }], 'An explicit section change should invoke the brief opacity fade even if the test host observes it after completion.')
      await assertActiveView(motionPage, 'Skills')
      await settle(motionPage)
      await assert.equal(await content.evaluate((element) => getComputedStyle(element).opacity), '1', 'A section fade should finish at full opacity.')
      await assert.equal(await content.evaluate((element) => element.getAnimations().some((animation) => animation.playState === 'running')), false)

      await motionPage.locator('nav[aria-label="Portfolio sections"] a[href="/skills/"]').click()
      await waitForStableScroll(motionPage)
      await assert.equal((await motionPage.evaluate(() => window.__portfolioRouteFades)).length, 1, 'A same-route click should not invoke a new fade.')
      await assert.equal(await content.evaluate((element) => element.getAnimations().some((animation) => animation.playState === 'running')), false, 'A same-route click should not start another fade.')

      await motionPage.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      await settle(motionPage)
      await installRouteFadeProbe(motionPage)
      await motionPage.locator(`#projects a[href="${projectPaths.openclaw}"]`).click()
      await motionPage.waitForFunction(() => window.location.pathname === '/openclaw_agent/')
      const projectFade = await motionPage.evaluate(() => window.__portfolioRouteFades)
      await assert.deepEqual(projectFade, [{ fromOpacity: 0.3, toOpacity: 1, duration: 190 }], 'An explicit project change should invoke the same brief content fade.')
      await settle(motionPage)
          await assertProjectRoute(motionPage, 'My OpenClaw Lab')
      await assert.equal(await content.evaluate((element) => getComputedStyle(element).opacity), '1')
      await motionPage.goBack()
      await motionPage.waitForFunction(() => window.location.pathname === '/projects/' && window.location.hash === '')
      await settle(motionPage)
      await assert.equal(await content.evaluate((element) => element.getAnimations().some((animation) => animation.playState === 'running')), false, 'History restoration should not animate the route.')
      await assert.equal((await motionPage.evaluate(() => window.__portfolioRouteFades)).length, 1, 'History restoration should not invoke a new fade.')
      await motionPage.close()
    })

    await check('rapid anchor changes preserve interrupted history offsets when a route is chosen', async () => {
      const motionPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
      trackPage(motionPage)
      await motionPage.emulateMedia({ reducedMotion: 'no-preference' })
      await motionPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await settle(motionPage)
      const featureLink = motionPage.locator('a[href="#what-im-building"]')
      const startY = await motionPage.evaluate(() => window.scrollY)
      await featureLink.click()
      const firstIntermediateY = await waitForScrollProgress(motionPage, startY)

      const educationLink = motionPage.locator('a[href="#education"]')
      const secondStartingY = await motionPage.evaluate(() => window.scrollY)
      await educationLink.evaluate((element) => element.click())
      await assert.equal(new URL(motionPage.url()).hash, '#education')
      const interruptedY = await waitForScrollProgress(motionPage, secondStartingY)
      await assert.ok(Math.abs(interruptedY - firstIntermediateY) > 1, 'The second anchor should replace the first in-progress native scroll.')

      await motionPage.evaluate(() => {
        window.__skillsPreviousEntryOffset = null
        const originalPushState = window.history.pushState.bind(window.history)
        window.history.pushState = function recordPreviousRouteOffset(state, title, url) {
          if (new URL(url, window.location.href).pathname === '/skills/') {
            window.__skillsPreviousEntryOffset = window.history.state?.__portfolioScrollY
          }
          return originalPushState(state, title, url)
        }
      })
      const educationDestinationY = await motionPage.locator('#education').evaluate((element) => element.getBoundingClientRect().top + window.scrollY - (Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0))
      await motionPage.locator('nav[aria-label="Portfolio sections"] a[href="/skills/"]').click()
      const routeInterruptedY = await motionPage.evaluate(() => window.__skillsPreviousEntryOffset)
      await assert.ok(Number.isFinite(routeInterruptedY), 'The test should capture the actual previous-entry offset immediately before route history is pushed.')
      await assert.ok(routeInterruptedY > 0 && Math.abs(routeInterruptedY - educationDestinationY) > 2, 'The saved education entry should retain the actual intermediate cancellation position.')
      await assertActiveView(motionPage, 'Skills')
      await settle(motionPage)
      await assert.equal(new URL(motionPage.url()).pathname, '/skills/')
      await assert.ok(Math.abs(await motionPage.evaluate(() => window.scrollY)) <= 2, 'The explicit route should cancel anchor motion and use its own top destination.')
      await assert.equal(await motionPage.locator('#portfolio-content').evaluate((element) => element.getAnimations().some((animation) => animation.playState === 'running')), false, 'The cancelled route transition should leave no fade running.')

      await motionPage.goBack()
      await motionPage.waitForFunction(() => window.location.pathname === '/' && window.location.hash === '#education')
      await waitForStableScroll(motionPage)
      await assert.ok(Math.abs(await motionPage.evaluate(() => window.scrollY) - routeInterruptedY) <= 3, 'Back should restore the actual education-scroll position recorded when route navigation cancelled motion.')
      await motionPage.goForward()
      await motionPage.waitForFunction(() => window.location.pathname === '/skills/' && window.location.hash === '')
      await settle(motionPage)
      await assert.ok(Math.abs(await motionPage.evaluate(() => window.scrollY)) <= 2)
      await motionPage.close()
    })

    await check('reduced motion keeps anchor scroll and route changes immediate, including preference changes', async () => {
      const reducedPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
      trackPage(reducedPage)
      await reducedPage.emulateMedia({ reducedMotion: 'reduce' })
      await reducedPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await settle(reducedPage)
      await reducedPage.evaluate(() => {
        const originalScrollIntoView = Element.prototype.scrollIntoView
        window.__scrollIntoViewRequests = []
        Element.prototype.scrollIntoView = function scrollIntoViewWithTracking(options) {
          window.__scrollIntoViewRequests.push({ id: this.id, behavior: options?.behavior || 'auto' })
          return originalScrollIntoView.call(this, options)
        }
      })
      await installRouteFadeProbe(reducedPage)
      await reducedPage.locator('a[href="#what-im-building"]').click()
      await waitForStableScroll(reducedPage)
      await assert.deepEqual(await reducedPage.evaluate(() => window.__scrollIntoViewRequests.at(-1)), { id: 'what-im-building', behavior: 'auto' }, 'Reduced motion should use an immediate anchor scroll.')
      await assert.equal(await reducedPage.locator('#portfolio-content').evaluate((element) => element.getAnimations().some((animation) => animation.playState === 'running')), false)
      await reducedPage.locator('nav[aria-label="Portfolio sections"] a[href="/skills/"]').click()
      await settle(reducedPage)
      await assert.deepEqual(await reducedPage.evaluate(() => window.__portfolioRouteFades), [], 'Reduced-motion route navigation should not invoke a fade.')
      await assert.equal(await reducedPage.locator('#portfolio-content').evaluate((element) => getComputedStyle(element).opacity), '1')
      await assert.equal(await reducedPage.locator('#portfolio-content').evaluate((element) => element.getAnimations().some((animation) => animation.playState === 'running')), false, 'Reduced motion should bypass route fades.')
      await reducedPage.close()

      const skipPage = await browser.newPage({ viewport: { width: 1024, height: 768 } })
      trackPage(skipPage)
      await skipPage.emulateMedia({ reducedMotion: 'no-preference' })
      await skipPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await settle(skipPage)
      await skipPage.evaluate(() => {
        const originalScrollIntoView = Element.prototype.scrollIntoView
        window.__scrollIntoViewRequests = []
        Element.prototype.scrollIntoView = function scrollIntoViewWithTracking(options) {
          window.__scrollIntoViewRequests.push({ id: this.id, behavior: options?.behavior || 'auto' })
          return originalScrollIntoView.call(this, options)
        }
      })
      await skipPage.keyboard.press('Tab')
      await assert.ok(await skipPage.locator('a[href="#portfolio-content"]').evaluate((element) => element === document.activeElement))
      await skipPage.keyboard.press('Enter')
      await assert.deepEqual(await skipPage.evaluate(() => window.__scrollIntoViewRequests.at(-1)), { id: 'portfolio-content', behavior: 'auto' }, 'The skip link should remain immediate when reduced motion is not requested.')
      await assert.ok(await skipPage.locator('#portfolio-content').evaluate((element) => element === document.activeElement))
      await skipPage.close()

      const changingPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
      trackPage(changingPage)
      await changingPage.emulateMedia({ reducedMotion: 'no-preference' })
      await changingPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await settle(changingPage)
      await changingPage.evaluate(() => {
        const originalScrollIntoView = Element.prototype.scrollIntoView
        window.__scrollIntoViewRequests = []
        Element.prototype.scrollIntoView = function scrollIntoViewWithTracking(options) {
          window.__scrollIntoViewRequests.push({ id: this.id, behavior: options?.behavior || 'auto' })
          return originalScrollIntoView.call(this, options)
        }
      })
      await installRouteFadeProbe(changingPage)
      await changingPage.locator('a[href="#education"]').click()
      await waitForScrollProgress(changingPage, 0)
      await changingPage.locator('a[href="#work-history"]').evaluate((element) => element.click())
      await assert.equal(new URL(changingPage.url()).hash, '#work-history')
      const secondAnchorMotion = await changingPage.evaluate(() => {
        const target = document.getElementById('work-history')
        const targetY = target.getBoundingClientRect().top + window.scrollY
        const marginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
        return { currentY: window.scrollY, destinationY: targetY - marginTop }
      })
      await assert.ok(Math.abs(secondAnchorMotion.currentY - secondAnchorMotion.destinationY) > 2, 'The replacement anchor should still be moving when the previous scroll completion is delivered.')
      const obsoleteEventMovement = await changingPage.evaluate(() => {
        const beforeY = window.scrollY
        window.dispatchEvent(new Event('scrollend'))
        return { beforeY, afterY: window.scrollY }
      })
      await assert.ok(Math.abs(obsoleteEventMovement.afterY - obsoleteEventMovement.beforeY) <= 1, 'An obsolete scrollend event should not move the replacement anchor.')
      await changingPage.emulateMedia({ reducedMotion: 'reduce' })
      await waitForStableScroll(changingPage)
      await assert.deepEqual(await changingPage.evaluate(() => window.__scrollIntoViewRequests.at(-1)), { id: 'work-history', behavior: 'auto' }, 'Enabling reduced motion during a rapid anchor change should finish the latest anchor at its destination without smooth motion.')
      const featureBounds = await changingPage.locator('#work-history').boundingBox()
      const headerBounds = await changingPage.locator('[data-portfolio-toolbar]').boundingBox()
      await assert.ok(featureBounds && headerBounds && featureBounds.y >= headerBounds.y + headerBounds.height, 'Reduced-motion preference changes should complete the latest anchor target.')
      const delayedEventMovement = await changingPage.evaluate(() => {
        const beforeY = window.scrollY
        window.dispatchEvent(new Event('scrollend'))
        return { beforeY, afterY: window.scrollY }
      })
      await assert.ok(Math.abs(delayedEventMovement.afterY - delayedEventMovement.beforeY) <= 1, 'A delayed old scrollend event should not disturb the completed replacement target.')

      await changingPage.emulateMedia({ reducedMotion: 'no-preference' })
      await changingPage.locator('nav[aria-label="Portfolio sections"] a[href="/skills/"]').click()
      await assert.deepEqual(await changingPage.evaluate(() => window.__portfolioRouteFades), [{ fromOpacity: 0.3, toOpacity: 1, duration: 190 }], 'A normal-motion route change should invoke its fade.')
      await changingPage.emulateMedia({ reducedMotion: 'reduce' })
      await changingPage.waitForFunction(() => !document.getElementById('portfolio-content').getAnimations().some((animation) => animation.playState === 'running'))
      await assert.equal(await changingPage.locator('#portfolio-content').evaluate((element) => getComputedStyle(element).opacity), '1', 'Enabling reduced motion should cancel the active fade at full opacity.')
      await assert.deepEqual(await changingPage.evaluate(() => window.__portfolioRouteFades), [{ fromOpacity: 0.3, toOpacity: 1, duration: 190 }], 'Enabling reduced motion should cancel, not restart, the current fade.')
      await changingPage.close()

      const interruptedPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
      trackPage(interruptedPage)
      await interruptedPage.emulateMedia({ reducedMotion: 'no-preference' })
      await interruptedPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await settle(interruptedPage)
      await interruptedPage.locator('a[href="#education"]').click()
      await waitForScrollProgress(interruptedPage, 0)
      await interruptedPage.mouse.move(200, 400)
      await interruptedPage.mouse.wheel(0, 160)
      await waitForStableScroll(interruptedPage)
      const userInterruptedY = await interruptedPage.evaluate(() => window.scrollY)
      await assert.ok(userInterruptedY > 0, 'A real wheel gesture should interrupt the anchor motion at the user’s chosen position.')
      const educationDestinationY = await interruptedPage.locator('#education').evaluate((element) => element.getBoundingClientRect().top + window.scrollY - (Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0))
      await assert.ok(Math.abs(userInterruptedY - educationDestinationY) > 2, 'The wheel-interrupted position should remain distinct from the original anchor destination.')
      await interruptedPage.emulateMedia({ reducedMotion: 'reduce' })
      await waitForStableScroll(interruptedPage)
      await assert.ok(Math.abs(await interruptedPage.evaluate(() => window.scrollY) - userInterruptedY) <= 2, 'A later reduced-motion preference change should not revive a user-interrupted anchor target.')
      await interruptedPage.close()

      const keyboardInterruptPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
      trackPage(keyboardInterruptPage)
      await keyboardInterruptPage.emulateMedia({ reducedMotion: 'no-preference' })
      await keyboardInterruptPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await settle(keyboardInterruptPage)
      await keyboardInterruptPage.locator('a[href="#what-im-building"]').click()
      await waitForScrollProgress(keyboardInterruptPage, 0)
      await keyboardInterruptPage.keyboard.press('Shift+Tab')
      await keyboardInterruptPage.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      const tabInterruptedState = await keyboardInterruptPage.evaluate(() => ({
        y: window.scrollY,
        tagName: document.activeElement?.tagName,
        targetHasFocus: document.activeElement === document.getElementById('what-im-building'),
      }))
      await assert.equal(tabInterruptedState.tagName, 'A', 'Shift+Tab should move keyboard focus back to the previous in-page control.')
      await assert.equal(tabInterruptedState.targetHasFocus, false, 'Keyboard focus should leave the anchor target while its native scroll is interrupted.')
      await keyboardInterruptPage.emulateMedia({ reducedMotion: 'reduce' })
      await waitForStableScroll(keyboardInterruptPage)
      await assert.ok(Math.abs(await keyboardInterruptPage.evaluate(() => window.scrollY) - tabInterruptedState.y) <= 2, 'A later reduced-motion preference change should not snap focus navigation back to the interrupted anchor.')

      await keyboardInterruptPage.emulateMedia({ reducedMotion: 'no-preference' })
      const escapeStartY = await keyboardInterruptPage.evaluate(() => window.scrollY)
      await keyboardInterruptPage.locator('a[href="#education"]').evaluate((element) => element.click())
      await waitForScrollProgress(keyboardInterruptPage, escapeStartY)
      await keyboardInterruptPage.keyboard.press('Escape')
      await keyboardInterruptPage.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      const escapeInterruptedY = await keyboardInterruptPage.evaluate(() => window.scrollY)
      await keyboardInterruptPage.emulateMedia({ reducedMotion: 'reduce' })
      await waitForStableScroll(keyboardInterruptPage)
      await assert.ok(Math.abs(await keyboardInterruptPage.evaluate(() => window.scrollY) - escapeInterruptedY) <= 2, 'Escape should cancel the pending anchor target before reduced motion is enabled.')
      await keyboardInterruptPage.close()
    })

    await check('200% text scaling preserves readable, non-overlapping layouts from mobile to desktop', async () => {
      const zoomPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
      trackPage(zoomPage)
      await zoomPage.emulateMedia({ reducedMotion: 'reduce' })
      for (const viewport of [
        { width: 320, height: 568 },
        { width: 390, height: 844 },
        { width: 768, height: 1024 },
        { width: 1440, height: 900 },
      ]) {
        await zoomPage.setViewportSize(viewport)
        for (const [label, path] of Object.entries(sectionPaths)) {
          await zoomPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          await zoomPage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
          await settle(zoomPage)
          await zoomPage.waitForFunction(() => document.querySelector('[data-portfolio-toolbar]')?.dataset.portfolioStickyReady === 'true')
          const geometry = await zoomPage.evaluate(() => {
            const header = document.querySelector('[data-portfolio-toolbar]')
            const links = [...header.querySelectorAll('a[href]:not([href="#portfolio-content"])')]
              .filter((link) => link.getClientRects().length && getComputedStyle(link).visibility !== 'hidden')
              .map((link) => {
                const rect = link.getBoundingClientRect()
                return { name: link.getAttribute('aria-label') || link.textContent.trim(), left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }
              })
            const overlaps = []
            for (let first = 0; first < links.length; first += 1) {
              for (let second = first + 1; second < links.length; second += 1) {
                const a = links[first]
                const b = links[second]
                if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) overlaps.push(`${a.name} / ${b.name}`)
              }
            }
            return {
              width: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
              name: document.querySelector('h1')?.textContent.trim(),
              links,
              overlaps,
            }
          })
          await assert.ok(geometry.width <= viewport.width, `${label} at ${viewport.width}px should not overflow at 200% text.`)
          await assert.equal(geometry.name, 'Tran Ha Thu', 'The owner name should remain complete at 200% text.')
          await assert.deepEqual(geometry.overlaps, [], `${label} at ${viewport.width}px should not overlap header links at 200% text.`)
          await assert.ok(geometry.links.every(({ width, height }) => width >= 44 && height >= 44), `${label} at ${viewport.width}px should retain 44px header targets at 200% text.`)
          if (label === 'Projects' && viewport.width === 1440) {
            const cardCopy = await zoomPage.locator('#projects [data-project-card-copy]').evaluateAll((elements) => elements.map((element) => {
              const action = element.querySelector('a')
              const range = document.createRange()
              range.selectNodeContents(action)
              const lineTops = [...range.getClientRects()].map((rect) => Math.round(rect.top))
              return {
                width: element.getBoundingClientRect().width,
                actionText: action.textContent.replace(/\s+/g, ' ').trim(),
                actionLines: new Set(lineTops).size,
              }
            }))
            await assert.equal(cardCopy.length, 7, 'All seven standard project cards should remain in the Projects index at 200% text.')
            await assert.ok(cardCopy.every(({ width }) => width >= 320), `Earlier project cards should give their text a readable column at 1440px/200%, received ${cardCopy.map(({ width }) => Math.round(width)).join(', ')}px.`)
            await assert.ok(cardCopy.every(({ actionText, actionLines }) => actionText === 'View project' && actionLines === 1), 'Every earlier project action should stay readable on one line at 1440px/200%.')
          }
          if (label === 'Projects' && viewport.width === 320) {
            const narrowActions = await zoomPage.evaluate(() => {
              const geometryFor = (link) => {
                const label = link.querySelector('span') || link
                const range = document.createRange()
                range.selectNodeContents(label)
                const lineTops = [...range.getClientRects()].map((rect) => Math.round(rect.top))
                const rect = link.getBoundingClientRect()
                return {
                  text: link.textContent.replace(/\s+/g, ' ').trim(),
                  left: rect.left,
                  right: rect.right,
                  lines: new Set(lineTops).size,
                }
              }
              return {
                featured: [...document.querySelectorAll('#projects [data-project-index] a')]
                  .filter((link) => link.textContent.replace(/\s+/g, ' ').trim() === 'Explore project')
                  .map(geometryFor),
                earlier: [...document.querySelectorAll('#projects [data-project-card-copy] a')].map(geometryFor),
              }
            })
            await assert.equal(narrowActions.featured.length, 2, 'Both featured project actions should remain available at 320px/200%.')
            await assert.ok(narrowActions.featured.every(({ left, right, lines, text }) => text === 'Explore project' && left >= 0 && right <= viewport.width && lines >= 1 && lines <= 2), 'Featured project labels should fit in the viewport and wrap onto at most two whole-word lines at 320px/200%.')
            await assert.equal(narrowActions.earlier.length, 7, 'All seven standard project actions should remain available at 320px/200%.')
            await assert.ok(narrowActions.earlier.every(({ left, right, lines, text }) => text === 'View project' && left >= 0 && right <= viewport.width && lines === 1), 'Earlier project actions should stay inside the viewport and on one line at 320px/200%.')
          }
          if (label === 'Experience') {
            const heroGeometry = await zoomPage.evaluate(() => {
              const heading = document.querySelector('#experience-intro-heading')
              const card = document.querySelector('button[data-profile-card]')
              const range = document.createRange()
              range.selectNodeContents(heading)
              const headingRect = heading.getBoundingClientRect()
              const cardRect = card.getBoundingClientRect()
              const overlapsHeading = cardRect.left < headingRect.right - 1
                && cardRect.right > headingRect.left + 1
                && cardRect.top < headingRect.bottom - 1
                && cardRect.bottom > headingRect.top + 1
              return {
                headingWidth: heading.getBoundingClientRect().width,
                headingLines: range.getClientRects().length,
                cardLeft: cardRect.left,
                cardRight: cardRect.right,
                overlapsHeading,
              }
            })
            await assert.ok(heroGeometry.headingWidth >= Math.min(320, viewport.width * 0.5), `The Experience headline should have a usable text column at ${viewport.width}px/200%, received ${heroGeometry.headingWidth}px.`)
            await assert.ok(heroGeometry.headingLines <= 8, `The Experience headline should reflow as readable lines at ${viewport.width}px/200%, received ${heroGeometry.headingLines}.`)
            await assert.ok(heroGeometry.cardLeft >= 0 && heroGeometry.cardRight <= viewport.width, `The Experience profile card should fit the ${viewport.width}px viewport at 200% text.`)
            await assert.equal(heroGeometry.overlapsHeading, false, `The Experience profile card should not overlap the headline at ${viewport.width}px/200%.`)
            if (viewport.width === 320) {
              const wideFontHeadline = await zoomPage.locator('#experience-intro-heading').evaluate((heading) => {
                heading.style.fontFamily = 'Verdana, sans-serif'
                const range = document.createRange()
                range.selectNodeContents(heading)
                return { fontSize: parseFloat(getComputedStyle(heading).fontSize), lines: range.getClientRects().length }
              })
              await assert.equal(wideFontHeadline.fontSize, 64, 'The 320px headline should scale from 32px at 200% text.')
              await assert.ok(wideFontHeadline.lines <= 8, `The headline should remain within eight lines at 320px/200% with a wider font, received ${wideFontHeadline.lines}.`)
            }
            const toolbar = zoomPage.locator('[data-portfolio-toolbar]')
            if (viewport.width <= 390) {
              await zoomPage.waitForFunction(() => {
                const header = document.querySelector('[data-portfolio-toolbar]')
                return header?.dataset.portfolioStickyReady === 'true' && header.dataset.portfolioSticky === 'false'
              })
              await assert.notEqual(await toolbar.evaluate((element) => getComputedStyle(element).position), 'sticky', `An oversized ${viewport.width}px header should scroll with the document at 200% text.`)
            }
            const disclosure = zoomPage.locator('#experience details')
            const summary = disclosure.locator('summary')
            await summary.click()
            await assert.equal(await disclosure.evaluate((element) => element.open), true, 'The expanded-text experience disclosure should accept a real pointer click.')
            const summaryBounds = await summary.boundingBox()
            const actionBounds = await summary.locator('[data-earlier-experience-action]').boundingBox()
            await assert.ok(summaryBounds && actionBounds && Math.abs(actionBounds.x + actionBounds.width - summaryBounds.x - summaryBounds.width) <= 2, `The disclosure action should align with the right edge at 200% text and ${viewport.width}px.`)
            await assert.ok(await zoomPage.locator('#experience [data-experience-id="tiktok-intern"]').isVisible(), 'Earlier roles should be reachable below the oversized static header.')
            if (viewport.width <= 390) {
              await summary.press('Enter')
              await assert.equal(await disclosure.evaluate((element) => element.open), false, 'Enter should close the disclosure at 200% text.')
              await summary.press('Space')
              await assert.equal(await disclosure.evaluate((element) => element.open), true, 'Space should open the disclosure at 200% text.')
            }
            await settle(zoomPage)
            await assertVisibleTextFitsViewport(zoomPage, `Expanded Experience at 200% and ${viewport.width}px`, viewport.width)
            const expandedWidth = await zoomPage.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth))
            await assert.ok(expandedWidth <= viewport.width, `Expanded Experience should not overflow at 200% and ${viewport.width}px.`)
            await assertAllVisibleTargets(zoomPage, `Expanded Experience at 200% and ${viewport.width}px`)
          }
        }
      }

      await zoomPage.setViewportSize({ width: 320, height: 568 })
      for (const [project, path] of [
        ['My OpenClaw Lab', projectPaths.openclaw],
        ['Chinese Learning Toolkit', projectPaths['chinese-learning']],
        ['Trader’s Edge', projectPaths['traders-edge']],
      ]) {
        await zoomPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
        await zoomPage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
        await settle(zoomPage)
        await assertProjectRoute(zoomPage, project)
        const synopsis = caseStudySynopses[projectIds[project]]
        await assert.ok(await zoomPage.locator(`#project-${projectIds[project]}`).getByText(synopsis, { exact: true }).isVisible(), `${project} overview synopsis should remain readable at 320px/200%.`)
        const fullWriteupLink = zoomPage.getByRole('link', { name: `Read full project writeup for ${project}`, exact: true })
        await assert.ok(await fullWriteupLink.isVisible(), `${project} full-writeup action should remain available at 320px/200%.`)
        await assertWholeWords(fullWriteupLink, 'Read full project', `${project} full-writeup action at 320px/200%`)
        await assertVisibleTextFitsViewport(zoomPage, `${project} overview at 320px/200%`, 320)
        const width = await zoomPage.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth))
        await assert.ok(width <= 320, `${project} overview should not overflow at 320px/200%.`)
      }

      for (const viewport of [
        { width: 320, height: 568 },
        { width: 390, height: 844 },
        { width: 768, height: 1024 },
        { width: 1440, height: 900 },
      ]) {
        await zoomPage.setViewportSize(viewport)
        for (const [project, path] of [
          ['My OpenClaw Lab', projectInfoPaths.openclaw],
          ['Chinese Learning Toolkit', projectInfoPaths['chinese-learning']],
          ['Trader’s Edge', projectInfoPaths['traders-edge']],
        ]) {
          await zoomPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          await zoomPage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
          await settle(zoomPage)
          await assertProjectInfoRoute(zoomPage, project)
          await assertVisibleTextFitsViewport(zoomPage, `${project} at 200% and ${viewport.width}px`, viewport.width)
          const width = await zoomPage.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth))
          await assert.ok(width <= viewport.width, `${project} should not overflow at 200% and ${viewport.width}px.`)
          await assertAllVisibleTargets(zoomPage, `${project} at 200% and ${viewport.width}px`)
        }
      }

      for (const viewport of [
        { width: 320, height: 568 },
        { width: 390, height: 844 },
      ]) {
        await zoomPage.setViewportSize(viewport)
        for (const path of ['/projects/teleai/', '/projects/#project-teleai']) {
          await zoomPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          await zoomPage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
          await settle(zoomPage)
          await zoomPage.waitForFunction(() => {
            const header = document.querySelector('[data-portfolio-toolbar]')
            return header?.dataset.portfolioStickyReady === 'true' && header.dataset.portfolioSticky === 'false'
          })
          await assertProjectRoute(zoomPage, 'TeleAI')
          const clearance = await zoomPage.evaluate(() => {
            const header = document.querySelector('[data-portfolio-toolbar]').getBoundingClientRect()
            const heading = document.querySelector('#project-heading-teleai').getBoundingClientRect()
            return {
              scrollY: window.scrollY,
              overlap: header.top < heading.bottom && header.bottom > heading.top,
              headingTop: heading.top,
            }
          })
          await assert.equal(clearance.overlap, false, `${path} should not let a static enlarged header cover the project heading.`)
          if (path.includes('#')) {
            await assert.ok(clearance.scrollY > 0 && clearance.headingTop >= 0, 'A legacy project hash should scroll the static header away and expose its heading.')
          }
        }
      }
      await zoomPage.close()
    })

    await check('light and dark appearance preserve WCAG AA text and primary action contrast', async () => {
      const contrastPage = await browser.newPage({ viewport: { width: 1440, height: 900 } })
      trackPage(contrastPage)
      for (const colorScheme of ['light', 'dark']) {
        await contrastPage.emulateMedia({ colorScheme })
        await contrastPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
        await settle(contrastPage)
        const ratios = await contrastPage.evaluate(() => {
          const luminance = (value) => {
            const channels = value.match(/[\d.]+/g).slice(0, 3).map(Number).map((channel) => {
              const srgb = channel / 255
              return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
            })
            return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
          }
          const ratio = (foreground, background) => {
            const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
            return (values[0] + 0.05) / (values[1] + 0.05)
          }
          const mutedText = document.querySelector('#experience-intro-heading + div > p')
          const action = document.querySelector('[data-portfolio-toolbar] a.bg-action[href$=".pdf"]')
          const backgroundOf = (element) => {
            let current = element
            while (current && getComputedStyle(current).backgroundColor === 'rgba(0, 0, 0, 0)') current = current.parentElement
            return current ? getComputedStyle(current).backgroundColor : 'rgb(255, 255, 255)'
          }
          return {
            bodyText: ratio(getComputedStyle(mutedText).color, backgroundOf(mutedText)),
            action: ratio(getComputedStyle(action).color, getComputedStyle(action).backgroundColor),
          }
        })
        await assert.ok(ratios.bodyText >= 4.5, `${colorScheme} secondary body text should meet 4.5:1; measured ${ratios.bodyText.toFixed(2)}:1.`)
        await assert.ok(ratios.action >= 4.5, `${colorScheme} desktop Resume text should meet 4.5:1; measured ${ratios.action.toFixed(2)}:1.`)
      }
      for (const colorScheme of ['light', 'dark']) {
        await contrastPage.emulateMedia({ colorScheme, contrast: 'more' })
        const increasedContrast = await contrastPage.evaluate(() => {
          const luminance = (value) => value.match(/[\d.]+/g).slice(0, 3).map(Number).map((channel) => {
            const srgb = channel / 255
            return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
          }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0)
          const element = document.querySelector('#experience-intro-heading + div > p')
          let parent = element
          while (parent && getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)') parent = parent.parentElement
          const values = [luminance(getComputedStyle(element).color), luminance(getComputedStyle(parent).backgroundColor)].sort((a, b) => b - a)
          return (values[0] + 0.05) / (values[1] + 0.05)
        })
        await assert.ok(increasedContrast >= 7, `${colorScheme} increased-contrast text should reach 7:1; measured ${increasedContrast.toFixed(2)}:1.`)
      }
      await contrastPage.close()
    })

    await check('sticky header, skip link and ordinary keyboard navigation work at short viewports', async () => {
      const keyboardPage = await browser.newPage({ viewport: { width: 1024, height: 450 } })
      trackPage(keyboardPage)
      await keyboardPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const toolbar = keyboardPage.locator('[data-portfolio-toolbar]')
      await keyboardPage.waitForFunction(() => {
        const header = document.querySelector('[data-portfolio-toolbar]')
        return header?.dataset.portfolioStickyReady === 'true' && header.dataset.portfolioSticky === 'true'
      })
      await assert.equal(await toolbar.evaluate((element) => getComputedStyle(element).position), 'sticky')
      await assertAllVisibleTargets(keyboardPage, 'Short desktop viewport')
      const contactGroup = toolbar.getByRole('group', { name: 'Contact and social links' })
      await assert.equal(await contactGroup.count(), 1, 'The sticky header should expose one contact and social group.')
      const contactTargets = [
        ['Copy work email to clipboard', contactGroup.getByRole('button', { name: 'Copy work email to clipboard', exact: true })],
        ['GitHub', contactGroup.getByRole('link', { name: 'Tran Ha Thu on GitHub', exact: true })],
        ['LinkedIn', contactGroup.getByRole('link', { name: 'Tran Ha Thu on LinkedIn', exact: true })],
      ]
      for (const [label, target] of contactTargets) {
        await assert.ok(await target.isVisible(), `${label} should remain available in the sticky header.`)
      }

      await keyboardPage.keyboard.press('Tab')
      const skipLink = keyboardPage.locator('a[href="#portfolio-content"]')
      await assert.ok(await skipLink.evaluate((element) => element === document.activeElement), 'The skip link should be the first keyboard control.')
      await assert.notEqual(await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle), 'none', 'Keyboard focus should be visible on the skip link.')
      await keyboardPage.keyboard.press('Enter')
      await assert.ok(await keyboardPage.locator('#portfolio-content').evaluate((element) => element === document.activeElement), 'The skip link should focus the main content region.')

      const experienceLink = toolbar.getByRole('link', { name: 'Experience', exact: true })
      await experienceLink.focus()
      await experienceLink.press('Enter')
      await assertActiveView(keyboardPage, 'Experience')
      const projectsLink = toolbar.getByRole('link', { name: 'Projects', exact: true })
      await projectsLink.focus()
      await projectsLink.press('Enter')
      await assertActiveView(keyboardPage, 'Projects')
      const readingY = await scrollNaturallyTo(keyboardPage, 200)
      await assert.ok(readingY >= 200, 'The sticky-header check should scroll through real page content.')
      await assert.ok(Math.abs((await toolbar.boundingBox()).y) <= 1, 'The header should remain at viewport Y=0 after scrolling.')
      const headerTargets = [
        ['Experience', toolbar.getByRole('link', { name: 'Experience', exact: true })],
        ['Projects', toolbar.getByRole('link', { name: 'Projects', exact: true })],
        ['Skills', toolbar.getByRole('link', { name: 'Skills', exact: true })],
        ['Resume', toolbar.getByRole('link', { name: 'Resume', exact: true })],
        ...contactTargets,
      ]
      for (const [label, target] of headerTargets) {
        const bounds = await target.boundingBox()
        await assert.ok(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 450, `${label} should remain reachable within the short viewport.`)
      }
      await keyboardPage.close()
    })

    await check('the skip link stays clipped when hidden and fits at 320px with 200% text', async () => {
      const skipPage = await browser.newPage({ viewport: { width: 320, height: 568 } })
      trackPage(skipPage)
      await skipPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await skipPage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
      const skipLink = skipPage.locator('a[href="#portfolio-content"]')
      await skipLink.evaluate((element) => { element.style.fontFamily = 'Verdana, sans-serif' })
      await settle(skipPage)
      const hiddenGeometry = await skipLink.evaluate((element) => {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return {
          width: rect.width,
          height: rect.height,
          clip: style.clip,
          paddingTop: style.paddingTop,
          paddingRight: style.paddingRight,
          paddingBottom: style.paddingBottom,
          paddingLeft: style.paddingLeft,
        }
      })
      await assert.equal(hiddenGeometry.width, 1, 'The hidden skip link should retain its one-pixel clipped footprint.')
      await assert.equal(hiddenGeometry.height, 1, 'The hidden skip link should retain its one-pixel clipped footprint.')
      await assert.match(hiddenGeometry.clip, /rect\(/, 'The hidden skip link should remain clipped from visual layout.')
      await assert.deepEqual([hiddenGeometry.paddingTop, hiddenGeometry.paddingRight, hiddenGeometry.paddingBottom, hiddenGeometry.paddingLeft], ['0px', '0px', '0px', '0px'], 'The hidden skip link should not carry focus-only padding.')

      await skipPage.keyboard.press('Tab')
      await assert.ok(await skipLink.evaluate((element) => element === document.activeElement), 'The skip link should remain the first keyboard target.')
      await assert.notEqual(await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle), 'none', 'The focused skip link should show a visible focus outline.')
      const focusedGeometry = await skipLink.evaluate((element) => {
        const rect = element.getBoundingClientRect()
        const range = document.createRange()
        range.selectNodeContents(element)
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          text: [...range.getClientRects()].map(({ left, right }) => ({ left, right })),
        }
      })
      await assert.ok(focusedGeometry.left >= 0 && focusedGeometry.right <= 320 && focusedGeometry.top >= 0 && focusedGeometry.bottom <= 568, 'The focused skip target should fit inside the 320x568 viewport.')
      await assert.ok(focusedGeometry.width >= 44 && focusedGeometry.height >= 44, 'The focused skip link should remain at least 44px in both dimensions.')
      await assert.ok(focusedGeometry.text.length > 0 && focusedGeometry.text.every(({ left, right }) => left >= 0 && right <= 320), 'Every focused skip-link text line should stay within the viewport.')
      await assertVisibleTextFitsViewport(skipPage, 'Focused 320px/200% skip link', 320)
      await skipPage.keyboard.press('Enter')
      await assert.ok(await skipPage.locator('#portfolio-content').evaluate((element) => element === document.activeElement), 'Activating the focused skip link should focus the main content.')
      await skipPage.close()
    })

    await check('email copies to the clipboard with visible feedback, an honest failure path, and dismissible icon tips', async () => {
      const mobileContext = await browser.newContext({ viewport: { width: 320, height: 568 } })
      await mobileContext.grantPermissions(['clipboard-read', 'clipboard-write'], { origin })
      const mobilePage = await mobileContext.newPage()
      trackPage(mobilePage)
      await mobilePage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await settle(mobilePage)
      const group = mobilePage.locator('[data-portfolio-toolbar] [role="group"][aria-label="Contact and social links"]:visible')
      const copyButton = group.locator('button[data-copy-email]:visible')
      await assert.equal(await copyButton.count(), 1, 'The mobile header should expose one visible icon copy control.')
      await copyButton.click()
      const copiedMessage = 'My work email tranhathuwork@gmail.com has been copied to your clipboard!'
      await assert.equal(await mobilePage.locator('[data-copy-email-message]').innerText(), copiedMessage, 'Successful email copies should display the requested confirmation text.')
      await assert.equal(await mobilePage.locator('[data-copy-email-announcement]').getAttribute('role'), 'status', 'Success should be announced through a polite status region.')
      await assert.equal(await mobilePage.locator('[data-copy-email-announcement]').innerText(), copiedMessage)
      await assert.equal(await mobilePage.evaluate(() => navigator.clipboard.readText()), 'tranhathuwork@gmail.com', 'The copy control should write the work address to the real browser clipboard.')
      const successToast = mobilePage.locator('[data-copy-email-toast]')
      await assert.ok(await successToast.isVisible())
      const successBounds = await successToast.boundingBox()
      await assert.ok(successBounds && successBounds.x >= 0 && successBounds.y >= 0 && successBounds.x + successBounds.width <= 320 && successBounds.y + successBounds.height <= 568, `The mobile copy toast must fit inside the viewport, received ${JSON.stringify(successBounds)}.`)
      await assertEmailToastLayout(mobilePage, '320px mobile success', { maxHeight: 160 })
      const dismiss = successToast.getByRole('button', { name: 'Dismiss email copy message', exact: true })
      const dismissBounds = await dismiss.boundingBox()
      await assert.ok(dismissBounds && dismissBounds.width >= 44 && dismissBounds.height >= 44, 'The toast dismissal control should meet the minimum touch target.')
      const toastAxe = await new AxeBuilder({ page: mobilePage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      await assert.deepEqual(toastAxe.violations.map(({ id }) => id), [], 'The visible email success toast should pass the WCAG axe rules.')
      await dismiss.click()
      await assert.equal(await successToast.isVisible(), false, 'The success message should have a clear dismissal action.')
      await assert.ok(await copyButton.evaluate((element) => element === document.activeElement), 'Dismissing the success message should return keyboard focus to the copy control.')

      const tips = [
        ['Copy my email', 'button[data-copy-email]'],
        ['View my GitHub', 'a[aria-label="Tran Ha Thu on GitHub"]'],
        ['View my LinkedIn', 'a[aria-label="Tran Ha Thu on LinkedIn"]'],
      ]
      for (const [tooltipName, selector] of tips) {
        const target = group.locator(`${selector}:visible`)
        await target.focus()
        const tooltip = group.getByRole('tooltip', { name: tooltipName, exact: true })
        await assert.ok(await tooltip.isVisible(), `Keyboard focus should show the “${tooltipName}” tooltip.`)
        const describedBy = await target.getAttribute('aria-describedby')
        await assert.equal(await tooltip.getAttribute('id'), describedBy, `${tooltipName} should be referenced by its icon accessibly.`)
        const tooltipBounds = await tooltip.boundingBox()
        await assert.ok(tooltipBounds && tooltipBounds.x >= 0 && tooltipBounds.x + tooltipBounds.width <= 320, `${tooltipName} should stay inside the narrow viewport.`)
        await mobilePage.keyboard.press('Escape')
        await assert.equal(await tooltip.isVisible(), false, `${tooltipName} should dismiss with Escape.`)
      }
      const githubIcon = group.locator('a[aria-label="Tran Ha Thu on GitHub"]:visible')
      await githubIcon.hover()
      await assert.ok(await group.getByRole('tooltip', { name: 'View my GitHub', exact: true }).isVisible(), 'Pointer hover should also reveal the GitHub tooltip.')
      await mobilePage.setViewportSize({ width: 390, height: 844 })
      await mobilePage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
      await settle(mobilePage)
      await githubIcon.hover()
      const zoomedTooltip = await group.getByRole('tooltip', { name: 'View my GitHub', exact: true }).boundingBox()
      await assert.ok(zoomedTooltip && zoomedTooltip.x >= 0 && zoomedTooltip.x + zoomedTooltip.width <= 390, `The GitHub tooltip should remain in the viewport at 200% text: ${JSON.stringify(zoomedTooltip)}.`)
      await mobileContext.close()

      const deniedContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
      const deniedPage = await deniedContext.newPage()
      trackPage(deniedPage)
      await deniedPage.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: { writeText: async () => { throw new DOMException('Clipboard access denied.', 'NotAllowedError') } },
        })
        document.execCommand = () => false
      })
      await deniedPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const deniedGroup = deniedPage.locator('[data-portfolio-toolbar] [role="group"][aria-label="Contact and social links"]:visible')
      const deniedCopyButton = deniedGroup.locator('button[data-copy-email]:visible')
      await assert.equal(await deniedCopyButton.count(), 1, 'The denied clipboard path should activate the visible header copy control.')
      await deniedCopyButton.click()
      const failureMessage = deniedPage.locator('[data-copy-email-message]')
      await assert.match(await failureMessage.innerText(), /copy failed/i, 'Clipboard denial should show an honest failure message.')
      await assert.equal(await deniedPage.locator('[data-copy-email-announcement]').getAttribute('role'), 'alert', 'Clipboard failure should be announced assertively.')
      await assert.ok(await failureMessage.getByText('tranhathuwork@gmail.com', { exact: true }).isVisible(), 'Clipboard failure should leave the work address visible and selectable.')
      await assert.notEqual(await failureMessage.innerText(), copiedMessage, 'Clipboard denial must never report successful copying.')
      await assertEmailToastLayout(deniedPage, '390px clipboard failure', { maxHeight: 180 })
      const failureDismiss = deniedPage.locator('[data-copy-email-toast]').getByRole('button', { name: 'Dismiss email copy message', exact: true })
      await failureDismiss.focus()
      await failureDismiss.press('Enter')
      await assert.equal(await deniedPage.locator('[data-copy-email-toast]').isVisible(), false, 'The honest clipboard failure should remain dismissible by keyboard.')
      await assert.ok(await deniedCopyButton.evaluate((element) => element === document.activeElement), 'Dismissing clipboard failure should return focus to its copy control.')
      await deniedContext.close()
    })

    await check('email toast keeps its compact row layout in light and dark mobile and desktop views, including 320px at 200%', async () => {
      const copiedMessage = 'My work email tranhathuwork@gmail.com has been copied to your clipboard!'
      for (const colorScheme of ['light', 'dark']) {
        for (const viewport of [
          { label: 'mobile', width: 390, height: 844, maxHeight: 110 },
          { label: 'desktop', width: 1440, height: 900, maxHeight: 110 },
        ]) {
          const toastContext = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, colorScheme })
          await toastContext.grantPermissions(['clipboard-read', 'clipboard-write'], { origin })
          const toastPage = await toastContext.newPage()
          trackPage(toastPage)
          await toastPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
          await settle(toastPage)
          const toolbarGroup = toastPage.locator('[data-portfolio-toolbar] [role="group"][aria-label="Contact and social links"]:visible')
          const copyButton = toolbarGroup.locator('button[data-copy-email]:visible')
          await assert.equal(await copyButton.count(), 1, `${colorScheme} ${viewport.label} should expose one visible copy control.`)
          await copyButton.click()
          await assert.equal(await toastPage.locator('[data-copy-email-message]').innerText(), copiedMessage, `${colorScheme} ${viewport.label} should display the exact success message.`)
          await assert.equal(await toastPage.locator('[data-copy-email-announcement]').getAttribute('role'), 'status')
          const layout = await assertEmailToastLayout(toastPage, `${colorScheme} ${viewport.label}`, { maxHeight: viewport.maxHeight })
          await assert.equal(await toastPage.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches), colorScheme === 'dark')
          if (viewport.label === 'mobile') await assert.ok(layout.toast.width <= 390, 'The mobile toast should preserve its narrow viewport width.')
          const dismiss = toastPage.locator('[data-copy-email-toast]').getByRole('button', { name: 'Dismiss email copy message', exact: true })
          await dismiss.focus()
          await dismiss.press('Space')
          await assert.equal(await toastPage.locator('[data-copy-email-toast]').isVisible(), false, `${colorScheme} ${viewport.label} toast should dismiss with Space.`)
          await assert.ok(await copyButton.evaluate((element) => element === document.activeElement), `${colorScheme} ${viewport.label} dismissal should restore focus to the copy control.`)
          await toastContext.close()
        }
      }

      const zoomContext = await browser.newContext({ viewport: { width: 320, height: 568 } })
      await zoomContext.grantPermissions(['clipboard-read', 'clipboard-write'], { origin })
      const zoomPage = await zoomContext.newPage()
      trackPage(zoomPage)
      await zoomPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await zoomPage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
      await settle(zoomPage)
      const zoomGroup = zoomPage.locator('[data-portfolio-toolbar] [role="group"][aria-label="Contact and social links"]:visible')
      const zoomCopyButton = zoomGroup.locator('button[data-copy-email]:visible')
      await zoomCopyButton.click()
      await assert.equal(await zoomPage.locator('[data-copy-email-message]').innerText(), copiedMessage)
      const zoomLayout = await assertEmailToastLayout(zoomPage, '320px/200% mobile success', { maxTopInset: 34 })
      await assert.ok(zoomLayout.toast.height < 568, `The 320px/200% toast should fit vertically: ${JSON.stringify(zoomLayout.toast)}.`)
      await assertVisibleTextFitsViewport(zoomPage, '320px/200% email toast', 320)
      const zoomDismiss = zoomPage.locator('[data-copy-email-toast]').getByRole('button', { name: 'Dismiss email copy message', exact: true })
      await zoomDismiss.focus()
      await zoomDismiss.press('Enter')
      await assert.equal(await zoomPage.locator('[data-copy-email-toast]').isVisible(), false, 'The zoomed toast should remain keyboard dismissible.')
      await assert.ok(await zoomCopyButton.evaluate((element) => element === document.activeElement), 'The 320px/200% dismissal should return focus to the copy control.')
      await zoomContext.close()
    })

    await check('WCAG 2.1 A/AA and WCAG 2.2 AA axe scans on twenty desktop and mobile views', async () => {
      for (const viewport of [
        { label: 'desktop', width: 1440, height: 900 },
        { label: 'mobile', width: 390, height: 844 },
      ]) {
        const scanContext = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
        const scanPage = await scanContext.newPage()
        trackPage(scanPage)
        for (const [label, path] of [
          ...Object.entries(sectionPaths),
          ['FoROOM detail', '/projects/foroom/'],
          ['OpenClaw overview', projectPaths.openclaw],
          ['OpenClaw case study', projectInfoPaths.openclaw],
          ['Chinese Learning overview', projectPaths['chinese-learning']],
          ['Chinese Learning case study', projectInfoPaths['chinese-learning']],
          ['Trader’s Edge overview', projectPaths['traders-edge']],
          ['Trader’s Edge case study', projectInfoPaths['traders-edge']],
        ]) {
          await scanPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          if (label.endsWith('detail')) {
            await assertProjectRoute(scanPage, 'FoROOM')
            await assertRouteMetadata(scanPage, path)
          } else if (label.endsWith('overview')) {
            const project = label === 'OpenClaw overview' ? 'My OpenClaw Lab' : label === 'Chinese Learning overview' ? 'Chinese Learning Toolkit' : 'Trader’s Edge'
            await assertProjectRoute(scanPage, project)
            await assertRouteMetadata(scanPage, path)
          } else if (label.endsWith('case study')) {
            const project = label === 'OpenClaw case study' ? 'My OpenClaw Lab' : label === 'Chinese Learning case study' ? 'Chinese Learning Toolkit' : 'Trader’s Edge'
            await assertProjectInfoRoute(scanPage, project)
            await assertRouteMetadata(scanPage, path)
          } else {
            await assertActiveView(scanPage, label)
          }
          const result = await new AxeBuilder({ page: scanPage })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .analyze()
          if (result.violations.length) {
            const details = result.violations.map(({ id, impact, help, nodes }) => ({
              id, impact, help,
              nodes: nodes.slice(0, 10).map(({ target, html, failureSummary }) => ({ target, html, failureSummary })),
            }))
            throw new Error(`${viewport.label} ${label} has axe violations:\n${JSON.stringify(details, null, 2)}`)
          }
        }
        await scanContext.close()
      }
    })

    await check('expanded experience remains accessible in light and dark desktop and mobile views', async () => {
      for (const colorScheme of ['light', 'dark']) {
        for (const viewport of [
          { label: 'desktop', width: 1440, height: 900 },
          { label: 'mobile', width: 390, height: 844 },
        ]) {
          const scanContext = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
          const scanPage = await scanContext.newPage()
          trackPage(scanPage)
          await scanPage.emulateMedia({ colorScheme })
          await scanPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
          await scanPage.locator('#experience summary').click()
          await settle(scanPage)
          await assertExperienceTimeline(scanPage, { openState: true })
          const result = await new AxeBuilder({ page: scanPage })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .analyze()
          if (result.violations.length) {
            const details = result.violations.map(({ id, impact, help, nodes }) => ({
              id, impact, help,
              nodes: nodes.slice(0, 10).map(({ target, html, failureSummary }) => ({ target, html, failureSummary })),
            }))
          throw new Error(`${colorScheme} expanded Experience ${viewport.label} has axe violations:\n${JSON.stringify(details, null, 2)}`)
          }
          await scanContext.close()
        }
      }
    })

    await check('runtime console, hydration, uncaught errors and local asset requests', async () => {
      await assert.deepEqual(consoleErrors, [], 'Browser console should not report errors or hydration mismatch warnings.')
      await assert.deepEqual(pageErrors, [], 'Browser should not report uncaught page errors.')
      await assert.deepEqual(internalRequestFailures, [], 'Same-origin page and asset requests should succeed.')
    })

    if (externalRequestFailures.size) {
      console.warn(`External requests failed or were unavailable (${externalRequestFailures.size}):`)
      for (const failure of externalRequestFailures) console.warn(`  ${failure}`)
    } else {
      console.log('No external request failures observed.')
    }
    await context.close()
  } finally {
    await browser.close()
  }
}

await run()
if (failures.length) {
  console.error(`\n${failures.length} UI QA check(s) failed.`)
  process.exitCode = 1
} else {
  console.log('\nUI checks passed: fifteen canonical routes, six compatibility aliases, overview/writeup navigation, nine project cards, profile-card geometry, resume byte identity, clipboard/toast/tooltips, keyboard focus, no-JavaScript content, responsive layouts, axe and runtime requests.')
}
