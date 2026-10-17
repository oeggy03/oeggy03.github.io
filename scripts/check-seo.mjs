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
]
for (const item of [...projects, ...experiences, ...coreSkills]) {
  assert.ok(crawlableText.includes(item), `Missing prerendered portfolio content: ${item}`)
}
for (const item of [
  'Computer Science',
  'Quantitative Finance',
  'Management',
  'tranhathu@u.nus.edu',
  'linkedin.com/in/tran-ha-thu/',
  'github.com/oeggy03',
]) {
  assert.ok(crawlableText.includes(item), `Missing crawlable profile/contact content: ${item}`)
}

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
