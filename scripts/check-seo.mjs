import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { portfolioCompatibilityRoutePaths, portfolioRoutePaths, resolvePortfolioRoute } from '../src/navigation/routes.js'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const origin = 'https://www.tranhathu.com'
const canonical = `${origin}/`
const projects = [
  { id: 'foroom', title: 'FoROOM' },
  { id: 'buddy4good', title: 'Buddy4Good' },
  { id: 'eggbot', title: 'Eggbot' },
  { id: 'teleai', title: 'TeleAI' },
  { id: 'foodhero', title: 'FoodHero' },
  { id: 'portfolio', title: 'Portfolio Website' },
  { id: 'openclaw', title: 'My OpenClaw Lab' },
  { id: 'chinese-learning', title: 'Chinese Learning Toolkit' },
  { id: 'traders-edge', title: 'Trader’s Edge' },
]
const experiences = [
  'TikTok', 'GIC', 'Uptale', 'National University of Singapore',
  'Housing Development Board (HDB)', 'Eastspring Investments',
  'A*STAR - Agency for Science, Technology and Research',
]
const skills = [
  'Git', 'Object-oriented programming', 'HTML', 'CSS', 'JavaScript', 'React', 'Go',
  'Express.js', 'MySQL', 'PostgreSQL', 'Microsoft SQL Server', 'Java', 'Python', 'C++',
  'JWT', 'bcrypt', 'SQLite', 'Pandas', 'OpenCV', 'TensorFlow', 'Keras', 'JavaFX',
]

function routeFile(path) {
  return resolve(dist, path === '/' ? 'index.html' : `${path.slice(1)}index.html`)
}

function extractMain(html, path) {
  const main = html.match(/<main\b[^>]*id="root"[^>]*>([\s\S]*?)<\/main>/)?.[1]
  assert.ok(main, `${path} must contain a prerendered portfolio root.`)
  return main
}

function extractDivWithMarker(html, marker, path) {
  const markerIndex = html.indexOf(marker)
  assert.notEqual(markerIndex, -1, `${path} should contain ${marker}.`)
  const start = html.lastIndexOf('<div', markerIndex)
  const tags = /<\/?div\b[^>]*>/gi
  tags.lastIndex = start
  let depth = 0
  for (const tag of html.matchAll(tags)) {
    if (tag[0].startsWith('</')) depth -= 1
    else if (!tag[0].endsWith('/>')) depth += 1
    if (depth === 0) return html.slice(start, tag.index + tag[0].length)
  }
  assert.fail(`${path} should close its ${marker} wrapper.`)
}

function extractElementById(html, tagName, id, path) {
  const opening = new RegExp(`<${tagName}\\b[^>]*\\bid="${id}"[^>]*>`, 'i').exec(html)
  assert.ok(opening, `${path} should contain its #${id} ${tagName}.`)
  const tags = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi')
  tags.lastIndex = opening.index
  let depth = 0
  for (const tag of html.matchAll(tags)) {
    if (tag[0].startsWith(`</${tagName}`)) depth -= 1
    else depth += 1
    if (depth === 0) return html.slice(opening.index, tag.index + tag[0].length)
  }
  assert.fail(`${path} should close its #${id} ${tagName}.`)
}

