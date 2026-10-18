# GitHub Pages, domain, and search setup

## Current publishing configuration

GitHub Pages uses branch publishing from `gh-pages` at the repository root, with `https://www.tranhathu.com/` as the site URL. The workflow at `.github/workflows/deploy-pages.yml` runs the quality checks for pull requests to `main`. When a commit reaches `main`, it runs lint, builds and prerenders the site, checks SEO and assets, runs the browser/accessibility suite, then publishes the same verified `dist/` artifact to `gh-pages`. The existing Pages branch setting serves that output; no Pages source change is needed. Feature branch pushes do not publish the site.

The workflow uses the built-in `GITHUB_TOKEN` with repository content write permission to update `gh-pages`; it requires no personal access token or other deploy secret. GitHub's Pages branch publisher then builds the updated site. Check both the **Verify and deploy portfolio** run and the **pages build and deployment** run in the Actions tab after a merge.

For an authorized manual publish from a checked out branch, run:

```sh
npm run deploy
```

The `predeploy` script builds first. `gh-pages -d dist --dotfiles` then publishes the generated files to the `gh-pages` branch, including `.nojekyll`. Prefer the automated workflow for changes merged into `main`; it runs checks and only deploys after they pass. A successful push to `gh-pages` alone does not confirm that GitHub finished publishing the site.

In the repository **Settings > Pages**, use:

- Source: **Deploy from a branch**.
- Branch: **gh-pages**, folder: **/ (root)**.
- Custom domain: **www.tranhathu.com**.
- Enable **Enforce HTTPS** after GitHub provisions the certificate.

If GitHub Actions cannot write to `gh-pages`, confirm the workflow token has repository content write access under the repository's Actions settings. After any publish, check the Pages build and deployment run and the deployed site URL.

## Domain and DNS

Namecheap hosts DNS; GitHub Pages hosts the website. In Namecheap **Domain List > Manage > Advanced DNS**, use:

| Type | Host | Value |
| --- | --- | --- |
| CNAME | www | oeggy03.github.io |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Use Automatic or 30-minute TTL. Remove conflicting parking and URL redirect records for `@` and `www`; keep unrelated email and verification records. `@` represents `tranhathu.com`. TTL controls how long DNS answers can be cached and is separate from domain registration expiry. GitHub redirects the bare domain to `www` when both are configured correctly. DNS updates and HTTPS certificate provisioning can take time.

`public/CNAME` preserves the domain in each build. `public/.nojekyll` tells Pages to serve the compiled site without a Jekyll build. Keep both in the source tree; publishing can replace files on the generated branch if they are missing from `dist/`.

## Search visibility

The generated homepage includes a descriptive title and description, HTTPS canonical URL, ProfilePage/Person JSON-LD, Open Graph and Twitter card metadata using `public/social-preview.png`, crawl permissions in `public/robots.txt`, and a sitemap containing the homepage. Section hashes are parts of the same page, not separate URLs. Metadata helps crawlers understand the site but does not guarantee indexing or rankings.

### Ask Google to discover the site

1. Open [Google Search Console](https://search.google.com/search-console/).
2. Add a **Domain property** for `tranhathu.com` and add the exact TXT verification record supplied by Google to Namecheap DNS. Keep the website records above.
3. Submit `https://www.tranhathu.com/sitemap.xml` in **Sitemaps**.
4. Inspect `https://www.tranhathu.com/`, run **Test live URL**, and use **Request indexing** when available.
5. Link to the canonical portfolio URL from the GitHub and LinkedIn profiles.

These steps require the owner's Google and profile accounts; repository deployment does not perform them. Indexing and search appearance are controlled by search engines and can take time.

Google ignores the old `meta keywords` tag, which is not included. Do not invent employment dates, credentials, or name variants for search metadata. Review the academic year and experience entries marked “Present” when updating portfolio content.

If the domain changes, update the canonical and social URLs, JSON-LD identifiers, `robots.txt`, `sitemap.xml`, `public/CNAME`, package homepage, SEO check, and README together. Update the GitHub Pages custom domain and DNS as well.

## Troubleshooting

- **GitHub 404:** check the publishing source, domain mapping, root `index.html`, and latest Pages deployment run.
- **Domain shows a parking page:** replace registrar parking DNS records with the GitHub records above.
- **Browser certificate error:** confirm DNS first, then check certificate availability and Enforce HTTPS in Pages settings.
- **Page is empty without JavaScript:** use `npm run build`, not `vite build` directly; the former also prerenders the React views.

## References

- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google supported metadata](https://developers.google.com/search/docs/crawling-indexing/special-tags)
