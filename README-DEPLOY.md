# fh-static-prod — production copy of the www.falirohouse.com static snapshot
Source: /workspace/snapshots/falirohouse.com (the 21 Oct crawl). Built 23 Oct 2026 JST. Nothing has been pushed anywhere.

## Changes compared with the snapshot and with deploy/falirohouse.com (the pages.dev copy)
- Removed noindex: no `_headers` file (that is where X-Robots-Tag lived) and no robots `Disallow: /`.
  - The new robots.txt allows everything and points to the sitemap.
  - The HTML never had a noindex meta. The only noindex metas are on the privacy-policy and terms pages, and the live site has them too, so they stay.
- Added sitemap.xml with the 17 live sitemap URLs.
- og:url, og:image and twitter:image are absolute https://www.falirohouse.com/... again, as on the live site. The crawl had made them relative.
- Clean URLs work on any static host. For every X.html there is now an X/index.html (24 new ones; 9 came from the crawl), so /about, /films/Alps and /locations/islands all resolve. The new copies carry `<base href="/dir/">`, so their relative links resolve the same way as the originals.
- 404.html is a copy of the home page with `<base href="/">`.
- No PHP files and no `<form>` elements. The site has no forms; the email address is shown as text.

## Verification
Served locally (python http.server) and loaded in headless Chromium: 68 pages, 0 local failures, 0 requests to falirohouse.com. Third-party requests are unchanged: GTM/GA, the FB pixel, Vimeo/plyr, and Google Maps (the Maps key must allow www.falirohouse.com, which it already does as the original host).

## App Platform as a static site component
Commit the `site/` directory to a repo. Then use:
```yaml
static_sites:
- name: fh-static
  github: {repo: dimisdas/<new-private-repo>, branch: main, deploy_on_push: false}   # or gitlab: {...}
  source_dir: /
  output_dir: site          # or put the files at the repo root and set output_dir: /
  index_document: index.html
  error_document: 404.html
  # no build_command and no environment needed
ingress:
  rules:
  - match: {path: {prefix: /}}
    component: {name: fh-static}
```
Total size is 246 MB in 956 files. The largest file is under 50 MB, so it is fine for GitHub without LFS.