function textOf(markup) {
  return markup
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function expectedTitle(path) {
  if (path === '/') return 'Tran Ha Thu | Software Engineering & AI Portfolio'
  const canonicalProjectPaths = {
    '/openclaw_agent/': 'openclaw',
    '/openclaw_agent/info/': 'openclaw',
    '/call_analyzer_chinese_learning/': 'chinese-learning',
    '/call_analyzer_chinese_learning/info/': 'chinese-learning',
    '/traders_edge/': 'traders-edge',
    '/traders_edge/info/': 'traders-edge',
  }
  const legacyProjectPaths = {
    '/projects/openclaw/': 'openclaw',
    '/projects/chinese-learning/': 'chinese-learning',
  }
  const projectId = path.match(/^\/projects\/([^/]+)\/$/)?.[1]
    || canonicalProjectPaths[path]
    || legacyProjectPaths[path]
  if (projectId) {
    const projectTitle = projects.find(({ id }) => id === projectId)?.title
    const infoPath = path.endsWith('/info/') || Object.hasOwn(legacyProjectPaths, path)
    return infoPath ? `${projectTitle} — Full project | Tran Ha Thu` : `${projectTitle} | Tran Ha Thu`
  }
  const section = path.split('/')[1]
  return `${section[0].toUpperCase()}${section.slice(1)} | Tran Ha Thu`
}

assert.deepEqual(portfolioRoutePaths, [
  '/', '/projects/', '/skills/',
  '/projects/foroom/', '/projects/buddy4good/', '/projects/eggbot/',
  '/projects/teleai/', '/projects/foodhero/', '/projects/portfolio/',
  '/openclaw_agent/', '/call_analyzer_chinese_learning/', '/traders_edge/',
  '/openclaw_agent/info/', '/call_analyzer_chinese_learning/info/', '/traders_edge/info/',
], 'The route contract must include three views, six existing detail routes and three overview/writeup route pairs.')
assert.deepEqual(portfolioCompatibilityRoutePaths, [
  '/experience/', '/projects/openclaw/', '/projects/chinese-learning/',
  '/projects/openclaw_agent/', '/projects/call_analyzer_chinese_learning/', '/projects/traders_edge/',
], 'Compatibility aliases should preserve historical pages and the three project paths printed in the supplied resume PDF.')
const compatibilityDestinations = new Map([
  ['/experience/', '/'],
  ['/projects/openclaw/', '/openclaw_agent/info/'],
  ['/projects/chinese-learning/', '/call_analyzer_chinese_learning/info/'],
  ['/projects/openclaw_agent/', '/openclaw_agent/'],
  ['/projects/call_analyzer_chinese_learning/', '/call_analyzer_chinese_learning/'],
  ['/projects/traders_edge/', '/traders_edge/'],
])

const htmlByPath = new Map()
for (const path of portfolioRoutePaths) {
  const html = await readFile(routeFile(path), 'utf8')
  htmlByPath.set(path, html)
  const main = extractMain(html, path)
  assert.equal((main.match(/<h1\b/g) || []).length, 1, `${path} must have one main heading.`)
  assert.match(main, /<h1\b[^>]*>Tran Ha Thu<\/h1>/, `${path} must expose the portfolio owner as its main heading.`)

  const expectedCanonical = `${origin}${path}`
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${path} must have one canonical link.`)
  assert.ok(html.includes(`rel="canonical" href="${expectedCanonical}"`), `${path} canonical must point to its clean route.`)
  assert.equal(html.match(/<title>([\s\S]*?)<\/title>/)?.[1].replaceAll('&amp;', '&'), expectedTitle(path), `${path} must use route-specific metadata.`)
  assert.match(html, /name="description" content="[^"]{50,200}"/)
  assert.doesNotMatch(html, /name="keywords"|noindex/i)
  assert.ok(html.includes(`property="og:url" content="${expectedCanonical}"`))
  assert.ok(html.includes(`property="og:image" content="${canonical}social-preview.png"`))
  assert.match(html, /name="twitter:card" content="summary_large_image"/)

  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null')
  assert.equal(schema?.['@type'], 'ProfilePage')
  assert.equal(schema.url, expectedCanonical)
  assert.equal(schema.mainEntity?.['@type'], 'Person')
  assert.equal(schema.mainEntity.name, 'Tran Ha Thu')
  assert.ok(schema.mainEntity.sameAs.includes('https://github.com/oeggy03'))
  assert.ok(schema.mainEntity.sameAs.includes('https://www.linkedin.com/in/tran-ha-thu/'))

  const sectionIds = [...main.matchAll(/<section\b[^>]*\bid="(experience|projects|skills)"/g)].map((match) => match[1])
  assert.deepEqual(sectionIds, ['experience', 'projects', 'skills'], `${path} must prerender the three routed views for no-JavaScript reading.`)
  const ids = [...main.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(ids).size, ids.length, `${path} must not have duplicate IDs.`)
  const hashLinks = [...main.matchAll(/<a\b[^>]*\bhref="#([^"]+)"/gi)].map((match) => match[1])
  assert.deepEqual(hashLinks, ['portfolio-content', 'work-history', 'education', 'what-im-building'], `${path} may use only the skip link and three explicit Experience in-page links.`)

  for (const [, target] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(target)) continue
    const resolvedUrl = new URL(target, `https://portfolio.invalid${path}`)
    const relativePath = decodeURIComponent(resolvedUrl.pathname).replace(/^\//, '')
    assert.ok(!relativePath.startsWith('src/'), `${path} contains an unbuilt development asset: ${target}`)
    await access(resolve(dist, relativePath || 'index.html'))
  }
}

const rootMain = extractMain(htmlByPath.get('/'), '/')
const rootText = textOf(rootMain)
const experienceStart = rootMain.indexOf('id="experience"')
const projectsStart = rootMain.indexOf('id="projects"')
const landingMarkup = rootMain.slice(experienceStart, projectsStart)
const landingText = textOf(landingMarkup).toLowerCase()
for (const fact of [
  'software engineer', 'as a backend engineer at tiktok', 'i build useful and scalable software.',
  'hey, i’m ha thu, a backend engineer and computer science graduate of the national university of singapore.',
  'i’m committed to building practical, useful software with the future in mind',
  'i enjoy experimenting with new technologies along the way', 'national university of singapore',
  'bachelor of computing', 'computer science', '2022', '2026', 'gpa 4.6/5.0',
  'first class honours', 'distinction in software engineering', "dean's list", 'tiktok',
  'education', 'what i’m building', 'my openclaw lab', 'chinese learning toolkit',
]) assert.ok(landingText.includes(fact), `Experience landing is missing confirmed content: ${fact}`)
for (const project of projects.slice(0, 6)) assert.ok(!landingText.includes(project.title.toLowerCase()), `The landing must not include older project ${project.title}.`)
assert.match(landingMarkup, /<img\b[^>]*alt="Ha Thu outdoors with a camera"/)
const heroNavigation = landingMarkup.match(/<nav\b[^>]*aria-label="Explore this page"[^>]*>([\s\S]*?)<\/nav>/)?.[1]
assert.ok(heroNavigation, 'The hero should group its in-page navigation after the introduction.')
assert.doesNotMatch(heroNavigation, /NUS Computer Science graduate/, 'The hero navigation should not repeat an education teaser.')
const heroLinks = [...heroNavigation.matchAll(/<a\b[^>]*href="#([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, contents]) => ({ href: `#${href}`, label: textOf(contents) }))
assert.deepEqual(heroLinks, [
  { href: '#work-history', label: 'View experience' },
  { href: '#education', label: 'View education' },
  { href: '#what-im-building', label: 'What I’m building' },
], 'The three hero in-page links must be native, named, and follow section order.')
assert.match(landingMarkup, /<section\b[^>]*id="education"/)
assert.match(landingMarkup, /<section\b[^>]*id="what-im-building"/)

for (const project of projects) assert.ok(rootText.includes(project.title), `Missing prerendered project: ${project.title}`)
for (const company of experiences) assert.ok(rootText.includes(company), `Missing prerendered role/employer: ${company}`)
for (const skill of skills) assert.ok(rootText.includes(skill), `Missing prerendered skill: ${skill}`)
const roleSection = landingMarkup.match(/<section\b[^>]*id="work-history"[^>]*>([\s\S]*?)<\/section>/)?.[1]
assert.ok(roleSection, 'The nested role timeline must use the #work-history ID.')
const detailsTag = roleSection.match(/<details\b[^>]*>/)?.[0]
assert.ok(detailsTag && !/\sopen(?:\s|=|>)/i.test(detailsTag), 'Earlier roles must be collapsed on a fresh static load.')
assert.match(roleSection, /<summary\b[^>]*>[\s\S]*?I also engineered at[\s\S]*?View earlier experience/i)
assert.match(roleSection, /Hide earlier experience/)
assert.ok(roleSection.indexOf('data-experience-id="tiktok-backend"') < roleSection.indexOf('<details'), 'The current role must remain visible before the native disclosure.')

const expectedExperienceDates = [
  'Jul 2026 - Present', 'Jan 2026 - Mar 2026', 'Aug 2023 - Dec 2025', 'Jun 2025 - Sep 2025',
  'Jan 2025 - Jun 2025', 'May 2024 - Aug 2024', 'May 2023 - Aug 2023', 'Dec 2019 - Jan 2020',
]
const experienceText = textOf(roleSection)
const experienceDates = [...experienceText.matchAll(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(?:to\s+)?(?:Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/g)]
  .map((match) => match[0].replace(/\s+to\s+/gi, ' ').replace(/\s+/g, ' ').replace(/[–—]/g, '-').replace(/\s*-\s*/g, ' - '))
assert.deepEqual(experienceDates, expectedExperienceDates)
assert.deepEqual([...roleSection.matchAll(/<time\b[^>]*dateTime="([^"]+)"/g)].map((match) => match[1]), [
  '2026-07', '2026-01', '2026-03', '2023-08', '2025-12', '2025-06', '2025-09',
  '2025-01', '2025-06', '2024-05', '2024-08', '2023-05', '2023-08', '2019-12', '2020-01',
])
assert.equal((experienceText.match(/\bTikTok\b/g) || []).length, 2)
assert.match(experienceText, /Backend and Site Reliability Engineer/)
assert.match(experienceText, /12 teams.{0,70}200 unique users/i)
assert.match(experienceText, /around 50 service issues each week/i)
assert.match(experienceText, /close to \$5 million/)
assert.match(experienceText, /English and Chinese/)
assert.match(experienceText, /Artificial Intelligence Intern/)
assert.match(experienceText, /average.{0,30}88% accuracy/i)
assert.match(experienceText, /80%/)
assert.match(experienceText, /1,000 students/)
assert.match(experienceText, /4\.8\/5.{0,40}4\.7\/5/i)
assert.match(experienceText, /300 staff/)
assert.match(experienceText, /100 customers/)
assert.match(experienceText, /100 production and raw database tables/)
assert.match(experienceText, /10 types of trash/)
assert.ok(experienceText.indexOf('National University of Singapore') < experienceText.indexOf('GIC'))

const resumeSource = await readFile(resolve(dist, '..', 'docs', 'resume.html'), 'utf8')
for (const fact of [
  'Backend and Site Reliability Engineer', '12 teams', '200 unique users', 'around 50 service issues',
  'close to $5 million', 'English and Chinese', '1,000 students', '100 customers',
]) assert.ok(resumeSource.includes(fact), `The HTML resume source should retain the supplied resume fact: ${fact}.`)
for (const path of [
  '/projects/openclaw_agent/',
  '/projects/call_analyzer_chinese_learning/',
  '/projects/traders_edge/',
]) assert.ok(resumeSource.includes(`href="https://www.tranhathu.com${path}"`), `The HTML resume should keep its supplied project link ${path}.`)

const expectedOldDestinations = {
  foroom: [
    'https://devpost.com/software/foroom', 'https://github.com/oeggy03/cvwo-frontend', 'https://github.com/oeggy03/cvwo-backend',
  ],
  buddy4good: [
    'https://oeggy03.github.io/h4g-frontend/', 'https://devpost.com/software/buddy4good',
    'https://github.com/oeggy03/h4g-frontend', 'https://github.com/oeggy03/h4g-backend',
  ],
  eggbot: [
    'https://github.com/oeggy03/ip/releases/tag/A-Release', 'https://oeggy03.github.io/ip/', 'https://github.com/oeggy03/ip',
  ],
  teleai: ['https://oeggy03.github.io/TeleAI/', 'https://github.com/oeggy03/TeleAI'],
  foodhero: [
    'https://oeggy03.github.io/FoodHeroBot/', 'https://devpost.com/software/kalilinux', 'https://github.com/oeggy03/FoodHeroBot',
  ],
  portfolio: ['https://github.com/oeggy03/oeggy03.github.io'],
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
const projectsMainMarkup = extractMain(htmlByPath.get('/projects/'), '/projects/')
const projectIndexMarkup = extractDivWithMarker(projectsMainMarkup, 'data-project-index', '/projects/')
assert.equal((projectIndexMarkup.match(/<article\b/g) || []).length, projects.length, 'The Projects view must include all nine current projects.')
for (const project of projects) {
  const projectId = project.id
  const projectPath = projectPaths[projectId]
  assert.ok(projectPath, `Missing declared detail route for ${projectId}.`)
  assert.ok(projectIndexMarkup.includes(`href="${projectPath}"`), `Missing project index card route: ${projectPath}`)
  const projectMarkup = extractMain(htmlByPath.get(projectPath), projectPath)
  for (const destination of expectedOldDestinations[projectId] || []) assert.ok(projectMarkup.includes(`href="${destination}"`), `Missing original ${projectId} project destination: ${destination}`)
  for (const destination of project.links || []) assert.ok(projectMarkup.includes(`href="${destination.href}"`), `Missing ${projectId} card destination: ${destination.href}`)
}

for (const [projectId, path, sectionTitles, destinations] of [
  ['openclaw', '/openclaw_agent/info/', ['Why I started', 'What it does', 'Architecture and components', 'Examples', 'Deployment', 'Currently working on and future plans'], [
    'https://docs.openclaw.ai/', 'https://developers.openai.com/api/docs/', 'https://github.com/microsoft/playwright-mcp',
    'https://github.com/CortexReach/memory-lancedb-pro', 'https://developers.openai.com/api/docs/guides/decisions',
  ]],
  ['chinese-learning', '/call_analyzer_chinese_learning/info/', ['Why I started', 'What it does', 'How it works', 'Examples', 'Deployment', 'Currently working on and future plans'], [
    'https://github.com/oeggy03/call_analyzer', 'https://github.com/oeggy03/call_analyzer_lesson_db', 'https://github.com/oeggy03/call_analyzer_active_recall',
  ]],
  ['traders-edge', '/traders_edge/info/', ['What it does', 'How the simulation is modelled', 'Inside the game and its data model'], ['https://github.com/Traders-Edge/traders_edge']],
]) {
  const markup = extractMain(htmlByPath.get(path), path)
  const caseMarkup = extractElementById(markup, 'article', `project-${projectId}`, path)
  assert.ok(caseMarkup.includes(`id="project-${projectId}"`), `${path} must render its case study article.`)
  assert.ok(caseMarkup.includes(`id="project-heading-${projectId}"`))
  assert.ok(caseMarkup.includes(`href="${projectPaths[projectId]}"`), `${path} should link back to its project overview card.`)
  for (const title of sectionTitles) assert.ok(caseMarkup.includes(title), `${path} should include the ${title} section.`)
  for (const destination of destinations) assert.ok(caseMarkup.includes(`href="${destination}"`), `${path} should preserve resource ${destination}.`)
  assert.ok(!markup.includes('href="/experience/"'))
  const imageTags = [...caseMarkup.matchAll(/<img\b[^>]*\balt="([^"]*)"[^>]*>/g)]
  if (projectId === 'traders-edge') {
    assert.ok(imageTags.length >= 4, 'Trader’s Edge should include the project cover and several selected report figures.')
    assert.ok(imageTags.every(([, alt]) => alt.trim().length > 20), 'Each Trader’s Edge cover and report image should have descriptive alternative text.')
  }
}

const overviewPaths = [projectPaths.openclaw, projectPaths['chinese-learning'], projectPaths['traders-edge']]
for (const path of overviewPaths) {
  const routeMarkup = extractMain(htmlByPath.get(path), path)
  assert.match(routeMarkup, /href="[^"]+\/info\/"[^>]*>[\s\S]*?Read full/i, `${path} must expose a native full-writeup link in the server-rendered overview.`)
  assert.ok(!routeMarkup.includes('Architecture and components'), `${path} overview must not reveal the full case study before the primary action.`)
}

const openClawText = textOf(extractMain(htmlByPath.get('/openclaw_agent/info/'), '/openclaw_agent/info/')).toLowerCase()
for (const fact of ['lancedb', 'playwright mcp', 'openai', 'windows wsl', 'stopped before checkout', 'runs locally']) assert.ok(openClawText.includes(fact), `OpenClaw case study should retain ${fact}.`)
assert.doesNotMatch(openClawText, /cloud deployment is live|deployed to the cloud/)
const chineseText = textOf(extractMain(htmlByPath.get('/call_analyzer_chinese_learning/info/'), '/call_analyzer_chinese_learning/info/')).toLowerCase()
for (const fact of ['openrouter', 'sqlite', 'supabase', 'google cloud run', 'telegram', 'ten']) assert.ok(chineseText.includes(fact), `Chinese Learning case study should retain ${fact}.`)

const tradersText = textOf(extractMain(htmlByPath.get('/traders_edge/info/'), '/traders_edge/info/')).toLowerCase()
for (const fact of ['level_news_events', 'level_news_event_effects', 'level_news_event_tickers', 'order book', 'fictional', 'jsonb']) {
  assert.ok(tradersText.includes(fact), `Trader’s Edge writeup should include sourced project detail: ${fact}.`)
}

for (const path of portfolioCompatibilityRoutePaths) {
  const aliasHtml = await readFile(routeFile(path), 'utf8')
  const aliasMain = extractMain(aliasHtml, path)
  const targetPath = compatibilityDestinations.get(path)
  assert.ok(targetPath, `${path} should have an explicitly reviewed compatibility destination.`)
  assert.equal(aliasHtml.match(/<title>([\s\S]*?)<\/title>/)?.[1].replaceAll('&amp;', '&'), expectedTitle(targetPath), `${path} should serve the destination's metadata.`)
  if (path === '/experience/') {
    assert.ok(aliasMain.includes('id="experience"') && aliasMain.includes('id="work-history"'))
    assert.ok(aliasMain.includes('data-experience-id="tiktok-backend"') && aliasMain.includes('data-experience-id="astar"'))
    assert.doesNotMatch(aliasMain.match(/<details\b[^>]*>/)?.[0] || '', /\sopen(?:\s|=|>)/i)
    assert.ok(aliasHtml.includes(`rel="canonical" href="${canonical}"`))
    assert.ok(aliasMain.includes('Skip to content'))
  } else {
    const resolved = resolvePortfolioRoute(path)
    const projectId = resolved.projectId
    assert.ok(projectId, `${path} should resolve to a known project.`)
    assert.ok(aliasMain.includes(`id="project-heading-${projectId}"`), `${path} should keep the expected project view.`)
    assert.ok(aliasHtml.includes(`rel="canonical" href="${origin}${targetPath}"`), `${path} should canonicalize to ${targetPath}.`)
    if (resolved.projectView === 'info') {
      assert.ok(aliasMain.includes(`href="${projectPaths[projectId]}"`), `${path} should preserve navigation to its new overview.`)
      assert.ok(aliasMain.includes('Architecture and components') || aliasMain.includes('How it works'), `${path} should keep its legacy full-writeup content.`)
    } else {
      assert.ok(aliasMain.includes(`href="${projectPaths[projectId]}info/"`), `${path} should expose the full writeup from its overview.`)
      assert.ok(aliasMain.includes('Read full project'), `${path} should keep the native full-writeup action usable without JavaScript.`)
    }
  }
}

assert.doesNotMatch(rootMain, /href="mailto:tranhathuwork@gmail\.com"/i, 'The email action should copy the address, not launch a mail client.')
assert.match(rootMain, /<button\b(?=[^>]*aria-label="Copy work email to clipboard")(?=[^>]*data-copy-email)[^>]*>/, 'The email copy action needs an accessible button label and a stable selector.')
assert.match(rootMain, /data-copy-email-announcement[^>]*role="status"|role="status"[^>]*data-copy-email-announcement/, 'The shared shell should include a dedicated polite live region for copy confirmation.')
assert.match(rootMain, /href="https:\/\/github\.com\/oeggy03"[^>]*aria-label="Tran Ha Thu on GitHub"/)
assert.match(rootMain, /href="https:\/\/www\.linkedin\.com\/in\/tran-ha-thu\/"[^>]*aria-label="Tran Ha Thu on LinkedIn"/)
const resumeLink = rootMain.match(/<a\b[^>]*href="([^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/i)
assert.ok(resumeLink, 'The shared shell should expose the local PDF resume.')
assert.match(resumeLink[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), /\bResume\b/i)

const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8')
assert.match(robots, /User-agent: \*/)
assert.match(robots, /Allow: \//)
assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`))
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'))
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), portfolioRoutePaths.map((path) => `${origin}${path}`))
assert.equal((await readFile(resolve(dist, 'CNAME'), 'utf8')).trim(), new URL(canonical).hostname)
await access(resolve(dist, '.nojekyll'))

const preview = await readFile(resolve(dist, 'social-preview.png'))
assert.equal(preview.subarray(1, 4).toString(), 'PNG')
assert.equal(preview.readUInt32BE(16), 1200)
assert.equal(preview.readUInt32BE(20), 630)

console.log(`SEO checks passed: ${portfolioRoutePaths.length} prerendered routes, ${portfolioCompatibilityRoutePaths.length} compatibility routes, route metadata, role/project facts, structured data, local assets, sitemap, and GitHub Pages files.`)
