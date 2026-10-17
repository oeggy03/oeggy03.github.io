import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const canonical = 'https://www.tranhathu.com/'
const html = await readFile(resolve(dist, 'index.html'), 'utf8')
const main = html.match(/<main id="root">([\s\S]*)<\/main>/)?.[1]
assert.ok(main, 'The built HTML must contain prerendered portfolio content.')
assert.equal((main.match(/<h1\b/g) || []).length, 1, 'The page must have one main heading.')
assert.match(main, /<h1[^>]*>Tran Ha Thu<\/h1>/)
for (const text of ['About Me', 'Experience', 'Eggbot', 'TeleAI', 'FoROOM', 'Buddy4Good', 'Contact Me']) {
  assert.ok(main.includes(text), `Missing crawlable content: ${text}`)
}
assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
assert.ok(html.includes(`rel="canonical" href="${canonical}"`))
assert.match(html, /<title>Tran Ha Thu[^<]+<\/title>/)
assert.match(html, /name="description" content="[^"]{50,170}"/)
assert.doesNotMatch(html, /name="keywords"|noindex/)
assert.ok(html.includes(`property="og:url" content="${canonical}"`))
assert.ok(html.includes('name="twitter:card" content="summary_large_image"'))

const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null')
assert.equal(schema?.['@type'], 'ProfilePage')
assert.equal(schema.url, canonical)
assert.equal(schema.mainEntity['@type'], 'Person')
assert.equal(schema.mainEntity.name, 'Tran Ha Thu')
assert.ok(schema.mainEntity.sameAs.includes('https://github.com/oeggy03'))
assert.ok(schema.mainEntity.sameAs.includes('https://www.linkedin.com/in/tran-ha-thu/'))

// Check that prerendering uses the deployed assets, not /src/ development URLs.
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))
for (const [, target] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (target.startsWith('#')) {
    assert.ok(ids.has(target.slice(1)), `Section link has no target: ${target}`)
  } else if (!/^(?:[a-z]+:|\/\/)/i.test(target)) {
    assert.ok(!target.includes('/src/'), `Unbuilt development asset: ${target}`)
    const file = resolve(dist, target.replace(/^\//, '').split(/[?#]/)[0])
    await access(file)
  }
}
assert.doesNotMatch(main, /<a\b[^>]*>\s*<a\b/, 'Links must not be nested.')
for (const [, image] of main.matchAll(/(<img\b[^>]*>)/g)) {
  assert.match(image, /alt="[^"]+"/, 'Content images must have descriptive alternatives.')
}

const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8')
assert.match(robots, /User-agent: \*/)
assert.match(robots, /Allow: \//)
assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`))
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'))
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]), [canonical])
assert.equal((await readFile(resolve(dist, 'CNAME'), 'utf8')).trim(), new URL(canonical).hostname)
await access(resolve(dist, '.nojekyll'))
const preview = await readFile(resolve(dist, 'social-preview.png'))
assert.equal(preview.subarray(1, 4).toString(), 'PNG')
assert.ok(html.includes(`property="og:image" content="${canonical}social-preview.png"`))
console.log('SEO checks passed: prerendered content, metadata, structured data, assets, links, sitemap, and domain files.')
