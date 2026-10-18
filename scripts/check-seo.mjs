import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { portfolioRoutePaths, resolvePortfolioRoute } from '../src/navigation/routes.js'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const origin = 'https://www.tranhathu.com'
const canonical = `${origin}/`
const projects = ['FoROOM', 'Buddy4Good', 'Eggbot', 'TeleAI', 'FoodHero', 'Portfolio Website']
const projectIds = ['foroom', 'buddy4good', 'eggbot', 'teleai', 'foodhero', 'portfolio']
const experiences = [
  'TikTok',
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

function routeFile(path) {
  return resolve(dist, path === '/' ? 'index.html' : `${path.slice(1)}index.html`)
}

function extractMain(html, path) {
  const main = html.match(/<main\b[^>]*id="root"[^>]*>([\s\S]*?)<\/main>/)?.[1]
  assert.ok(main, `${path} must contain a prerendered portfolio root.`)
  return main
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
  const projectId = path.match(/^\/projects\/([^/]+)\/$/)?.[1]
  if (projectId) return `${projects[projectIds.indexOf(projectId)]} | Tran Ha Thu`
  const section = path.split('/')[1]
  return `${section[0].toUpperCase()}${section.slice(1)} | Tran Ha Thu`
}

assert.deepEqual(portfolioRoutePaths, [
  '/', '/projects/', '/experience/', '/skills/',
  '/projects/foroom/', '/projects/buddy4good/', '/projects/eggbot/',
  '/projects/teleai/', '/projects/foodhero/', '/projects/portfolio/',
], 'The route contract must include the homepage, all sections, and all six project detail paths.')

const htmlByPath = new Map()
for (const path of portfolioRoutePaths) {
  const html = await readFile(routeFile(path), 'utf8')
  htmlByPath.set(path, html)
  const main = extractMain(html, path)
  assert.equal((main.match(/<h1\b/g) || []).length, 1, `${path} must have one main heading.`)
  assert.match(main, /<h1\b[^>]*>Tran Ha Thu<\/h1>/, `${path} must expose the portfolio owner as the main heading.`)

  const expectedCanonical = `${origin}${path}`
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${path} must have one canonical link.`)
  assert.ok(html.includes(`rel="canonical" href="${expectedCanonical}"`), `${path} canonical must point to its clean route.`)
  const actualTitle = html.match(/<title>([\s\S]*?)<\/title>/)?.[1].replaceAll('&amp;', '&')
  assert.equal(actualTitle, expectedTitle(path), `${path} must use route-specific title metadata.`)
  assert.match(html, /name="description" content="[^"]{50,200}"/, `${path} must include a useful meta description.`)
  assert.doesNotMatch(html, /name="keywords"|noindex/i, `${path} must remain indexable without obsolete keywords metadata.`)
  assert.ok(html.includes(`property="og:url" content="${expectedCanonical}"`), `${path} Open Graph URL must match its canonical.`)
  assert.ok(html.includes(`property="og:image" content="${canonical}social-preview.png"`), `${path} must share the portfolio social image.`)
  assert.match(html, /name="twitter:card" content="summary_large_image"/)

  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null')
  assert.equal(schema?.['@type'], 'ProfilePage', `${path} must retain ProfilePage structured data.`)
  assert.equal(schema.url, expectedCanonical, `${path} structured data URL must match its canonical.`)
  assert.equal(schema.mainEntity?.['@type'], 'Person')
  assert.equal(schema.mainEntity.name, 'Tran Ha Thu')
  assert.ok(schema.mainEntity.sameAs.includes('https://github.com/oeggy03'))
  assert.ok(schema.mainEntity.sameAs.includes('https://www.linkedin.com/in/tran-ha-thu/'))

  const sectionIds = [...main.matchAll(/<section\b[^>]*\bid="(overview|projects|experience|skills)"/g)].map((match) => match[1])
  assert.deepEqual(sectionIds, ['overview', 'projects', 'experience', 'skills'], `${path} must prerender all four content sections for accessible navigation and no-JavaScript reading.`)
  const ids = [...main.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(ids).size, ids.length, `${path} must not have duplicate IDs.`)
  assert.doesNotMatch(main, /<a\b[^>]*\bhref="#/i, `${path} must not author in-page hash navigation links.`)

  // Check every root-relative or page-relative local link and asset against the built output.
  for (const [, target] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(target)) continue
    const resolvedUrl = new URL(target, `https://portfolio.invalid${path}`)
    const relativePath = decodeURIComponent(resolvedUrl.pathname).replace(/^\//, '')
    assert.ok(!relativePath.startsWith('src/'), `${path} contains an unbuilt development asset: ${target}`)
    await access(resolve(dist, relativePath || 'index.html'))
  }
}

const rootHtml = htmlByPath.get('/')
const rootMain = extractMain(rootHtml, '/')
const rootText = textOf(rootMain)
const overviewMarkup = rootMain.slice(rootMain.indexOf('id="overview"'), rootMain.indexOf('id="projects"'))
const overviewText = textOf(overviewMarkup).toLowerCase()
for (const fact of [
  'software engineer',
  'building useful software with care',
  'national university of singapore',
  'bachelor of computing',
  'computer science',
  '2022', '2026',
  'gpa 4.6/5.0',
  'first class honours',
  'distinction in software engineering',
  "dean's list",
  'tiktok',
]) {
  assert.ok(overviewText.includes(fact), `Overview is missing confirmed profile fact: ${fact}`)
}
for (const project of projects) {
  assert.ok(!overviewText.includes(project.toLowerCase()), `Overview must not include the project name ${project}.`)
}
assert.doesNotMatch(overviewMarkup, /<img\b[^>]*(?:proj_images|social-preview)/i, 'Overview must not contain project imagery.')
assert.doesNotMatch(overviewMarkup, /<a\b[^>]*href="\/projects\//i, 'Overview must not contain project detail links.')
assert.doesNotMatch(rootText, /Built with care in Singapore|Singapore\s*[·•]\s*NUS Computer Science/i, 'Retired footer and sidebar location copy must be absent.')

for (const project of projects) assert.ok(rootText.includes(project), `Missing prerendered project: ${project}`)
for (const company of experiences) assert.ok(rootText.includes(company), `Missing prerendered current or historical experience: ${company}`)
for (const skill of skills) assert.ok(rootText.includes(skill), `Missing prerendered skill: ${skill}`)

const experienceSection = rootMain.slice(rootMain.indexOf('id="experience"'), rootMain.indexOf('id="skills"'))
const experienceText = textOf(experienceSection)
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
const experienceDates = [...experienceText.matchAll(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(?:to\s+)?(?:Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/g)]
  .map((match) => match[0].replace(/\s+to\s+/gi, ' ').replace(/\s+/g, ' ').replace(/[–—]/g, '-').replace(/\s*-\s*/g, ' - '))
assert.deepEqual(experienceDates, expectedExperienceDates, 'The eight user-supplied roles must appear with their exact dates and completed roles ordered by end date.')
const expectedExperienceDateTimes = [
  '2026-07', '2026-01', '2026-03', '2023-08', '2025-12', '2025-06', '2025-09', '2025-01', '2025-06',
  '2024-05', '2024-08', '2023-05', '2023-08', '2019-12', '2020-01',
]
const experienceDateTimes = [...experienceSection.matchAll(/<time\b[^>]*dateTime="([^"]+)"/g)].map((match) => match[1])
assert.deepEqual(experienceDateTimes, expectedExperienceDateTimes, 'Every timeline role must preserve its confirmed machine-readable month bounds.')
assert.equal((experienceText.match(/\bTikTok\b/g) || []).length, 2, 'The experience timeline must keep both distinct TikTok roles.')
assert.ok(experienceText.includes('Backend Engineer'), 'The current TikTok Backend Engineer title must be shown.')
assert.ok(experienceText.includes('Artificial Intelligence Intern'), 'The A*STAR role must retain the supplied title.')
assert.match(experienceText, /average.{0,30}88% accuracy/i, 'The HDB entry must retain the supplied average accuracy metric.')
assert.ok(experienceText.indexOf('National University of Singapore') < experienceText.indexOf('GIC'), 'The NUS role ending in Dec 2025 must precede the GIC role ending in Sep 2025.')

for (const [href, accessibleLabel] of [
  ['mailto:tranhathuwork@gmail.com', 'Email Tran Ha Thu'],
  ['https://github.com/oeggy03', 'Tran Ha Thu on GitHub'],
  ['https://www.linkedin.com/in/tran-ha-thu/', 'Tran Ha Thu on LinkedIn'],
]) {
  assert.ok(rootMain.includes(`href="${href}"`), `Missing profile action destination: ${href}`)
  assert.ok(rootMain.includes(`aria-label="${accessibleLabel}"`), `Missing accessible profile action label: ${accessibleLabel}`)
}
const resumeLink = rootMain.match(/<a\b[^>]*href="([^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/i)
assert.ok(resumeLink, 'The shared shell should expose a local PDF resume action.')
assert.match(resumeLink[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), /\bResume\b/i)

const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8')
assert.match(robots, /User-agent: \*/)
assert.match(robots, /Allow: \//)
assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`))
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'))
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), portfolioRoutePaths.map((path) => `${origin}${path}`), 'The sitemap must list every canonical section and project route exactly once.')
assert.equal((await readFile(resolve(dist, 'CNAME'), 'utf8')).trim(), new URL(canonical).hostname)
await access(resolve(dist, '.nojekyll'))

const preview = await readFile(resolve(dist, 'social-preview.png'))
assert.equal(preview.subarray(1, 4).toString(), 'PNG', 'The social preview must be a PNG.')
assert.equal(preview.readUInt32BE(16), 1200, 'The social preview width should be 1200 pixels.')
assert.equal(preview.readUInt32BE(20), 630, 'The social preview height should be 630 pixels.')

console.log(`SEO checks passed: ${portfolioRoutePaths.length} prerendered routes, route metadata, confirmed profile facts, structured data, local links/assets, sitemap, and Pages files.`)
