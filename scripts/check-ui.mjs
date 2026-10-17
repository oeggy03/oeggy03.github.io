import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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

const views = ['Overview', 'Projects', 'Experience', 'Skills', 'About', 'Contact']
const legacyHashes = {
  aboutSection: 'About',
  experiencesSec: 'Experience',
  projectsSec: 'Projects',
  contactSec: 'Contact',
}
const projectNames = ['FoROOM', 'Buddy4Good', 'Eggbot', 'TeleAI', 'FoodHero', 'Portfolio Website']
const experienceNames = [
  'Housing Development Board (HDB)',
  'CareForWe (Healthtech startup)',
  'National University of Singapore',
  'Eastspring Investments Singapore',
  'A*STAR - Agency for Science, Technology and Research',
]
const coreSkills = [
  'Git', 'Object-oriented programming', 'HTML', 'CSS', 'JavaScript', 'React', 'Go',
  'Express.js', 'MySQL', 'PostgreSQL', 'Microsoft SQL Server', 'Java', 'Python', 'C++',
]
const projectIds = {
  FoROOM: 'foroom',
  Buddy4Good: 'buddy4good',
  Eggbot: 'eggbot',
  TeleAI: 'teleai',
  FoodHero: 'foodhero',
  'Portfolio Website': 'portfolio',
}
const projectCategories = {
  FoROOM: 'Backend',
  Buddy4Good: 'Backend',
  Eggbot: 'AI & bots',
  TeleAI: 'AI & bots',
  FoodHero: 'AI & bots',
  'Portfolio Website': 'Frontend',
}
const failures = []
const consoleErrors = []
const pageErrors = []
const internalRequestFailures = []
const externalRequestFailures = new Set()
const origin = new URL(baseUrl).origin

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

async function openPage(browser, options = {}) {
  const context = await browser.newContext(options)
  const page = await context.newPage()
  trackPage(page)
  return { context, page }
}

async function chooseView(page, label) {
  const tab = page.getByRole('tab', { name: label, exact: true })
  await assert.equal(await tab.count(), 1, `Expected one visible ${label} tab`)
  await tab.click()
  await page.waitForFunction((expected) => {
    const selected = document.querySelector('[role="tab"][aria-selected="true"]')
    return selected?.textContent?.includes(expected)
  }, label)
  await assert.equal(await tab.getAttribute('aria-selected'), 'true', `${label} tab should be selected`)
  await assertActiveView(page, label)
  return tab
}

async function assertActiveView(page, label) {
  const selected = page.getByRole('tab', { name: label, exact: true })
  await page.waitForFunction((expected) => {
    const active = document.querySelector('[role="tab"][aria-selected="true"]')
    return active?.textContent?.includes(expected)
  }, label)
  await assert.equal(await selected.getAttribute('aria-selected'), 'true', `Expected ${label} to be active`)
  const panel = page.getByRole('tabpanel')
  await assert.equal(await panel.count(), 1, 'Exactly one view panel should be visible')
  const selectedId = await page.locator('[role="tab"][aria-selected="true"]:visible').getAttribute('id')
  await assert.equal(await panel.getAttribute('aria-labelledby'), selectedId, 'The visible panel should name its selected visible tab')
}

async function assertSelectedProject(page, project) {
  const selection = page.getByRole('button', { name: new RegExp(project, 'i') })
  await assert.equal(await selection.getAttribute('aria-pressed'), 'true', `${project} should be the selected project`)
  await assert.equal(await page.locator(`#project-${projectIds[project]}`).count(), 1)
}

async function assertProjectFilterCoherent(page, project) {
  await assertSelectedProject(page, project)
  const selected = await page.getByRole('button', { name: /^(All|Backend|AI & bots|Frontend)/ }).evaluateAll((buttons) => {
    const button = buttons.find((candidate) => candidate.getAttribute('aria-pressed') === 'true')
    return button?.textContent?.trim().replace(/\d+$/, '').trim() || null
  })
  await assert.ok(selected === 'All' || selected === projectCategories[project], `Selected filter ${selected} should include ${project}`)
}

