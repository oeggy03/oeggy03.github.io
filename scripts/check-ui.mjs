import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { portfolioRoutePaths } from '../src/navigation/routes.js'

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
  Overview: '/', Projects: '/projects/', Experience: '/experience/', Skills: '/skills/',
}
const terminalIndexAliases = portfolioRoutePaths.map((route) => ({
  alias: route === '/' ? '/index.html' : `${route}index.html`,
  route,
}))
const projectNames = ['FoROOM', 'Buddy4Good', 'Eggbot', 'TeleAI', 'FoodHero', 'Portfolio Website']
const projectIds = {
  FoROOM: 'foroom', Buddy4Good: 'buddy4good', Eggbot: 'eggbot',
  TeleAI: 'teleai', FoodHero: 'foodhero', 'Portfolio Website': 'portfolio',
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
  about: '/',
  aboutSection: '/',
  contact: '/',
  contactSec: '/',
  experiencesSec: '/experience/',
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
}
const experienceOutboundLinks = [
  'https://nus.edu.sg/',
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

async function assertProjectRoute(page, project) {
  const path = `/projects/${projectIds[project]}/`
  await assertCleanRoute(page, path)
  await settle(page)
  await assert.equal(await activeSection(page, 'projects').count(), 1, 'Project details should belong to the visible Projects section.')
  await assert.ok(await page.locator(`#project-heading-${projectIds[project]}`).isVisible(), `${project} detail heading should be visible.`)
  const selectedProject = page.locator(`nav[aria-label="Choose a project"] a[href="${path}"][aria-current="page"]`)
  await assert.equal(await selectedProject.count(), 1, `${project} should be the selected real project link.`)
}

async function assertExperienceTimeline(page) {
  const items = page.locator('#experience ol[aria-label="Experience in reverse chronological order"] > li')
  await assert.equal(await items.count(), 8, 'Experience should render all eight supplied entries.')
  const ids = await items.evaluateAll((entries) => entries.map((entry) => entry.getAttribute('data-experience-id')))
  await assert.deepEqual(ids, expectedExperienceIds, 'Experience should put the current role first, then order completed roles by end date descending.')
  const dateTimes = await items.evaluateAll((entries) => entries.map((entry) => [...entry.querySelectorAll('time')].map((time) => time.getAttribute('datetime'))))
  await assert.deepEqual(dateTimes, expectedExperienceDateTimes, 'Every timeline role should preserve its confirmed machine-readable month bounds.')
  const text = await activeSection(page, 'experience').innerText()
  const dateRanges = experienceDateRanges(text)
  await assert.deepEqual(dateRanges, expectedExperienceDates, 'Experience should preserve every supplied date period in timeline order.')
  await assert.equal((text.match(/TikTok/g) || []).length, 2, 'Both TikTok roles should appear as distinct entries.')
  await assert.ok(text.includes('Backend Engineer'), 'The current TikTok Backend Engineer title should be visible.')
  await assert.ok(text.includes('Artificial Intelligence Intern'), 'The A*STAR role should retain its supplied title.')
  await assert.match(text, /average.{0,30}88% accuracy/i, 'The HDB entry should retain the supplied average accuracy metric.')
}

async function assertSelectedLinkStyle(page, label) {
  const selected = page.locator('nav[aria-label="Portfolio sections"]:visible a[aria-current="page"]')
  await assert.ok(await selected.isVisible(), `${label} should visibly identify the active section.`)
  const style = await selected.evaluate((element) => ({
    children: [...element.children].map((child) => child.tagName.toLowerCase()),
    before: getComputedStyle(element, '::before').content,
    after: getComputedStyle(element, '::after').content,
    background: getComputedStyle(element).backgroundColor,
  }))
  await assert.deepEqual(style.children, ['svg', 'span'], `${label} active link should contain its icon and label.`)
  await assert.equal(style.before, 'none', `${label} active link should not add a dot before the label.`)
  await assert.equal(style.after, 'none', `${label} active link should not add a dot after the label.`)
  await assert.notEqual(style.background, 'rgba(0, 0, 0, 0)', `${label} active link should retain its background highlight.`)
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
      assert.equal(portfolioRoutePaths.length, 10, 'The static route matrix should cover four views and six projects.')
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
      await assertActiveView(page, 'Overview')
      const sections = await navLinks(page).evaluateAll((links) => links.map((link) => ({ href: link.getAttribute('href'), text: link.textContent.trim() })))
      await assert.deepEqual(sections.map(({ text }) => text), ['Overview', 'Projects', 'Experience', 'Skills'])
      await assert.deepEqual(sections.map(({ href }) => href), Object.values(sectionPaths), 'Section navigation must use real clean-route anchors.')
      const hashAnchors = await page.locator('a[href^="#"]').count()
      await assert.equal(hashAnchors, 0, 'The rendered site should not author hash navigation links.')

      for (const label of ['Projects', 'Experience', 'Skills', 'Overview']) {
        await navLinks(page).getByText(label, { exact: true }).click()
        await assertActiveView(page, label)
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
        const sectionId = path.startsWith('/projects/') ? 'projects' : path.slice(1, -1) || 'overview'
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
      await navLinks(page).getByText('Experience', { exact: true }).click()
      await assertActiveView(page, 'Experience')
      await page.goBack()
      await page.waitForFunction(() => window.location.pathname === '/projects/')
      await assert.equal(await activeSection(page, 'projects').count(), 1)
      await settle(page)
      const restoredY = await page.evaluate(() => window.scrollY)
      const maximum = await page.evaluate(() => document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight)
      await assert.ok(Math.abs(restoredY - Math.min(readingY, maximum)) <= 2, `Back should restore the Projects reading offset (${readingY}px), received ${restoredY}px.`)
      await page.goForward()
      await assertActiveView(page, 'Experience')
    })

    await check('project routes, filters, selected links and project history', async () => {
      await page.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Projects')
      const chooser = page.getByRole('navigation', { name: 'Choose a project' })
      await assert.equal(await chooser.getByRole('link').count(), 6, 'All six projects should remain directly linkable.')
      for (const project of projectNames) {
        const link = chooser.getByRole('link', { name: new RegExp(project, 'i') })
        await assert.equal(await link.getAttribute('href'), `/projects/${projectIds[project]}/`, `${project} should link to its clean detail route.`)
      }

      const aiFilter = page.getByRole('button', { name: /^AI & bots/ })
      await aiFilter.click()
      await assertProjectRoute(page, 'Eggbot')
      await assert.equal(await aiFilter.getAttribute('aria-pressed'), 'true')
      const teleAi = page.getByRole('navigation', { name: 'Choose a project' }).getByRole('link', { name: /TeleAI/i })
      await teleAi.click()
      await assertProjectRoute(page, 'TeleAI')
      const activeCategory = await page.getByRole('group', { name: 'Filter projects' }).getByRole('button').evaluateAll((buttons) => buttons.find((button) => button.getAttribute('aria-pressed') === 'true')?.textContent.trim())
      await assert.match(activeCategory, /^AI & bots/)
      await page.goBack()
      await assertProjectRoute(page, 'Eggbot')
      await page.goForward()
      await assertProjectRoute(page, 'TeleAI')

      const backendFilter = page.getByRole('button', { name: /^Backend/ })
      await backendFilter.click()
      await assertProjectRoute(page, 'FoROOM')
      await assert.equal(await backendFilter.getAttribute('aria-pressed'), 'true')

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
      }
    })

    await check('experience content is chronological and destination links remain available', async () => {
      await page.goto(urlFor('/experience/'), { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Experience')
      const experienceSection = activeSection(page, 'experience')
      const text = await experienceSection.innerText()
      for (const company of experiences) await assert.ok(text.includes(company), `Experience should show ${company}.`)
      const dateRanges = experienceDateRanges(text)
      await assert.deepEqual(dateRanges, expectedExperienceDates)
      await assertExperienceTimeline(page)
      await assert.ok(text.indexOf('National University of Singapore') < text.indexOf('GIC'), 'The NUS teaching role ending in Dec 2025 should precede the GIC role ending in Sep 2025.')
      for (const href of experienceOutboundLinks) await assert.ok(await experienceSection.locator(`a[href="${href}"]`).count() > 0, `Missing employer destination ${href}.`)
    })

    await check('Overview facts and shared profile actions', async () => {
      await page.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Overview')
      const overview = activeSection(page, 'overview')
      const text = (await overview.innerText()).toLowerCase()
      for (const fact of [
        'software engineer', 'tiktok', 'national university of singapore', 'bachelor of computing', 'computer science',
        '2022', '2026', '4.6/5.0', 'first class honours', 'distinction in software engineering', "dean's list",
      ]) await assert.ok(text.includes(fact), `Overview should include the confirmed fact: ${fact}.`)
      for (const project of projectNames) await assert.ok(!text.includes(project.toLowerCase()), `Overview should not contain ${project}.`)
      await assert.equal(await overview.locator('img[src*="proj_images"]').count(), 0, 'Overview should not contain project images.')
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
        const sectionId = path === '/' ? 'overview' : path.startsWith('/projects/') ? 'projects' : path.slice(1, -1)
        await assert.equal(await staticPage.locator(`main section#${sectionId}:not([hidden])`).count(), 1, `${path} should show its matching section without JavaScript.`)
        const projectId = path.match(/^\/projects\/([^/]+)\/$/)?.[1]
        if (projectId && projectId !== 'index') {
          await assert.ok(await staticPage.locator(`#project-heading-${projectId}`).isVisible(), `${path} should show its matching project without JavaScript.`)
          for (const href of projectOutboundLinksById[projectId] || []) {
            await assert.ok(await staticPage.locator(`a[href="${href}"]`).count() > 0, `No-JavaScript ${path} should expose ${href}.`)
          }
        }
        if (path === '/experience/') await assertExperienceTimeline(staticPage)
        if (path === '/skills/') {
          for (const skill of skills) {
            await assert.ok(await staticPage.locator('#skills').getByText(skill, { exact: true }).first().isVisible(), `No-JavaScript Skills should expose ${skill}.`)
          }
        }
        if (path === '/projects/') {
          for (const project of projectNames) {
            const chooserLink = staticPage.locator(`nav[aria-label="Choose a project"] a[href="/projects/${projectIds[project]}/"]`)
            await assert.ok(await chooserLink.isVisible(), `No-JavaScript project chooser should expose ${project}.`)
          }
        }
        await staticPage.reload({ waitUntil: 'domcontentloaded' })
        await assert.equal(new URL(staticPage.url()).pathname, path, `No-JavaScript refresh should remain on ${path}.`)
      }

      for (const { alias, route } of terminalIndexAliases) {
        await staticPage.goto(urlFor(alias), { waitUntil: 'domcontentloaded' })
        await assert.equal(new URL(staticPage.url()).pathname, alias, `No-JavaScript ${alias} should retain its static file URL.`)
        await assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://www.tranhathu.com${route}`, `${alias} should serve the canonical metadata for ${route}.`)
        const sectionId = route === '/' ? 'overview' : route.startsWith('/projects/') ? 'projects' : route.slice(1, -1)
        await assert.equal(await staticPage.locator(`main section#${sectionId}:not([hidden])`).count(), 1, `No-JavaScript ${alias} should show its matching view.`)
        const projectId = route.match(/^\/projects\/([^/]+)\/$/)?.[1]
        if (projectId) {
          await assert.ok(await staticPage.locator(`#project-heading-${projectId}`).isVisible(), `No-JavaScript ${alias} should expose its project detail.`)
        }
      }

      await staticPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const sections = await staticPage.locator('main section[id]').evaluateAll((items) => items.map((item) => item.id))
      await assert.deepEqual(sections, ['overview', 'projects', 'experience', 'skills'])
      for (const alias of ['about', 'aboutSection', 'contact', 'contactSec', 'experiencesSec', 'projectsSec']) {
        await assert.equal(await staticPage.locator(`[id="${alias}"]`).count(), 1, `No-JavaScript output should retain the legacy ${alias} target.`)
      }
      const staticOverview = staticPage.locator('#overview')
      const overviewImages = await staticOverview.locator('img').evaluateAll((images) => images.map((image) => image.currentSrc || image.src))
      const projectImages = await staticPage.locator('[id^="project-"] img').evaluateAll((images) => images.map((image) => image.currentSrc || image.src))
      for (const source of overviewImages) await assert.ok(!projectImages.includes(source), `Overview should not reuse project imagery: ${source}.`)
      const authoredHashLinks = await staticPage.locator('a[href^="#"]').count()
      await assert.equal(authoredHashLinks, 0, 'Static navigation should use actual routes, not authored hash links.')
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
          const size = await layoutPage.evaluate(() => ({
            viewport: window.innerWidth,
            document: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          }))
          if (size.document > size.viewport) overflow.push(`${label} at ${viewport.width}×${viewport.height}: ${size.document}px document width`)
        }
      }
      await assert.deepEqual(overflow, [], `Horizontal overflow cases:\n${overflow.map((item) => `  ${item}`).join('\n')}`)

      await layoutPage.setViewportSize({ width: 390, height: 844 })
      await layoutPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const mobileNavigation = layoutPage.locator('nav[aria-label="Portfolio sections"]:visible')
      await assert.equal(await mobileNavigation.count(), 1)
      const mobileLinks = await mobileNavigation.locator('a[href]').all()
      await assert.equal(mobileLinks.length, 4)
      const gridColumns = await mobileNavigation.locator('div').first().evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)
      await assert.equal(gridColumns, 4, 'Mobile section navigation should expose four columns.')
      for (const link of mobileLinks) {
        const bounds = await link.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Mobile navigation links should be at least 44px square.')
        await assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= 844, 'All mobile section links should be visible at the top.')
      }
      await assertSelectedLinkStyle(layoutPage, 'Mobile')
      await assertSocialActionsVisible(layoutPage, '390px mobile top')

      await layoutPage.goto(urlFor('/projects/'), { waitUntil: 'domcontentloaded' })
      const filters = await layoutPage.getByRole('group', { name: 'Filter projects' }).getByRole('button').all()
      await assert.equal(filters.length, 4)
      for (const control of filters) {
        const bounds = await control.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Project filters should be at least 44px square.')
      }
      const projectLinks = await layoutPage.getByRole('navigation', { name: 'Choose a project' }).getByRole('link').all()
      for (const link of projectLinks) {
        const bounds = await link.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Project links should be at least 44px square.')
      }

      await layoutPage.setViewportSize({ width: 320, height: 568 })
      await layoutPage.goto(urlFor('/projects/teleai/'), { waitUntil: 'domcontentloaded' })
      await assertProjectRoute(layoutPage, 'TeleAI')
      const stickyNav = layoutPage.locator('[data-portfolio-mobile-navigation]')
      const navBounds = await stickyNav.boundingBox()
      const projectHeading = await layoutPage.locator('#project-heading-teleai').boundingBox()
      await assert.ok(navBounds && projectHeading && projectHeading.y >= navBounds.y + navBounds.height + 16, 'A direct project heading should clear mobile sticky controls.')
      const browseLink = layoutPage.getByRole('link', { name: /Browse projects/i })
      await assert.ok(await browseLink.isVisible(), 'A project detail should keep a Browse projects link nearby on mobile.')
      await browseLink.click()
      await assertActiveView(layoutPage, 'Projects')
      await assert.ok(await layoutPage.getByRole('navigation', { name: 'Choose a project' }).isVisible())
      await layoutPage.emulateMedia({ reducedMotion: 'reduce' })
      const navStyle = await layoutPage.locator('nav[aria-label="Portfolio sections"]:visible a[href="/projects/"]').evaluate((element) => ({
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        transition: getComputedStyle(element).transitionProperty,
      }))
      await assert.ok(navStyle.reduced)
      await assert.equal(navStyle.transition, 'none', 'Section navigation should respect reduced motion.')
      await layoutPage.close()
    })

    await check('desktop rail reachability and keyboard route focus', async () => {
      const backdropPage = await browser.newPage({ viewport: { width: 1440, height: 900 } })
      trackPage(backdropPage)
      await backdropPage.goto(urlFor('/experience/'), { waitUntil: 'domcontentloaded' })
      const fullPageImage = await backdropPage.screenshot({ fullPage: true })
      const backdrop = await backdropPage.evaluate(async (data) => {
        const image = new Image()
        image.src = `data:image/png;base64,${data}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)
        const pixel = (y) => Array.from(context.getImageData(20, y, 1, 1).data).slice(0, 3)
        return { height: image.height, top: pixel(20), belowViewport: pixel(920) }
      }, fullPageImage.toString('base64'))
      await assert.ok(backdrop.height > 920, 'The timeline backdrop check should include content below the viewport.')
      for (const [label, color] of [['rail', backdrop.top], ['rail below first viewport', backdrop.belowViewport]]) {
        const brightness = color.reduce((sum, channel) => sum + channel, 0) / 3
        await assert.ok(brightness < 140, `${label} should remain dark through the full page; sampled RGB ${color.join(',')}.`)
      }
      await backdropPage.close()

      const desktopPage = await browser.newPage({ viewport: { width: 1024, height: 450 } })
      trackPage(desktopPage)
      await desktopPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const rail = desktopPage.locator('[data-portfolio-sidebar]')
      const metrics = await rail.evaluate((element) => ({ scrollHeight: element.scrollHeight, clientHeight: element.clientHeight }))
      await assert.ok(metrics.scrollHeight > metrics.clientHeight, 'The short desktop rail should scroll internally to reach its contents.')
      const initialDocumentY = await desktopPage.evaluate(() => window.scrollY)
      await desktopPage.mouse.move(100, 430)
      for (let step = 0; step < 14; step += 1) {
        const current = await rail.evaluate((element) => ({ y: element.scrollTop, max: element.scrollHeight - element.clientHeight }))
        if (current.y >= current.max - 2) break
        await desktopPage.mouse.wheel(0, 500)
        await desktopPage.waitForTimeout(25)
      }
      const finalRail = await rail.evaluate((element) => ({ y: element.scrollTop, max: element.scrollHeight - element.clientHeight }))
      await assert.ok(finalRail.y > 0 && finalRail.y >= finalRail.max - 2, 'Short rail scrolling should expose the complete sidebar.')
      await assert.equal(await desktopPage.evaluate(() => window.scrollY), initialDocumentY, 'Scrolling the sidebar should not move the page.')
      const linkedin = rail.getByRole('link', { name: /on LinkedIn/i })
      const linkedinBounds = await linkedin.boundingBox()
      await assert.ok(linkedinBounds && linkedinBounds.y >= 0 && linkedinBounds.y + linkedinBounds.height <= 450, 'Short rail scrolling should expose its final profile actions.')
      const skillsLink = rail.locator('nav[aria-label="Portfolio sections"] a[href="/skills/"]')
      await skillsLink.focus()
      const skillsBounds = await skillsLink.boundingBox()
      await assert.ok(skillsBounds && skillsBounds.y >= 0 && skillsBounds.y + skillsBounds.height <= 450, 'Keyboard focus should reveal section links inside the short rail.')
      await assert.equal(await desktopPage.evaluate(() => window.scrollY), initialDocumentY, 'Focusing a short rail link should not move the document.')

      await desktopPage.setViewportSize({ width: 1440, height: 900 })
      await desktopPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      const toolbar = desktopPage.locator('[data-portfolio-toolbar]')
      await assert.equal(await toolbar.evaluate((element) => getComputedStyle(element).position), 'sticky', 'The desktop toolbar should remain sticky while reading.')
      await scrollNaturallyTo(desktopPage, 200)
      await assert.ok(Math.abs((await toolbar.boundingBox()).y) <= 1, 'The desktop toolbar should stay at the viewport top after scrolling.')
      await desktopPage.goto(urlFor('/'), { waitUntil: 'domcontentloaded' })
      await assertSelectedLinkStyle(desktopPage, 'Desktop')
      const overviewLink = desktopPage.locator('nav[aria-label="Portfolio sections"]:visible a[href="/"]')
      await overviewLink.focus()
      await overviewLink.press('ArrowRight')
      await assertActiveView(desktopPage, 'Projects')
      const focusedProjectNav = await desktopPage.locator('nav[aria-label="Portfolio sections"]:visible a[aria-current="page"]').evaluate((element) => element === document.activeElement)
      await assert.ok(focusedProjectNav, 'Arrow navigation should move keyboard focus with the selected route link.')
      await desktopPage.locator('nav[aria-label="Portfolio sections"]:visible a[aria-current="page"]').press('End')
      await assertActiveView(desktopPage, 'Skills')
      const focusedSkillsNav = await desktopPage.locator('nav[aria-label="Portfolio sections"]:visible a[aria-current="page"]').evaluate((element) => element === document.activeElement)
      await assert.ok(focusedSkillsNav, 'End navigation should keep focus on the selected Skills link.')
      await desktopPage.close()
    })

    await check('WCAG 2.1 A/AA and WCAG 2.2 AA axe scans on eight route views', async () => {
      for (const viewport of [
        { label: 'desktop', width: 1440, height: 900 },
        { label: 'mobile', width: 390, height: 844 },
      ]) {
        const scanContext = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
        const scanPage = await scanContext.newPage()
        trackPage(scanPage)
        for (const [label, path] of Object.entries(sectionPaths)) {
          await scanPage.goto(urlFor(path), { waitUntil: 'domcontentloaded' })
          await assertActiveView(scanPage, label)
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
  console.log('\nUI checks passed: ten clean routes, legacy hydration, history, filters, keyboard focus, no-JavaScript pages, responsive layouts, axe and runtime requests.')
}
