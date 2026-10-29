import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
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
const compatibilityIndexAliases = portfolioCompatibilityRoutePaths.map((route) => ({
  alias: `${route}index.html`, route: '/',
}))
const compatibilityAliases = [
  ...portfolioCompatibilityRoutePaths.map((route) => ({ alias: route, route: '/' })),
  ...compatibilityIndexAliases,
]
const projectNames = ['FoROOM', 'Buddy4Good', 'Eggbot', 'TeleAI', 'FoodHero', 'Portfolio Website', 'My OpenClaw Lab', 'Chinese Learning Toolkit']
const projectIds = {
  FoROOM: 'foroom', Buddy4Good: 'buddy4good', Eggbot: 'eggbot',
  TeleAI: 'teleai', FoodHero: 'foodhero', 'Portfolio Website': 'portfolio',
  'My OpenClaw Lab': 'openclaw', 'Chinese Learning Toolkit': 'chinese-learning',
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
    for (let frame = 0; frame < 4; frame += 1) await new Promise(requestAnimationFrame)
    await new Promise((resolve) => setTimeout(resolve, 100))
  })
}

function activeSection(page, sectionId) {
  return page.locator(`main section#${sectionId}:not([hidden])`)
}

function navLinks(page) {
  return page.locator('nav[aria-label="Portfolio sections"]:visible a[href]')
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
  const path = `/projects/${projectIds[project]}/`
  await assertCleanRoute(page, path)
  await settle(page)
  await assert.equal(await activeSection(page, 'projects').count(), 1, 'Project details should belong to the visible Projects section.')
  await assert.ok(await page.locator(`#project-heading-${projectIds[project]}`).isVisible(), `${project} detail heading should be visible.`)
  const selectedProject = page.locator(`nav[aria-label="Choose a project"] a[href="${path}"][aria-current="page"]`)
  if (await selectedProject.count()) await assert.equal(await selectedProject.count(), 1, `${project} should be the selected real project link.`)
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
  await assert.ok(text.includes('Backend Engineer'), 'The current TikTok Backend Engineer title should be visible.')
  await assert.ok(text.includes('Artificial Intelligence Intern'), 'The A*STAR role should retain its supplied title.')
  await assert.match(text, /average.{0,30}88% accuracy/i, 'The HDB entry should retain the supplied average accuracy metric.')

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
      if (!walker.currentNode.textContent.trim()) continue
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
  for (const [name, href] of [
    ['Email Tran Ha Thu', 'mailto:tranhathuwork@gmail.com'],
    ['Tran Ha Thu on GitHub', 'https://github.com/oeggy03'],
    ['Tran Ha Thu on LinkedIn', 'https://www.linkedin.com/in/tran-ha-thu/'],
  ]) {
    const link = group.getByRole('link', { name, exact: true })
    await assert.equal(await link.getAttribute('href'), href, `${label} ${name} destination should be preserved.`)
    const bounds = await link.boundingBox()
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
      assert.equal(portfolioRoutePaths.length, 11, 'The static route matrix should cover three views and eight projects.')
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
    })

    await check('terminal index.html aliases hydrate to their matching clean routes', async () => {
      for (const { alias, route } of terminalIndexAliases) {
        await page.goto(urlFor(alias), { waitUntil: 'domcontentloaded' })
        await page.waitForFunction((expected) => window.location.pathname === expected && window.location.hash === '', route)
        const label = Object.entries(sectionPaths).find(([, sectionRoute]) => sectionRoute === route)?.[0]
        if (label) {
          await assertActiveView(page, label)
          await assertRouteMetadata(page, route)
        } else {
          const projectId = route.match(/^\/projects\/([^/]+)\/$/)?.[1]
          const project = Object.entries(projectIds).find(([, id]) => id === projectId)?.[0]
          await assert.ok(project, `${alias} should map to a known project route.`)
          await assertProjectRoute(page, project)
        }
      }
    })

    await check('real links provide clean route navigation and open new tabs', async () => {
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Experience')
      const sections = await navLinks(page).evaluateAll((links) => links.map((link) => ({ href: link.getAttribute('href'), text: link.textContent.trim() })))
      await assert.deepEqual(sections.map(({ text }) => text), ['Experience', 'Projects', 'Skills'])
      await assert.deepEqual(sections.map(({ href }) => href), Object.values(sectionPaths), 'Section navigation must use real clean-route anchors.')
      await assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href'))), ['#portfolio-content', '#education', '#what-im-building'], 'Only the skip link and explicit Experience in-page links may use anchors.')

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
        await assertActiveView(page, 'Experience')
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
      for (const [fragment, path] of Object.entries(legacyRoutes)) {
        await page.goto(`${urlFor('/')}#${fragment}`, { waitUntil: 'domcontentloaded' })
        await page.waitForFunction((expected) => window.location.pathname === expected && window.location.hash === '', path)
        await settle(page)
        await assert.equal(new URL(page.url()).pathname, path, `#${fragment} should map to ${path}.`)
        const sectionId = path.startsWith('/projects/') ? 'projects' : path.slice(1, -1) || 'experience'
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
      const cards = index.locator('a[href^="/projects/"]')
      await assert.equal(await cards.count(), 8, 'All eight project cards should be directly linkable from the index.')
      const filters = page.getByRole('group', { name: 'Filter projects' })
      const categoryCounts = ['All', 'Backend', 'AI & bots', 'Frontend']
      const expectedCounts = [8, 2, 5, 1]
      for (let index = 0; index < categoryCounts.length; index += 1) {
        const categoryButton = filters.getByRole('button').nth(index)
        await assert.equal((await categoryButton.innerText()).replace(/\s+/g, ' ').trim().replace(/\D/g, ''), String(expectedCounts[index]), `${categoryCounts[index]} should show its correct project count.`)
        await assert.equal((await categoryButton.innerText()).replace(String(expectedCounts[index]), '').trim(), categoryCounts[index])
      }
      for (const project of projectNames) {
        const link = index.locator(`a[href="/projects/${projectIds[project]}/"]`)
        await assert.equal(await link.getAttribute('href'), `/projects/${projectIds[project]}/`, `${project} should link to its clean detail route.`)
      }

      const aiFilter = page.getByRole('button', { name: /^AI & bots/ })
      await aiFilter.click()
      await assert.equal(new URL(page.url()).pathname, '/projects/', 'Filtering should not navigate to a project detail.')
      await assert.equal(await aiFilter.getAttribute('aria-pressed'), 'true')
      await assert.equal(await cards.count(), 5, 'AI & bots should filter to five project cards.')
      const aiCardOrder = await cards.evaluateAll((links) => links.map((link) => link.getAttribute('href')))
      await assert.deepEqual(aiCardOrder.slice(0, 2), ['/projects/openclaw/', '/projects/chinese-learning/'], 'Featured projects should lead the filtered grid.')
      const scrolledY = await scrollNaturallyTo(page, 150)
      await assert.ok(scrolledY > 0, 'The filtered index should retain a real scroll position before opening a case study.')
      await index.locator('a[href="/projects/openclaw/"]').click()
      await assertProjectRoute(page, 'My OpenClaw Lab')
      const caseHeadingTop = await page.locator('#project-heading-openclaw').evaluate((element) => element.getBoundingClientRect().top)
      await assert.ok(caseHeadingTop >= 0 && caseHeadingTop < 400, 'Opening a long-form project from a scrolled index should align its title near the viewport top.')
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
      await assert.equal(await cards.count(), 2)
      await assert.equal(await backendFilter.getAttribute('aria-pressed'), 'true')
      const frontendFilter = page.getByRole('button', { name: /^Frontend/ })
      await frontendFilter.click()
      await assert.equal(await cards.count(), 1, 'Frontend should filter to the one supplied project.')
      await page.getByRole('button', { name: /^All/ }).click()
      await assert.equal(await cards.count(), 8)

      await page.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      for (const project of projectNames) {
        await page.goto(urlFor(`/projects/${projectIds[project]}/`), { waitUntil: 'domcontentloaded' })
        await assertProjectRoute(page, project)
        const heading = page.locator(`#project-heading-${projectIds[project]}`)
        await heading.focus()
        await assert.ok(await heading.evaluate((element) => element === document.activeElement), `${project} heading should remain keyboard focusable.`)
        for (const href of projectOutboundLinksById[projectIds[project]]) {
          await assert.ok(await page.locator(`a[href="${href}"]`).count() > 0, `Missing ${project} destination ${href}.`)
        }
        const imagesByProject = {
          'My OpenClaw Lab': [
            ['A Shopee cart showing one Tecware EX2 mouse.', 1230, 636],
            ['OpenClaw conversation about comparing gaming mice and adding a Tecware EX2 to the cart.', 608, 726],
            ['Shopee cart showing one Tecware EX2 mouse.', 1230, 636],
          ],
          'Chinese Learning Toolkit': [
            ['A daily Telegram message with a sample of collected Chinese vocabulary.', 533, 257],
            ['Telegram message showing a sample of daily Chinese vocabulary with readings and meanings.', 533, 257],
          ],
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
        if (project === 'My OpenClaw Lab') {
          const architecture = page.locator('#architecture-openclaw').locator('..')
          await assert.equal(await architecture.locator('ul').count(), 1, 'OpenClaw architecture should be presented as connected components without a false sequence.')
          await assert.equal(await architecture.locator('ol').count(), 0)
        }
        if (project === 'Chinese Learning Toolkit') {
          const architecture = page.locator('#architecture-chinese-learning').locator('..')
          await assert.equal(await architecture.locator('ol').count(), 1, 'The Chinese-learning workflow should retain its ordered flow.')
        }
      }

      await page.goto(urlFor('/projects/foroom/'), { waitUntil: 'domcontentloaded' })
      const chooser = page.getByRole('navigation', { name: 'Choose a project' })
      await assert.equal(await chooser.getByRole('link').count(), 8, 'The existing detail explorer should offer all eight direct project routes.')
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

    await check('Experience facts and shared profile actions', async () => {
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Experience')
      const experience = activeSection(page, 'experience')
      const text = (await experience.innerText()).toLowerCase()
      for (const fact of [
        'backend engineer', 'tiktok', 'national university of singapore', 'bachelor of computing', 'computer science',
        '2022', '2026', '4.6/5.0', 'first class honours', 'distinction in software engineering', "dean's list",
      ]) await assert.ok(text.includes(fact), `Experience should include the confirmed fact: ${fact}.`)
      await assert.equal(await experience.getByRole('heading', { name: 'I build useful and scalable software.', exact: true }).count(), 1, 'Experience should use the requested headline exactly.')
      await assert.ok(text.includes('hey, i’m ha thu, a backend engineer and graduate of the national university of singapore.'), 'Experience should retain the requested friendly introduction.')
      await assert.ok(text.includes('i’m committed to building practical, useful software with the future in mind'), 'Experience should include the supplied purpose statement.')
      await assert.ok(text.includes('i enjoy experimenting with new technologies along the way'), 'Experience should include the supplied interest in experimenting.')
      for (const project of projectNames.slice(0, 6)) await assert.ok(!text.includes(project.toLowerCase()), `Experience should not contain older project ${project}.`)
      await assert.equal(await experience.locator('img[src*="proj_images"]').count(), 0, 'Experience should not contain project images.')

      const education = experience.locator('#education')
      const educationTeaser = experience.getByRole('link', { name: 'NUS Computer Science graduate Education', exact: true })
      await assert.equal(await educationTeaser.count(), 1, 'The visible Education teaser should provide its complete visible text as the accessible link name.')
      const educationPeriod = education.getByText('Aug 2022 – May 2026', { exact: true })
      const educationDateStyle = await educationPeriod.evaluate((element) => ({ size: parseFloat(getComputedStyle(element).fontSize), weight: parseFloat(getComputedStyle(element).fontWeight) }))
      await assert.ok(educationDateStyle.size >= 18 && educationDateStyle.weight >= 500, 'The education dates should be distinct and legible at 18px or larger.')
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
        const teaserBounds = await page.locator('a[href="#education"]').boundingBox()
        await assert.ok(teaserBounds && teaserBounds.y >= 0 && teaserBounds.y + teaserBounds.height <= viewport.height, `The Education teaser should fit in the initial ${viewport.width}x${viewport.height} viewport.`)
      }
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await page.locator('a[href="#education"]').click()
      await assert.equal(new URL(page.url()).pathname, '/', 'Education should remain an in-page link rather than a routed view.')
      await assert.equal(new URL(page.url()).hash, '#education', 'Education should use its native fragment target.')
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
      await assert.ok(currentDates.size >= 18 && currentDates.weight >= 500, 'Experience dates should use at least 18px medium type.')
      await assertSocialActionsVisible(page, 'Desktop')

      const resume = page.locator('[data-portfolio-toolbar]').getByRole('link', { name: 'Resume', exact: true })
      await assert.ok(await resume.isVisible(), 'The shared toolbar should expose Resume.')
      const resumeResponse = await context.request.get(new URL(await resume.getAttribute('href'), baseUrl).href)
      await assert.equal(resumeResponse.status(), 200, 'Resume should resolve to a built PDF.')
      await assert.match(resumeResponse.headers()['content-type'] || '', /application\/pdf/i)
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
        const sectionId = path === '/' ? 'experience' : path.startsWith('/projects/') ? 'projects' : path.slice(1, -1)
        await assert.equal(await staticPage.locator(`main section#${sectionId}:not([hidden])`).count(), 1, `${path} should show its matching section without JavaScript.`)
        const projectId = path.match(/^\/projects\/([^/]+)\/$/)?.[1]
        if (projectId && projectId !== 'index') {
          await assert.ok(await staticPage.locator(`#project-heading-${projectId}`).isVisible(), `${path} should show its matching project without JavaScript.`)
          for (const href of projectOutboundLinksById[projectId] || []) {
            await assert.ok(await staticPage.locator(`a[href="${href}"]`).count() > 0, `No-JavaScript ${path} should expose ${href}.`)
          }
          if (projectId === 'openclaw' || projectId === 'chinese-learning') {
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
          await staticPage.locator('a[href="#education"]').click()
          await assert.equal(new URL(staticPage.url()).hash, '#education', 'A native Education anchor should work without JavaScript.')
          await assert.ok(await staticPage.locator('#education-heading').isVisible(), 'The Education heading should remain visible after its native anchor is followed.')
          await assert.ok(await staticPage.getByRole('heading', { name: 'Interests', exact: true }).isVisible(), 'The Education section should retain the supplied Interests heading without JavaScript.')
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
            const cardLink = staticPage.locator(`#projects a[href="/projects/${projectIds[project]}/"]`)
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
        const sectionId = route === '/' ? 'experience' : route.startsWith('/projects/') ? 'projects' : route.slice(1, -1)
        await assert.equal(await staticPage.locator(`main section#${sectionId}:not([hidden])`).count(), 1, `No-JavaScript ${alias} should show its matching view.`)
        const projectId = route.match(/^\/projects\/([^/]+)\/$/)?.[1]
        if (projectId) {
          await assert.ok(await staticPage.locator(`#project-heading-${projectId}`).isVisible(), `No-JavaScript ${alias} should expose its project detail.`)
        }
      }

      for (const { alias, route } of compatibilityIndexAliases) {
        await staticPage.goto(urlFor(alias), { waitUntil: 'domcontentloaded' })
        await assert.equal(new URL(staticPage.url()).pathname, alias, `No-JavaScript ${alias} should keep its static compatibility URL.`)
        await assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://www.tranhathu.com${route}`)
        await assert.ok(await staticPage.locator('#experience').isVisible(), `${alias} should keep the Experience readable without JavaScript.`)
        await assertExperienceTimeline(staticPage)
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
      await assert.deepEqual(authoredHashLinks, ['#portfolio-content', '#education', '#what-im-building'], 'Static output may use only the native skip and Experience in-page anchors.')
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
        for (const path of ['/projects/openclaw/', '/projects/chinese-learning/']) {
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
      const projectLinks = await layoutPage.locator('#projects [data-project-index] a[href^="/projects/"]').all()
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

    await check('200% text scaling preserves readable, non-overlapping layouts from mobile to desktop', async () => {
      const zoomPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
      trackPage(zoomPage)
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
              const action = element.querySelector('a[href^="/projects/"]')
              const range = document.createRange()
              range.selectNodeContents(action)
              const lineTops = [...range.getClientRects()].map((rect) => Math.round(rect.top))
              return {
                width: element.getBoundingClientRect().width,
                actionText: action.textContent.replace(/\s+/g, ' ').trim(),
                actionLines: new Set(lineTops).size,
              }
            }))
            await assert.equal(cardCopy.length, 6, 'All six earlier project cards should remain in the Projects index at 200% text.')
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
            await assert.equal(narrowActions.earlier.length, 6, 'All six earlier project actions should remain available at 320px/200%.')
            await assert.ok(narrowActions.earlier.every(({ left, right, lines, text }) => text === 'View project' && left >= 0 && right <= viewport.width && lines === 1), 'Earlier project actions should stay inside the viewport and on one line at 320px/200%.')
          }
          if (label === 'Experience') {
            const heroGeometry = await zoomPage.evaluate(() => {
              const heading = document.querySelector('#experience-intro-heading')
              const portrait = document.querySelector('img[alt="Ha Thu outdoors with a camera"]')
              const range = document.createRange()
              range.selectNodeContents(heading)
              return {
                headingWidth: heading.getBoundingClientRect().width,
                headingLines: range.getClientRects().length,
                portraitWidth: portrait.getBoundingClientRect().width,
              }
            })
            await assert.ok(heroGeometry.headingWidth >= Math.min(320, viewport.width * 0.5), `The Experience headline should have a usable text column at ${viewport.width}px/200%, received ${heroGeometry.headingWidth}px.`)
            await assert.ok(heroGeometry.headingLines <= 8, `The Experience headline should reflow as readable lines at ${viewport.width}px/200%, received ${heroGeometry.headingLines}.`)
            await assert.ok(heroGeometry.portraitWidth <= viewport.width * 0.4, `The Experience portrait should leave room for text at ${viewport.width}px/200%.`)
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

      for (const viewport of [
        { width: 320, height: 568 },
        { width: 390, height: 844 },
        { width: 768, height: 1024 },
        { width: 1440, height: 900 },
      ]) {
        await zoomPage.setViewportSize(viewport)
        for (const [project, path] of [
          ['My OpenClaw Lab', '/projects/openclaw/'],
          ['Chinese Learning Toolkit', '/projects/chinese-learning/'],
        ]) {
          await zoomPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          await zoomPage.evaluate(() => { document.documentElement.style.fontSize = '200%' })
          await settle(zoomPage)
          await assertProjectRoute(zoomPage, project)
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
          const mutedText = document.querySelector('#experience section p:last-child')
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
          const element = document.querySelector('#experience section p:last-child')
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
      for (const label of [/^Email Tran Ha Thu$/, /on GitHub/i, /on LinkedIn/i]) {
        await assert.ok(await toolbar.getByRole('link', { name: label }).isVisible(), `${String(label)} should remain available in the header.`)
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
      for (const label of ['Experience', 'Projects', 'Skills', 'Resume', /^Email Tran Ha Thu$/, /on GitHub/i, /on LinkedIn/i]) {
        const link = toolbar.getByRole('link', { name: label })
        const bounds = await link.boundingBox()
        await assert.ok(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 450, `${String(label)} should remain reachable within the short viewport.`)
      }
      await keyboardPage.close()
    })

    await check('WCAG 2.1 A/AA and WCAG 2.2 AA axe scans on twelve desktop and mobile views', async () => {
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
          ['OpenClaw case study', '/projects/openclaw/'],
          ['Chinese Learning case study', '/projects/chinese-learning/'],
        ]) {
          await scanPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          if (label.endsWith('detail') || label.endsWith('case study')) {
            const project = label === 'FoROOM detail' ? 'FoROOM' : label === 'OpenClaw case study' ? 'My OpenClaw Lab' : 'Chinese Learning Toolkit'
            await assertProjectRoute(scanPage, project)
            await assertRouteMetadata(scanPage, path)
          } else {
            await assertActiveView(scanPage, label)
          }
          const result = await new AxeBuilder({ page: scanPage })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .analyze()
          if (result.violations.length) {
            const details = result.violations.map(({ id, impact, help, nodes }) => ({
              id, impact, help, targets: nodes.flatMap((node) => node.target).slice(0, 10),
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
              id, impact, help, targets: nodes.flatMap((node) => node.target).slice(0, 10),
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
  console.log('\nUI checks passed: eleven canonical routes, compatibility and legacy hydration, anchor and route history, eight project cards, keyboard focus, no-JavaScript content, responsive layouts, axe and runtime requests.')
}
