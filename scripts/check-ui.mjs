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
const allSkills = [
  ...coreSkills, 'JWT', 'bcrypt', 'SQLite', 'Pandas', 'OpenCV', 'TensorFlow', 'Keras', 'JavaFX',
]
const experienceDates = [
  'May 2024 - Present', 'Dec 2023 - Present', 'Aug 2023 - Present',
  'May 2023 - Aug 2023', 'Dec 2019 - Jan 2020',
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
const experienceOutboundLinks = [
  'https://www.hdb.gov.sg/cs/infoweb/homepage',
  'https://www.care4we.com/',
  'https://nus.edu.sg/',
  'https://www.eastspring.com/sg',
  'https://www.a-star.edu.sg/',
]
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

async function settleNavigation(page) {
  await page.evaluate(async () => {
    await document.fonts?.ready
    for (let frame = 0; frame < 4; frame += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  })
}

async function assertViewAtDocumentTop(page, label, { expectFocus = false } = {}) {
  await assertActiveView(page, label)
  await settleNavigation(page)
  const scrollY = await page.evaluate(() => window.scrollY)
  await assert.ok(scrollY <= 2, `${label} should settle at document scroll Y=0, got ${scrollY}`)

  const panel = page.getByRole('tabpanel')
  const heading = panel.getByRole('heading').first()
  const headingBounds = await heading.boundingBox()
  await assert.ok(headingBounds && headingBounds.y >= 0 && headingBounds.y < page.viewportSize().height, `${label} heading should be visible after navigation`)
  const topObstruction = await page.evaluate(() => {
    const visible = [...document.querySelectorAll('header, nav')].filter((element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      const isSectionNavigation = element.tagName === 'NAV' && element.getAttribute('aria-label') === 'Portfolio sections'
      return rect.height > 0 && rect.top <= 1 && (isSectionNavigation || style.position === 'sticky' || style.position === 'fixed')
    })
    return Math.max(0, ...visible.map((element) => element.getBoundingClientRect().bottom))
  })
  await assert.ok(headingBounds.y >= topObstruction, `${label} heading should clear sticky navigation and toolbar (bottom ${topObstruction}px)`)

  if (expectFocus) {
    const selectedTab = page.locator('[role="tab"][aria-selected="true"]:visible')
    await assert.ok(await selectedTab.evaluate((element) => element === document.activeElement), `Keyboard navigation should leave focus on the selected ${label} tab`)
  }
}

async function assertProjectHeadingBelowStickyUi(page, project) {
  await assertActiveView(page, 'Projects')
  await settleNavigation(page)
  const heading = page.locator(`#project-${projectIds[project]} h2, #project-${projectIds[project]} h3`).first()
  const bounds = await heading.boundingBox()
  const obstructionBottom = await page.evaluate(() => {
    const sticky = [...document.querySelectorAll('nav[aria-label="Portfolio sections"], header')]
      .map((element) => ({ element, rect: element.getBoundingClientRect(), style: getComputedStyle(element) }))
      .filter(({ rect, style, element }) => rect.height > 0 && rect.top <= 1 && (
        element.matches('nav[aria-label="Portfolio sections"]') || style.position === 'sticky' || style.position === 'fixed'
      ))
      .map(({ rect }) => rect.bottom)
    return Math.max(0, ...sticky)
  })
  await assert.ok(bounds && bounds.y >= obstructionBottom + 16 && bounds.y < page.viewportSize().height, `${project} heading should be visible below sticky controls`)
  return bounds
}

async function scrollNaturallyToBottom(page) {
  const viewport = page.viewportSize()
  await page.mouse.move(Math.max(1, viewport.width - 24), Math.max(1, viewport.height - 24))
  for (let step = 0; step < 40; step += 1) {
    const before = await page.evaluate(() => document.scrollingElement.scrollTop)
    const maximum = await page.evaluate(() => document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight)
    if (before >= maximum - 2) break
    await page.mouse.wheel(0, 650)
    await page.waitForTimeout(35)
  }
  await page.waitForTimeout(100)
  return page.evaluate(() => document.scrollingElement.scrollTop)
}

async function scrollNaturallyToward(page, targetY, delta = 450) {
  const viewport = page.viewportSize()
  await page.mouse.move(Math.max(1, viewport.width - 24), Math.max(1, viewport.height - 24))
  for (let step = 0; step < 20; step += 1) {
    const current = await page.evaluate(() => window.scrollY)
    if (current >= targetY) break
    await page.mouse.wheel(0, delta)
    await page.waitForTimeout(40)
  }
  return page.evaluate(() => window.scrollY)
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
  await assertViewAtDocumentTop(page, label)
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
  await page.waitForFunction(() => {
    const activePanel = [...document.querySelectorAll('[role="tabpanel"]')].find((candidate) => !candidate.hidden)
    const visibleSelectedTab = [...document.querySelectorAll('[role="tab"][aria-selected="true"]')]
      .find((candidate) => candidate.getClientRects().length > 0)
    return activePanel && visibleSelectedTab && activePanel.getAttribute('aria-labelledby') === visibleSelectedTab.id
  }, null, { timeout: 3000 })
  const selectedId = await page.locator('[role="tab"][aria-selected="true"]:visible').getAttribute('id')
  await assert.equal(await panel.getAttribute('aria-labelledby'), selectedId, 'The visible panel should name its selected visible tab')
}

async function assertSelectedProject(page, project) {
  const selection = page.getByRole('button', { name: new RegExp(project, 'i') })
  await assert.equal(await selection.getAttribute('aria-pressed'), 'true', `${project} should be the selected project`)
  await assert.equal(await page.locator(`#project-${projectIds[project]}`).count(), 1)
}

async function assertSelectedFilter(page, filter) {
  const controls = page.getByRole('group', { name: 'Filter projects' })
  const selected = await controls.getByRole('button').evaluateAll((buttons) => {
    const button = buttons.find((candidate) => candidate.getAttribute('aria-pressed') === 'true')
    return button?.textContent?.trim().replace(/\d+$/, '').trim() || null
  })
  await assert.equal(selected, filter, `Expected ${filter} project filter, received ${selected}`)
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
  await assert.ok(targetBounds && targetBounds.y >= navBounds.y + navBounds.height + 16, 'The selected heading or detail should clear the sticky navigation by at least 16px')
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
      const readingY = await scrollNaturallyToward(page, 160)
      await assert.ok(readingY > 20, `Project history fixture should have a nonzero reading position, got ${readingY}px`)
      await page.goBack()
      await assertViewAtDocumentTop(page, 'Overview')
      await page.goForward()
      await assertActiveView(page, 'Projects')
      await settleNavigation(page)
      const forwardY = await page.evaluate(() => window.scrollY)
      const forwardMaximum = await page.evaluate(() => document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight)
      await assert.ok(Math.abs(forwardY - Math.min(readingY, forwardMaximum)) <= 2, `Forward should restore the Projects reading position (${readingY}px), got ${forwardY}px`)

      await page.goto(`${baseUrl}#about`, { waitUntil: 'domcontentloaded' })
      await assertViewAtDocumentTop(page, 'About')
      await page.reload({ waitUntil: 'domcontentloaded' })
      await assertViewAtDocumentTop(page, 'About')

      for (const [fragment, label] of Object.entries(legacyHashes)) {
        await page.goto(`${baseUrl}#${fragment}`, { waitUntil: 'domcontentloaded' })
        await assertViewAtDocumentTop(page, label)
        await assert.equal(new URL(page.url()).hash, `#${label.toLowerCase()}`, `${fragment} should resolve to the canonical view hash`)
      }

      const modifierContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const modifierPage = await modifierContext.newPage()
      trackPage(modifierPage)
      await modifierPage.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
      const projectAnchor = modifierPage.locator('a[href="#projects"]:visible').first()
      const openNewPage = modifierContext.waitForEvent('page')
      await projectAnchor.click({ button: 'middle' })
      const openedPage = await openNewPage
      await openedPage.waitForLoadState('domcontentloaded')
      await assert.equal(new URL(openedPage.url()).hash, '#projects', 'Opening an internal link in a new tab should preserve its fragment destination')
      await assert.equal(new URL(modifierPage.url()).hash, '#overview', 'Opening a link in a new tab should leave the current view unchanged')
      await modifierContext.close()
    })

    await check('keyboard navigation across the six views', async () => {
      await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
      let tab = page.getByRole('tab', { name: 'Overview', exact: true })
      await tab.focus()
      await tab.press('ArrowRight')
      await assertViewAtDocumentTop(page, 'Projects', { expectFocus: true })
      await page.getByRole('tab', { name: 'Projects', exact: true }).press('ArrowDown')
      await assertViewAtDocumentTop(page, 'Experience', { expectFocus: true })
      await page.getByRole('tab', { name: 'Experience', exact: true }).press('Home')
      await assertViewAtDocumentTop(page, 'Overview', { expectFocus: true })
      await page.getByRole('tab', { name: 'Overview', exact: true }).press('End')
      await assertViewAtDocumentTop(page, 'Contact', { expectFocus: true })
    })

    await check('click and keyboard navigation from the bottom starts each view at the top', async () => {
      const responsiveViewports = [
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
      ]
      const navigationPage = await browser.newPage({ viewport: responsiveViewports[0] })
      trackPage(navigationPage)

      for (const viewport of responsiveViewports) {
        await navigationPage.setViewportSize(viewport)
        await navigationPage.goto(`${baseUrl}#skills`, { waitUntil: 'domcontentloaded' })
        await assertActiveView(navigationPage, 'Skills')
        await scrollNaturallyToBottom(navigationPage)

        await navigationPage.getByRole('tab', { name: 'Skills', exact: true }).press('End')
        await assertViewAtDocumentTop(navigationPage, 'Contact', { expectFocus: true })
        if (viewport.width === 390 && viewport.height === 600) {
          const contactPanel = navigationPage.getByRole('tabpanel')
          for (const target of [
            contactPanel.getByRole('heading', { name: 'Contact', exact: true }),
            contactPanel.locator('a[href="mailto:tranhathu@u.nus.edu"]').filter({ hasText: 'tranhathu@u.nus.edu' }),
            contactPanel.getByRole('link', { name: 'Email me', exact: true }),
          ]) {
            const bounds = await target.boundingBox()
            await assert.ok(bounds && bounds.y >= 0 && bounds.y + bounds.height <= viewport.height, 'Contact heading, email address, and primary email action should fit fully in the 390×600 viewport after End')
          }
        }

        await scrollNaturallyToBottom(navigationPage)
        await navigationPage.getByRole('tab', { name: 'Contact', exact: true }).click()
        await assertViewAtDocumentTop(navigationPage, 'Contact')

        await scrollNaturallyToBottom(navigationPage)
        await navigationPage.getByRole('tab', { name: 'Projects', exact: true }).click()
        await assertViewAtDocumentTop(navigationPage, 'Projects')

        await scrollNaturallyToBottom(navigationPage)
        await navigationPage.getByRole('tab', { name: 'Contact', exact: true }).press('Home')
        await assertViewAtDocumentTop(navigationPage, 'Overview', { expectFocus: true })

        await scrollNaturallyToBottom(navigationPage)
        await navigationPage.getByRole('tab', { name: 'Overview', exact: true }).press('Enter')
        await assertViewAtDocumentTop(navigationPage, 'Overview', { expectFocus: true })

        await scrollNaturallyToBottom(navigationPage)
        await navigationPage.getByRole('tab', { name: 'Overview', exact: true }).press('ArrowRight')
        await assertViewAtDocumentTop(navigationPage, 'Projects', { expectFocus: true })

        await scrollNaturallyToBottom(navigationPage)
        await navigationPage.getByRole('tab', { name: 'Projects', exact: true }).press('ArrowDown')
        await assertViewAtDocumentTop(navigationPage, 'Experience', { expectFocus: true })

        await scrollNaturallyToBottom(navigationPage)
        await navigationPage.getByRole('tab', { name: 'Experience', exact: true }).press('ArrowUp')
        await assertViewAtDocumentTop(navigationPage, 'Projects', { expectFocus: true })
      }
      await navigationPage.close()
    })

    await check('browser history restores the reading offset and selected project', async () => {
      const historyPage = await browser.newPage({ viewport: { width: 1024, height: 600 } })
      trackPage(historyPage)
      await historyPage.goto(`${baseUrl}#projects`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(historyPage, 'Projects')
      await settleNavigation(historyPage)
      await assertSelectedProject(historyPage, 'FoROOM')
      await assert.equal(new URL(historyPage.url()).hash, '#projects')

      const projectMaximumY = await historyPage.evaluate(() => document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight)
      const readingTargetY = Math.min(237, projectMaximumY)
      const startingReadingY = await scrollNaturallyToward(historyPage, readingTargetY, 79)
      await assert.ok(startingReadingY > 0, `History fixture should save a nonzero reading offset, got ${startingReadingY}px`)
      if (projectMaximumY >= 237) {
        await assert.ok(startingReadingY >= 237 && startingReadingY < projectMaximumY, `History fixture should save a non-anchor offset near 237px, got ${startingReadingY}px of ${projectMaximumY}px`)
      } else {
        await assert.equal(startingReadingY, projectMaximumY, `Short history fixture should save its maximum reading offset (${projectMaximumY}px)`)
      }
      await historyPage.getByRole('tab', { name: 'Skills', exact: true }).click()
      await assertViewAtDocumentTop(historyPage, 'Skills')
      await historyPage.goBack()
      await assertActiveView(historyPage, 'Projects')
      await settleNavigation(historyPage)
      await historyPage.waitForTimeout(150)
      const restoredReadingY = await historyPage.evaluate(() => window.scrollY)
      await assert.ok(Math.abs(restoredReadingY - startingReadingY) <= 2, `Back should restore the Projects reading offset (${startingReadingY}px), got ${restoredReadingY}px`)
      await assertSelectedProject(historyPage, 'FoROOM')
      await historyPage.goForward()
      await assertViewAtDocumentTop(historyPage, 'Skills')

      await historyPage.goto(`${baseUrl}#projects`, { waitUntil: 'domcontentloaded' })
      await assertSelectedProject(historyPage, 'FoROOM')
      const projectControl = historyPage.getByRole('navigation', { name: 'Choose a project' }).getByRole('button', { name: /TeleAI/i })
      const projectReadingY = await scrollNaturallyToward(historyPage, 120, 80)
      const chooserBounds = await historyPage.getByRole('navigation', { name: 'Choose a project' }).boundingBox()
      await assert.ok(chooserBounds && chooserBounds.y < historyPage.viewportSize().height && chooserBounds.y + chooserBounds.height > 0, 'Desktop project chooser should remain visible for contextual selection')
      const filterBounds = await historyPage.getByRole('group', { name: 'Filter projects' }).boundingBox()
      await assert.ok(filterBounds && filterBounds.y >= 69 && filterBounds.y < historyPage.viewportSize().height, 'Desktop filters should be visible when preserving the explorer reading position')
      await projectControl.click()
      await settleNavigation(historyPage)
      await assertSelectedProject(historyPage, 'TeleAI')
      await assert.equal(new URL(historyPage.url()).hash, '#project-teleai')
      await assert.ok(Math.abs(await historyPage.evaluate(() => window.scrollY) - projectReadingY) <= 2, 'Desktop project selection should preserve the explorer context while its chooser is visible')
      await historyPage.goBack()
      await assertActiveView(historyPage, 'Projects')
      await settleNavigation(historyPage)
      await assert.equal(new URL(historyPage.url()).hash, '#projects')
      await assertSelectedProject(historyPage, 'FoROOM')
      await assert.ok(Math.abs(await historyPage.evaluate(() => window.scrollY) - projectReadingY) <= 2, 'Back should restore the project explorer reading position')
      await historyPage.goForward()
      await assertActiveView(historyPage, 'Projects')
      await settleNavigation(historyPage)
      await assertSelectedProject(historyPage, 'TeleAI')
      await assert.equal(new URL(historyPage.url()).hash, '#project-teleai')
      await assert.ok(Math.abs(await historyPage.evaluate(() => window.scrollY) - projectReadingY) <= 2, 'Forward should restore the selected project entry reading position')
      await historyPage.close()
    })

    await check('overview project proof point and mobile-sized calls to action', async () => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
      const overviewPanel = page.getByRole('tabpanel')
      const featuredImage = overviewPanel.locator('img').first()
      const desktopBounds = await featuredImage.boundingBox()
      await assert.ok(desktopBounds && desktopBounds.y < 900 && desktopBounds.y + desktopBounds.height > 0, 'A project image should be visible in the 1440×900 overview')
      const overviewFacts = (await overviewPanel.innerText()).toLowerCase()
      for (const fact of ['react', 'go', 'mysql']) await assert.ok(overviewFacts.includes(fact), `Overview should show the ${fact} project fact`)

      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
      for (const target of ['projects', 'contact']) {
        const action = page.locator(`a[href="#${target}"]:visible`).first()
        await assert.ok(await action.isVisible(), `Overview action to #${target} should be visible on mobile`)
        const bounds = await action.boundingBox()
        await assert.ok(bounds && bounds.y <= 844 * 1.5, `Overview action to #${target} should be reachable without a long mobile scroll`)
      }
    })

    await check('project filters, selection, content and repository links', async () => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(`${baseUrl}#projects`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Projects')

      const chooser = page.getByRole('navigation', { name: 'Choose a project' })
      await assert.equal(await chooser.getByRole('button').count(), 6)
      await assertSelectedFilter(page, 'All')
      for (const project of projectNames) {
        const selector = chooser.getByRole('button', { name: new RegExp(project, 'i') })
        await assert.ok(await selector.isVisible(), `${project} should be listed`)
        await selector.click()
        await assertSelectedProject(page, project)
      }

      await scrollNaturallyToward(page, 100, 80)
      const aiFilter = page.getByRole('button', { name: /^AI & bots/ })
      await aiFilter.focus()
      const filterScrollBefore = await page.evaluate(() => window.scrollY)
      const filterMaximumBefore = await page.evaluate(() => document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight)
      const filterGroupBefore = await page.getByRole('group', { name: 'Filter projects' }).boundingBox()
      await aiFilter.click()
      await settleNavigation(page)
      const filterScrollAfter = await page.evaluate(() => window.scrollY)
      const filterMaximumAfter = await page.evaluate(() => document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight)
      const expectedFilterY = Math.min(filterScrollBefore, filterMaximumAfter)
      const filterGroupAfter = await page.getByRole('group', { name: 'Filter projects' }).boundingBox()
      console.log(`QA evidence: filter transition Y ${filterScrollBefore}px → ${filterScrollAfter}px (expected ${expectedFilterY}px; max ${filterMaximumBefore}px → ${filterMaximumAfter}px); controls top ${filterGroupBefore?.y ?? 'n/a'}px → ${filterGroupAfter?.y ?? 'n/a'}px`)
      await assert.ok(Math.abs(filterScrollAfter - expectedFilterY) <= 2, `Project filtering should preserve Y=${filterScrollBefore}px when there is room, or clamp to the new document maximum (${filterMaximumAfter}px); got ${filterScrollAfter}px`)
      await assert.ok(await aiFilter.evaluate((element) => element === document.activeElement), 'Project filters should retain keyboard focus after filtering')
      await assertSelectedFilter(page, 'AI & bots')
      await assert.equal(await chooser.getByRole('button').count(), 3)
      for (const title of ['Eggbot', 'TeleAI', 'FoodHero']) await assert.ok(await chooser.getByRole('button', { name: new RegExp(title, 'i') }).count() === 1)
      await assert.equal(await chooser.getByRole('button', { name: /FoROOM/i }).count(), 0)

      await chooser.getByRole('button', { name: /TeleAI/i }).click()
      await assertSelectedProject(page, 'TeleAI')
      const teleAiDetail = page.locator('#project-teleai')
      const teleAiFacts = (await teleAiDetail.innerText()).toLowerCase()
      for (const fact of ['opencv', 'tensorflow', 'keras', 'cifar-10', 'python']) {
        await assert.ok(teleAiFacts.includes(fact), `TeleAI should preserve the ${fact} implementation fact`)
      }
      for (const href of ['https://oeggy03.github.io/TeleAI/', 'https://github.com/oeggy03/TeleAI']) {
        await assert.ok(await teleAiDetail.locator(`a[href="${href}"]`).count() > 0, `TeleAI should retain ${href}`)
      }

      await page.getByRole('button', { name: /^Backend/ }).click()
      await assertSelectedFilter(page, 'Backend')
      await assert.equal(await chooser.getByRole('button').count(), 2)
      await assert.ok(await chooser.getByRole('button', { name: /FoROOM/i }).isVisible())
      await assert.ok(await chooser.getByRole('button', { name: /Buddy4Good/i }).isVisible())
      await assertSelectedProject(page, 'FoROOM')
      const foRoomDetail = page.locator('#project-foroom')
      const codeLink = foRoomDetail.locator('a[href="https://github.com/oeggy03/cvwo-backend"]')
      await assert.ok(await codeLink.count() >= 1, 'FoROOM should expose the back-end repository')
      const primaryCodeAction = foRoomDetail.getByRole('link', { name: 'View code', exact: true })
      await assert.equal(await primaryCodeAction.getAttribute('href'), 'https://github.com/oeggy03/cvwo-backend', 'FoROOM primary code action should open the back-end repository')
      for (const href of [
        'https://devpost.com/software/foroom',
        'https://github.com/oeggy03/cvwo-frontend',
        'https://github.com/oeggy03/cvwo-backend',
      ]) {
        await assert.ok(await foRoomDetail.locator(`a[href="${href}"]`).count() > 0, `FoROOM should preserve ${href}`)
      }

      await page.getByRole('button', { name: /^Frontend/ }).click()
      await assertSelectedFilter(page, 'Frontend')
      await assert.equal(await chooser.getByRole('button').count(), 1)
      await assert.ok(await chooser.getByRole('button', { name: /Portfolio Website/i }).isVisible())
    })

    await check('desktop project context, sticky toolbar, full-height backdrop and short rail reachability', async () => {
      const desktopPage = await browser.newPage({ viewport: { width: 1024, height: 600 } })
      trackPage(desktopPage)
      await desktopPage.goto(`${baseUrl}#projects`, { waitUntil: 'domcontentloaded' })
      await assert.equal(await desktopPage.evaluate(() => document.scrollingElement === document.documentElement), true, 'The document should provide the main scroll surface')

      const chooser = desktopPage.getByRole('navigation', { name: 'Choose a project' })
      await chooser.getByRole('button', { name: /TeleAI/i }).click()
      await settleNavigation(desktopPage)
      const detailBottomY = await scrollNaturallyToBottom(desktopPage)
      await assert.ok(detailBottomY > 80, 'The project detail should provide a real document-scroll test position')
      const stickyChooserButton = chooser.getByRole('button', { name: /FoROOM/i })
      const chooserButtonBounds = await stickyChooserButton.boundingBox()
      await assert.ok(chooserButtonBounds && chooserButtonBounds.y >= 0 && chooserButtonBounds.y + chooserButtonBounds.height <= 600, 'Sticky project selector should remain available while reading a long detail')
      await stickyChooserButton.click()
      await settleNavigation(desktopPage)
      await assertSelectedProject(desktopPage, 'FoROOM')
      const yAfterDownpageSelection = await desktopPage.evaluate(() => window.scrollY)
      const filtersAfterDownpageSelection = await desktopPage.getByRole('group', { name: 'Filter projects' }).boundingBox()
      await assert.ok(yAfterDownpageSelection < detailBottomY - 50, 'Selecting a project after scrolling through its detail should return to the explorer controls')
      await assert.ok(filtersAfterDownpageSelection && filtersAfterDownpageSelection.y >= 69 && filtersAfterDownpageSelection.y < 600, 'Down-page selection should bring the filters back below the sticky toolbar')

      const toolbar = desktopPage.locator('[data-portfolio-toolbar]')
      const toolbarStyle = await toolbar.evaluate((element) => ({ position: getComputedStyle(element).position, top: element.getBoundingClientRect().top }))
      await assert.equal(toolbarStyle.position, 'sticky', 'The desktop toolbar should stay sticky during document scrolling')
      await scrollNaturallyToward(desktopPage, 200)
      const toolbarTop = await toolbar.evaluate((element) => element.getBoundingClientRect().top)
      await assert.ok(toolbarTop >= -1 && toolbarTop <= 1, `Sticky toolbar should remain at the viewport top, got ${toolbarTop}px`)

      const fullPageImage = await desktopPage.screenshot({ fullPage: true })
      const colors = await desktopPage.evaluate(async (data) => {
        const image = new Image()
        image.src = `data:image/png;base64,${data}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)
        const sample = (y) => Array.from(context.getImageData(20, y, 1, 1).data).slice(0, 3)
        return { height: image.height, top: sample(20), belowViewport: sample(920) }
      }, fullPageImage.toString('base64'))
      await assert.ok(colors.height > 920, 'The full-page backdrop check should include space below the first viewport')
      for (const [label, pixel] of [['top rail', colors.top], ['rail backdrop below viewport', colors.belowViewport]]) {
        const brightness = pixel.reduce((total, channel) => total + channel, 0) / 3
        await assert.ok(brightness < 140, `${label} should remain dark through the document; sampled RGB ${pixel.join(',')}`)
      }
      await desktopPage.close()

      const shortPage = await browser.newPage({ viewport: { width: 1024, height: 450 } })
      trackPage(shortPage)
      await shortPage.goto(`${baseUrl}#overview`, { waitUntil: 'domcontentloaded' })
      const rail = shortPage.locator('[data-portfolio-sidebar]')
      const initial = await rail.evaluate((element) => ({ scrollHeight: element.scrollHeight, clientHeight: element.clientHeight }))
      await assert.ok(initial.scrollHeight > initial.clientHeight, 'The desktop rail should offer internal scrolling at short heights')
      const documentY = await shortPage.evaluate(() => window.scrollY)
      await shortPage.mouse.move(130, 425)
      for (let step = 0; step < 12; step += 1) {
        const metrics = await rail.evaluate((element) => ({ y: element.scrollTop, max: element.scrollHeight - element.clientHeight }))
        if (metrics.y >= metrics.max - 2) break
        await shortPage.mouse.wheel(0, 500)
        await shortPage.waitForTimeout(25)
      }
      const railAtBottom = await rail.evaluate((element) => ({ y: element.scrollTop, max: element.scrollHeight - element.clientHeight }))
      await assert.ok(railAtBottom.y > 0 && railAtBottom.y >= railAtBottom.max - 2, `The short desktop rail should scroll through its complete contents (${railAtBottom.y}/${railAtBottom.max})`)
      await assert.equal(await shortPage.evaluate(() => window.scrollY), documentY, 'Scrolling the short rail should not move the document')
      const linkedin = rail.getByRole('link', { name: /on LinkedIn/i })
      const linkedinBounds = await linkedin.boundingBox()
      await assert.ok(linkedinBounds && linkedinBounds.y >= 0 && linkedinBounds.y + linkedinBounds.height <= 450, 'The short rail should make its final profile links reachable')
      const contactTab = rail.getByRole('tab', { name: 'Contact', exact: true })
      await contactTab.focus()
      const contactBounds = await contactTab.boundingBox()
      await assert.ok(contactBounds && contactBounds.y >= 0 && contactBounds.y + contactBounds.height <= 450, 'Keyboard focus should reveal section navigation within the short rail')
      await assert.equal(await shortPage.evaluate(() => window.scrollY), documentY, 'Focusing a rail navigation control should not scroll the document')
      await shortPage.close()
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

    await check('core skill labels remain readable', async () => {
      await page.goto(`${baseUrl}#skills`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(page, 'Skills')
      const panel = page.getByRole('tabpanel')
      const skillText = await panel.innerText()
      for (const skill of allSkills) await assert.ok(skillText.includes(skill), `Skills view should show ${skill}`)
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
      const copyStatus = contact.page.getByRole('tabpanel').locator('p[aria-live="polite"]')
      await assert.ok(await copyStatus.isVisible())
      const successMessage = await copyStatus.innerText()
      await assert.ok(successMessage.trim().length > 0 && /cop/i.test(successMessage), 'Copy success should provide meaningful feedback')
      await assert.equal(await contact.page.evaluate(() => window.__qaClipboardWrites[0]), 'tranhathu@u.nus.edu')
      await contact.page.evaluate(() => { window.__qaClipboardShouldFail = true })
      await copyButton.click()
      await assert.ok(await copyStatus.isVisible())
      await assert.ok((await copyStatus.innerText()).trim().length > 0, 'Copy failure should provide meaningful feedback')

      const resume = contact.page.locator('a[href$=".pdf"]').first()
      const resumeUrl = new URL(await resume.getAttribute('href'), baseUrl)
      const resumeResponse = await contact.context.request.get(resumeUrl.href)
      await assert.equal(resumeResponse.status(), 200, 'Resume link should resolve to a built PDF')
      await assert.match(resumeResponse.headers()['content-type'] || '', /application\/pdf/i)
      for (const href of ['https://www.linkedin.com/in/tran-ha-thu/', 'https://github.com/oeggy03']) {
        const link = contact.page.locator(`a[href="${href}"]:visible`).first()
        await assert.ok(await link.isVisible(), `Contact should expose ${href}`)
      }
      await contact.context.close()
    })

    await check('JavaScript-disabled content and local navigation', async () => {
      const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } })
      const staticPage = await staticContext.newPage()
      trackPage(staticPage)
      await staticPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
      for (const name of [...projectNames, ...experienceNames, ...allSkills]) {
        const item = staticPage.getByText(name, { exact: true }).first()
        await assert.ok(await item.isVisible(), `No-JavaScript page should expose ${name}`)
      }
      const staticText = await staticPage.locator('body').innerText()
      const normalizeDateText = (value) => value.toLowerCase().replace(/[–—−]/g, '-').replace(/\s+/g, ' ').trim()
      const normalizedStaticText = normalizeDateText(staticText)
      for (const date of experienceDates) {
        await assert.ok(normalizedStaticText.includes(normalizeDateText(date)), `No-JavaScript page should preserve the experience date ${date}`)
      }
      const links = staticPage.locator('a[href^="#"]')
      const hrefs = await links.evaluateAll((items) => items.map((item) => item.getAttribute('href')))
      for (const href of hrefs) {
        const id = href.slice(1)
        await assert.ok(await staticPage.locator(`[id="${id}"]`).count() > 0, `No-JavaScript hash link has no target: ${href}`)
      }
      for (const href of projectOutboundLinks) {
        await assert.ok(await staticPage.locator(`a[href="${href}"]`).count() > 0, `No-JavaScript output should preserve project destination ${href}`)
      }
      for (const href of experienceOutboundLinks) {
        await assert.ok(await staticPage.locator(`a[href="${href}"]`).count() > 0, `No-JavaScript output should preserve employer destination ${href}`)
      }
      await staticContext.close()
    })

    await check('responsive widths, 200% desktop equivalent, mobile targets and reduced motion', async () => {
      const responsiveViewports = [
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
      const layoutPage = await browser.newPage({ viewport: responsiveViewports[0] })
      trackPage(layoutPage)
      await layoutPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
      const overflowCases = []
      for (const viewport of responsiveViewports) {
        await layoutPage.setViewportSize(viewport)
        for (const label of views) {
          await chooseView(layoutPage, label)
          const size = await layoutPage.evaluate(() => ({
            viewport: window.innerWidth,
            document: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          }))
          if (size.document > size.viewport) {
            overflowCases.push(`${label} at ${viewport.width}×${viewport.height}: ${size.document}px document width`)
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
      for (const button of projectButtons) {
        const bounds = await button.boundingBox()
        await assert.ok(bounds && bounds.width >= 44 && bounds.height >= 44, 'Project selection buttons should be at least 44px square')
      }

      await layoutPage.goto(`${baseUrl}#project-teleai`, { waitUntil: 'domcontentloaded' })
      await assertActiveView(layoutPage, 'Projects')
      await assertSelectedProject(layoutPage, 'TeleAI')
      await assertMobileNavigationAndTarget(layoutPage, '#project-teleai h3')
      const browseProjects = layoutPage.getByRole('link', { name: /Browse projects/i })
      await assert.ok(await browseProjects.isVisible(), 'A project detail should keep a Browse projects action nearby on mobile')
      const projectHeading = await layoutPage.locator('#project-teleai h3').boundingBox()
      const browseBounds = await browseProjects.boundingBox()
      await assert.ok(projectHeading && browseBounds && Math.abs(browseBounds.y - projectHeading.y) < 180, 'Browse projects should remain near the selected project heading')
      await browseProjects.click()
      await settleNavigation(layoutPage)
      const chooserAfterBrowse = layoutPage.getByRole('navigation', { name: 'Choose a project' })
      await assert.ok(await chooserAfterBrowse.getByRole('button', { name: /TeleAI/i }).isVisible(), 'Browse projects should return the chooser to the viewport')
      await chooserAfterBrowse.getByRole('button', { name: /TeleAI/i }).click()
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
