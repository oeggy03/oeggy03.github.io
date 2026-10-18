# GitHub Pages, domain, and search setup

## Current publishing configuration

The site URL is `https://www.tranhathu.com/`. GitHub Pages must use **GitHub Actions** as its publishing source for the workflow at `.github/workflows/deploy-pages.yml`. The workflow runs the quality checks on pull requests to `main`. When a commit reaches `main`, it runs lint, builds and prerenders the site, checks SEO and assets, runs the browser/accessibility suite, then deploys the same verified `dist/` artifact with `actions/deploy-pages`. Feature branch pushes do not publish the site.

### One-time activation

After this workflow is merged, set its publishing source in the repository **Settings > Pages > Build and deployment > Source** to **GitHub Actions**. If the first post-merge run started before the source change and the deploy job failed, rerun **Verify and deploy portfolio** from the Actions tab with `main` selected.

The deploy job uses the built-in `GITHUB_TOKEN` with Pages write and OIDC token permissions; no personal access token or separate deploy secret is needed. It is limited to pushes or manual workflow runs from `main`.

To manually publish, run **Verify and deploy portfolio** from the Actions tab and choose the `main` branch. The workflow builds, verifies, and deploys the resulting artifact.

In the repository **Settings > Pages**, use:

- Source: **GitHub Actions**.
- Custom domain: **www.tranhathu.com**.
- Enable **Enforce HTTPS** after GitHub provisions the certificate.

After publishing, check the **Verify and deploy portfolio** workflow and the Pages deployment run in the repository Actions tab. Confirm the site is responding at the configured domain.

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
