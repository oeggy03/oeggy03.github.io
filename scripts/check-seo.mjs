import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const canonical = 'https://www.tranhathu.com/'
const html = await readFile(resolve(dist, 'index.html'), 'utf8')
const main = html.match(/<main\b[^>]*id="root"[^>]*>([\s\S]*?)<\/main>/)?.[1]
assert.ok(main, 'The built HTML must contain a prerendered portfolio root.')
assert.equal((main.match(/<h1\b/g) || []).length, 1, 'The page must have one main heading.')
assert.match(main, /<h1\b[^>]*>Tran Ha Thu<\/h1>/)

const crawlableText = main
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&#39;|&#x27;/gi, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')

const viewIds = [...main.matchAll(/<section\b[^>]*\bid="(overview|projects|experience|skills)"/g)].map((match) => match[1])
assert.deepEqual(viewIds, ['overview', 'projects', 'experience', 'skills'], 'Prerendered output must expose exactly the four portfolio views in order.')
assert.doesNotMatch(main, /<section\b[^>]*\bid="(?:about|contact)"/, 'About and Contact must not remain as portfolio views.')

const overviewStart = main.search(/<section\b[^>]*\bid="overview"/)
const projectsStart = main.search(/<section\b[^>]*\bid="projects"/)
assert.ok(overviewStart >= 0 && projectsStart > overviewStart, 'The prerendered Overview should precede Projects.')
const overviewMarkup = main.slice(overviewStart, projectsStart)
const overviewText = overviewMarkup
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&#39;|&#x27;/gi, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')
  .toLowerCase()
for (const fact of [
  'backend / software engineer',
  'software engineering',
  'quantitative finance and trading',
  'artificial intelligence',
  'useful software',
  'national university of singapore',
  'computer science',
  'quantitative finance',
  'management',
  'data analysis / machine learning intern',
  'housing development board (hdb)',
  'may 2024 - present',
]) {
  assert.ok(overviewText.includes(fact), `Overview is missing profile fact: ${fact}`)
}

const projects = ['FoROOM', 'Buddy4Good', 'Eggbot', 'TeleAI', 'FoodHero', 'Portfolio Website']
const experiences = [
  'Housing Development Board (HDB)',
  'CareForWe (Healthtech startup)',
  'National University of Singapore',
  'Eastspring Investments Singapore',
  'A*STAR - Agency for Science, Technology and Research',
]
const coreSkills = [
  'Git', 'Object-oriented programming', 'HTML', 'CSS', 'JavaScript', 'React', 'Go',
  'Express.js', 'MySQL', 'PostgreSQL', 'Microsoft SQL Server', 'Java', 'Python', 'C++',
  'JWT', 'bcrypt', 'SQLite', 'Pandas', 'OpenCV', 'TensorFlow', 'Keras', 'JavaFX',
]
const experienceDates = [
  'May 2024 - Present', 'Dec 2023 - Present', 'Aug 2023 - Present',
  'May 2023 - Aug 2023', 'Dec 2019 - Jan 2020',
]
for (const item of [...projects, ...experiences, ...coreSkills, ...experienceDates]) {
  assert.ok(crawlableText.includes(item), `Missing prerendered portfolio content: ${item}`)
}
for (const item of [
  'Computer Science',
  'Quantitative Finance',
  'Management',
]) {
  assert.ok(overviewText.includes(item.toLowerCase()), `Missing Overview profile content: ${item}`)
}

for (const project of projects) {
  assert.ok(!overviewText.includes(project.toLowerCase()), `Overview must not include the project name ${project}`)
}
assert.doesNotMatch(overviewMarkup, /href="#project-|id="project-|aria-label="Choose a project"|Filter projects/i, 'Overview must not contain project detail or chooser UI.')

for (const [href, accessibleLabel] of [
  ['mailto:tranhathu@u.nus.edu', 'Email Tran Ha Thu'],
  ['https://github.com/oeggy03', 'Tran Ha Thu on GitHub'],
  ['https://www.linkedin.com/in/tran-ha-thu/', 'Tran Ha Thu on LinkedIn'],
]) {
  assert.ok(main.includes(`href="${href}"`), `Missing profile action destination: ${href}`)
  assert.ok(main.includes(`aria-label="${accessibleLabel}"`), `Missing accessible profile action label: ${accessibleLabel}`)
}
const resumeLink = main.match(/<a\b[^>]*href="([^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/i)
assert.ok(resumeLink, 'The shared shell should expose a local PDF resume action.')
const resumeLabel = resumeLink[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
assert.match(resumeLabel, /\bResume\b/i, 'The resume action should have a visible Resume label.')

assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
assert.ok(html.includes(`rel="canonical" href="${canonical}"`))
assert.match(html, /<title>Tran Ha Thu[^<]+<\/title>/)
assert.match(html, /name="description" content="[^"]{50,170}"/)
assert.doesNotMatch(html, /name="keywords"|noindex/i)
assert.ok(html.includes(`property="og:url" content="${canonical}"`))
assert.ok(html.includes(`property="og:image" content="${canonical}social-preview.png"`))
assert.ok(html.includes('name="twitter:card" content="summary_large_image"'))

const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null')
assert.equal(schema?.['@type'], 'ProfilePage')
assert.equal(schema.url, canonical)
assert.equal(schema.mainEntity?.['@type'], 'Person')
assert.equal(schema.mainEntity.name, 'Tran Ha Thu')
assert.ok(schema.mainEntity.sameAs.includes('https://github.com/oeggy03'))
assert.ok(schema.mainEntity.sameAs.includes('https://www.linkedin.com/in/tran-ha-thu/'))

// Verify that prerendered links and images refer to deployed output, with no duplicate IDs.
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
assert.equal(new Set(ids).size, ids.length, 'Prerendered markup must not contain duplicate IDs.')
const idSet = new Set(ids)
for (const alias of ['about', 'aboutSection', 'contact', 'contactSec']) {
  assert.ok(idSet.has(alias), `The retired ${alias} fragment should retain a prerendered alias target.`)
}
for (const [, target] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (target.startsWith('#')) {
    assert.ok(idSet.has(target.slice(1)), `Section link has no prerendered target: ${target}`)
  } else if (!/^(?:[a-z]+:|\/\/)/i.test(target)) {
    assert.ok(!target.includes('/src/'), `Unbuilt development asset: ${target}`)
    const file = resolve(dist, target.replace(/^\//, '').split(/[?#]/)[0])
    await access(file)
  }
}
assert.doesNotMatch(main, /<a\b[^>]*>\s*<a\b/, 'Links must not be nested.')
for (const [, image] of main.matchAll(/(<img\b[^>]*>)/g)) {
  assert.match(image, /\balt="[^"]*"/, 'Content images must declare an alternative (empty for decorative images).')
}

const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8')
assert.match(robots, /User-agent: \*/)
assert.match(robots, /Allow: \//)
assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`))
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'))
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), [canonical])
assert.equal((await readFile(resolve(dist, 'CNAME'), 'utf8')).trim(), new URL(canonical).hostname)
await access(resolve(dist, '.nojekyll'))

const preview = await readFile(resolve(dist, 'social-preview.png'))
assert.equal(preview.subarray(1, 4).toString(), 'PNG', 'The social preview must be a PNG.')
assert.equal(preview.readUInt32BE(16), 1200, 'The social preview width should be 1200 pixels.')
assert.equal(preview.readUInt32BE(20), 630, 'The social preview height should be 630 pixels.')

console.log('SEO checks passed: prerendered portfolio content, canonical metadata, structured data, local links/assets, sitemap, and Pages files.')