async function assertMobileNavigationAndTarget(page, target) {
  await page.locator(target).scrollIntoViewIfNeeded()
  const nav = page.getByRole('navigation', { name: 'Portfolio sections' }).last()
  const navBounds = await nav.boundingBox()
  await assert.ok(navBounds && navBounds.y >= 0 && navBounds.y + navBounds.height <= page.viewportSize().height, 'Mobile navigation should remain in the viewport after scrolling')
  const tabs = await nav.getByRole('tab').all()
  await assert.equal(tabs.length, 6, 'All six mobile navigation selectors should remain available after scrolling')
  for (const tab of tabs) {
    const bounds = await tab.boundingBox()
    await assert.ok(bounds && bounds.y >= navBounds.y && bounds.y + bounds.height <= navBounds.y + navBounds.height, 'Every mobile navigation selector should remain in view')
  }
  const targetBounds = await page.locator(target).boundingBox()
  await assert.ok(targetBounds && targetBounds.y >= navBounds.y + navBounds.height, 'The selected heading or detail should clear the sticky navigation')
}

async function run() {
  const browser = await chromium.launch({ headless: true, ...(browserPath ? { executablePath: browserPath } : {}) })
  try {
    const { context, page } = await openPage(browser, { viewport: { width: 1440, height: 900 } })
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })

    await check('six-view navigation and refresh/history behavior', async () => {
      const tabs = page.getByRole('tab')
      await assert.equal(await tabs.count(), 6, 'The visible navigation should contain six tabs')
      await assertActiveView(page, 'Overview')

      for (const label of views) {
        await chooseView(page, label)
        const panel = page.getByRole('tabpanel')
        await assert.ok(await panel.isVisible(), `${label} panel should be visible`)
      }

      await chooseView(page, 'Overview')
      await chooseView(page, 'Projects')
      await page.goBack()
      await assertActiveView(page, 'Overview')
      await page.goForward()
      await assertActiveView(page, 'Projects')

      await page.goto(`${baseUrl}#about`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'About')
      await page.reload({ waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'About')

      for (const [fragment, label] of Object.entries(legacyHashes)) {
        await page.goto(`${baseUrl}#${fragment}`, { waitUntil: 'domcontentloaded' })
        await assertActiveView(page, label)
        await assert.equal(new URL(page.url()).hash, `#${label.toLowerCase()}`, `${fragment} should resolve to the canonical view hash`)
      }
    })

    await check('keyboard navigation across the six views', async () => {
      await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
      let tab = page.getByRole('tab', { name: 'Overview', exact: true })
      await tab.focus()
      await tab.press('ArrowRight')
      await assertActiveView(page, 'Projects')
      await page.getByRole('tab', { name: 'Projects', exact: true }).press('ArrowDown')
      await assertActiveView(page, 'Experience')
      await page.getByRole('tab', { name: 'Experience', exact: true }).press('Home')
      await assertActiveView(page, 'Overview')
      await page.getByRole('tab', { name: 'Overview', exact: true }).press('End')
      await assertActiveView(page, 'Contact')
    })

    await check('overview project proof point and mobile-sized calls to action', async () => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
      const featuredImage = page.getByAltText('FoROOM discussion forum interface').first()
      const desktopBounds = await featuredImage.boundingBox()
      await assert.ok(desktopBounds && desktopBounds.y < 900 && desktopBounds.y + desktopBounds.height > 0, 'A project image should be visible in the 1440×900 overview')
      await assert.ok(await page.getByText(/React interface.*Go API.*MySQL/i).count() > 0 || await page.getByLabel(/FoROOM project architecture/i).count() > 0, 'Overview should show project implementation evidence')

      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
      for (const label of [/View projects/i, /Get in touch/i]) {
        const action = page.getByRole('link', { name: label }).first()
        await assert.ok(await action.isVisible(), `Overview action ${label} should be visible on mobile`)
        const bounds = await action.boundingBox()
        await assert.ok(bounds && bounds.y <= 844 * 1.5, `Overview action ${label} should be reachable without a long mobile scroll`)
      }
    })

    await check('project filters, selection, content and repository links', async () => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(`${baseUrl}#projects`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Projects')

      const chooser = page.getByRole('navigation', { name: 'Choose a project' })
      await assert.equal(await chooser.getByRole('button').count(), 6)
      for (const project of projectNames) {
        const selector = chooser.getByRole('button', { name: new RegExp(project, 'i') })
        await assert.ok(await selector.isVisible(), `${project} should be listed`)
        await selector.click()
        await assertSelectedProject(page, project)
      }

      await page.getByRole('button', { name: /^AI & bots/ }).click()
      await assert.equal(await chooser.getByRole('button').count(), 3)
      for (const title of ['Eggbot', 'TeleAI', 'FoodHero']) await assert.ok(await chooser.getByRole('button', { name: new RegExp(title, 'i') }).count() === 1)
      await assert.equal(await chooser.getByRole('button', { name: /FoROOM/i }).count(), 0)

      await chooser.getByRole('button', { name: /TeleAI/i }).click()
      await assertSelectedProject(page, 'TeleAI')
      const teleAiDetail = page.locator('#project-teleai')
      await assert.ok(await teleAiDetail.getByText(/OpenCV, TensorFlow and the Keras/i).count() > 0, 'TeleAI should retain its original TensorFlow/Keras description')
      await assert.ok(await teleAiDetail.getByRole('link', { name: /TeleAI GitHub repository/i }).count() === 1)

      await page.getByRole('button', { name: /^Backend/ }).click()
      await assert.equal(await chooser.getByRole('button').count(), 2)
      await assert.ok(await chooser.getByRole('button', { name: /FoROOM/i }).isVisible())
      await assert.ok(await chooser.getByRole('button', { name: /Buddy4Good/i }).isVisible())
      await assertSelectedProject(page, 'FoROOM')
      const foRoomDetail = page.locator('#project-foroom')
      const codeLink = foRoomDetail.getByRole('link', { name: /View code/i })
      await assert.equal(await codeLink.getAttribute('href'), 'https://github.com/oeggy03/cvwo-backend', 'FoROOM View code should open its back-end repository')
      for (const label of ['Learn more on Devpost', 'Front-end GitHub repository', 'Back-end GitHub repository']) {
        await assert.ok(await foRoomDetail.getByRole('link', { name: label, exact: true }).count() === 1, `FoROOM should retain ${label}`)
      }

      await page.getByRole('button', { name: /^Frontend/ }).click()
      await assert.equal(await chooser.getByRole('button').count(), 1)
      await assert.ok(await chooser.getByRole('button', { name: /Portfolio Website/i }).isVisible())
    })

    await check('Skills project links open and preserve deep project hashes', async () => {
      await page.goto(`${baseUrl}#skills`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Skills')
      const eggbotLink = page.getByRole('link', { name: 'Eggbot', exact: true }).first()
      await eggbotLink.click()
      await assertActiveView(page, 'Projects')
      await assert.equal(new URL(page.url()).hash, '#project-eggbot')
      await assertProjectFilterCoherent(page, 'Eggbot')
      await page.goBack()
      await assertActiveView(page, 'Skills')

      const teleAiLink = page.getByRole('link', { name: 'TeleAI', exact: true }).first()
      await teleAiLink.click()
      await assertActiveView(page, 'Projects')
      await assert.equal(new URL(page.url()).hash, '#project-teleai')
      await assertProjectFilterCoherent(page, 'TeleAI')

      await page.goBack()
      await assertActiveView(page, 'Skills')
      await page.goto(`${baseUrl}#project-teleai`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Projects')
      await assertProjectFilterCoherent(page, 'TeleAI')
      await page.reload({ waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Projects')
      await assertProjectFilterCoherent(page, 'TeleAI')
    })

    await check('skills are readable and backend skills come first', async () => {
      await page.goto(`${baseUrl}#skills`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Skills')
      const panel = page.getByRole('tabpanel')
      await assert.equal(await panel.locator('h3').first().textContent(), 'Backend & languages')
      const goSkill = panel.locator('li').getByText('Go', { exact: true }).first()
      const skillStyle = await goSkill.evaluate((element) => {
        const style = getComputedStyle(element)
        return { size: parseFloat(style.fontSize), weight: parseInt(style.fontWeight, 10), transform: style.textTransform }
      })
      await assert.ok(skillStyle.size >= 14 && skillStyle.weight >= 600 && skillStyle.transform !== 'uppercase', `Core skill styling should be readable: ${JSON.stringify(skillStyle)}`)
      const exampleLink = panel.getByRole('link', { name: 'FoROOM', exact: true }).first()
      const exampleFontSize = await exampleLink.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
      await assert.ok(exampleFontSize >= 12, 'Project examples should use at least 12px text')
    })

    await check('contact email, clipboard success/failure, resume, and profile links', async () => {
      const contact = await openPage(browser, { viewport: { width: 1280, height: 900 } })
      await contact.page.addInitScript(() => {
        window.__qaClipboardWrites = []
        window.__qaClipboardShouldFail = false
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async (value) => {
              if (window.__qaClipboardShouldFail) throw new Error('Simulated clipboard denial')
              window.__qaClipboardWrites.push(value)
            },
          },
        })
      })
      await contact.page.goto(`${baseUrl}#contact`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(contact.page, 'Contact')
      await assert.equal(await contact.page.getByRole('link', { name: /tranhathu@u\.nus\.edu/i }).getAttribute('href'), 'mailto:tranhathu@u.nus.edu')

      const copyButton = contact.page.getByRole('button', { name: /Copy email/i })
      await copyButton.click()
      await assert.ok(await contact.page.getByText(/Email address copied/i).isVisible())
      await assert.equal(await contact.page.evaluate(() => window.__qaClipboardWrites[0]), 'tranhathu@u.nus.edu')
      await contact.page.evaluate(() => { window.__qaClipboardShouldFail = true })
      await copyButton.click()
      await assert.ok(await contact.page.getByText(/Copy did not work/i).isVisible())

      const resume = contact.page.getByRole('link', { name: /Open PDF/i })
      const resumeUrl = new URL(await resume.getAttribute('href'), baseUrl)
      const resumeResponse = await contact.context.request.get(resumeUrl.href)
      await assert.equal(resumeResponse.status(), 200, 'Resume link should resolve to a built PDF')
      await assert.match(resumeResponse.headers()['content-type'] || '', /application\/pdf/i)
      for (const link of [
        contact.page.getByRole('link', { name: /linkedin\.com\/in\/tran-ha-thu/i }),
        contact.page.getByRole('link', { name: /github\.com\/oeggy03/i }),
      ]) await assert.ok(await link.isVisible())
      await contact.context.close()
    })

    await check('JavaScript-disabled content and local navigation', async () => {
      const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } })
      const staticPage = await staticContext.newPage()
      trackPage(staticPage)
      await staticPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
      for (const name of [...projectNames, ...experienceNames, ...coreSkills]) {
        const item = staticPage.getByText(name, { exact: true }).first()
        await assert.ok(await item.isVisible(), `No-JavaScript page should expose ${name}`)
      }
      const links = staticPage.locator('a[href^="#"]')
      const hrefs = await links.evaluateAll((items) => items.map((item) => item.getAttribute('href')))
      for (const href of hrefs) {
        const id = href.slice(1)
        await assert.ok(await staticPage.locator(`[id="${id}"]`).count() > 0, `No-JavaScript hash link has no target: ${href}`)
      }
      await staticContext.close()
    })

    await check('responsive widths, 200% desktop equivalent, mobile targets and reduced motion', async () => {
      const widths = [320, 390, 768, 1024, 1440, 1920, 720]
      const layoutPage = await browser.newPage({ viewport: { width: 1440, height: 900 } })
      trackPage(layoutPage)
      await layoutPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
      const overflowCases = []
      for (const width of widths) {
        await layoutPage.setViewportSize({ width, height: width === 720 ? 500 : 900 })
        for (const label of views) {
          await chooseView(layoutPage, label)
          const size = await layoutPage.evaluate(() => ({
            viewport: window.innerWidth,
            document: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          }))
          if (size.document > size.viewport) {
            overflowCases.push(`${label} at ${width}px: ${size.document}px document width`)
          }
        }
      }
      await assert.deepEqual(overflowCases, [], `Horizontal overflow cases:\n${overflowCases.map((item) => `  ${item}`).join('\n')}`)

      await layoutPage.setViewportSize({ width: 390, height: 844 })
      await layoutPage.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
      const mobileNav = layoutPage.getByRole('navigation', { name: 'Portfolio sections' }).last()
      const navGrid = mobileNav.locator('[role="tablist"]')
      const columns = await navGrid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)
      await assert.equal(columns, 3, 'Mobile section navigation should use three columns')
      const tabs = await mobileNav.getByRole('tab').all()
      await assert.equal(tabs.length, 6, 'All six section selectors should be available in the mobile navigation')
      for (const tab of tabs) {
        const bounds = await tab.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Mobile navigation controls should be at least 44px square')
        await assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= 844, 'All six mobile selectors should be visible without scrolling')
      }
      const name = layoutPage.getByRole('heading', { name: 'Tran Ha Thu', exact: true })
      const nameIsClipped = await name.evaluate((element) => element.scrollWidth > element.clientWidth)
      await assert.equal(nameIsClipped, false, 'The portfolio name should not be clipped on mobile')

      await chooseView(layoutPage, 'Projects')
      const projectControls = layoutPage.getByRole('button', { name: /^(All|Backend|AI & bots|Frontend)/ })
      await assert.equal(await projectControls.count(), 4)
      for (const button of await projectControls.all()) {
        const bounds = await button.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Project filter buttons should be at least 44px square')
      }
      const chooser = layoutPage.getByRole('navigation', { name: 'Choose a project' })
      const projectButtons = await chooser.getByRole('button').all()
      const projectBounds = []
      for (const button of projectButtons) {
        const bounds = await button.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Project selection buttons should be at least 44px square')
        projectBounds.push(bounds)
      }
      await assert.equal(new Set(projectBounds.map(({ x }) => Math.round(x))).size, 2, 'Mobile project selectors should use two columns')
      await assert.equal(new Set(projectBounds.map(({ y }) => Math.round(y))).size, 3, 'Mobile project selectors should use three rows')
      await assertMobileNavigationAndTarget(layoutPage, '#project-foroom h3')

      await layoutPage.goto(`${baseUrl}#project-teleai`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(layoutPage, 'Projects')
      await assertSelectedProject(layoutPage, 'TeleAI')
      await assertMobileNavigationAndTarget(layoutPage, '#project-teleai h3')

      await layoutPage.emulateMedia({ reducedMotion: 'reduce' })
      await chooseView(layoutPage, 'Projects')
      const motion = await layoutPage.getByRole('tab', { name: 'Projects', exact: true }).evaluate((element) => ({
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        transition: getComputedStyle(element).transitionProperty,
        animation: getComputedStyle(element).animationName,
      }))
      await assert.ok(motion.reduced, 'Browser should expose the reduced motion preference')
      await assert.equal(motion.transition, 'none', 'Selected navigation should suppress transitions when reduced motion is requested')
    })

    await check('WCAG 2.1 A/AA and WCAG 2.2 AA axe scans on desktop and mobile', async () => {
      for (const viewport of [
        { label: 'desktop', width: 1440, height: 900 },
        { label: 'mobile', width: 390, height: 844 },
      ]) {
        const scanContext = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
        const scanPage = await scanContext.newPage()
        trackPage(scanPage)
        await scanPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
        for (const label of views) {
          await chooseView(scanPage, label)
          const result = await new AxeBuilder({ page: scanPage })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .analyze()
          if (result.violations.length) {
            const detail = result.violations.map(({ id, impact, help, nodes }) => ({
              id, impact, help,
              targets: nodes.flatMap((node) => node.target).slice(0, 10),
            }))
            throw new Error(`${viewport.label} ${label} has axe violations:\n${JSON.stringify(detail, null, 2)}`)
          }
        }
        await scanContext.close()
      }
    })

    await check('runtime console, uncaught errors and local asset requests', async () => {
      await assert.deepEqual(consoleErrors, [], 'Browser console should not report errors')
      await assert.deepEqual(pageErrors, [], 'Browser should not report uncaught page errors')
      await assert.deepEqual(internalRequestFailures, [], 'Same-origin assets should load successfully')
    })

    if (externalRequestFailures.size) {
      console.warn(`External requests could not be checked in this environment (${externalRequestFailures.size}):`)
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
  console.log('\nUI checks passed: navigation, content, keyboard, filters, deep links, contact actions, layout, motion, axe, and runtime requests.')
}
