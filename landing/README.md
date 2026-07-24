# DevNode landing — mariuszmachuta.com

Single-page static site (Vite 7 + Tailwind CSS v4 + vanilla TS) replacing the
LinkStack install at the repo root. The page itself is the portfolio:
WCAG 2.2 AA (axe: 0 violations), Lighthouse 100/100/100/100 desktop
(99 perf mobile), ~125 KB gz first visit, zero third-party requests, fully
functional without JavaScript.

## Commands (run from `landing/`)

```bash
npm install
npm run dev        # dev server
npm run build      # tsc --noEmit + vite build → dist/
npm run preview    # serve the production build
node scripts/gen-icons.mjs   # regenerate favicon set from public/favicon.svg
```

> Note: audit against a clean static server (`npx serve dist -l 4174`), not
> `vite preview` — local dev extensions (Console Ninja) inject scripts into
> Vite responses and corrupt charset/bf-cache audits.

## Verification gates (all must pass before deploy)

```bash
npm run build                                  # 0 errors
npx html-validate dist/index.html              # 0 errors
npx serve dist -l 4174                         # then:
npx lighthouse http://localhost:4174 --preset=desktop   # ≥95 all, target 100
npx lighthouse http://localhost:4174                    # mobile ≥95 all
# axe-core: inject node_modules/axe-core/axe.min.js in DevTools console, run
# axe.run() → expect 0 violations
```

Manual: keyboard pass (skip link first), 320 px reflow (no horizontal scroll),
`prefers-reduced-motion: reduce` (no animation), both color schemes, JS
disabled (all content + mailto must work).

## Content

Open items live in `docs/CONTENT-PLACEHOLDERS.md`. Placeholders are visible on
the page (dashed underline, `.ph` class). **Do not deploy to production until
the MUST items (NIP, availability, years) are filled.**

## Deploy (Apache host, overlay-in-docroot)

1. On the server: `cp .htaccess .htaccess.linkstack.bak` (rollback file).
2. Upload the **contents** of `dist/` into the docroot (index.html, assets/,
   fonts/, og/, favicons, robots.txt, sitemap.xml, site.webmanifest,
   .htaccess).
3. The new `.htaccess` (from `public/.htaccess`):
   - `DirectoryIndex index.html` — static page wins over LinkStack's index.php
   - forces HTTPS + non-www canonical
   - 403s dormant Laravel internals (`app/`, `vendor/`, `.env`, …)
   - 301s any non-file URL (old LinkStack links) to `/`
   - sets CSP + security headers, immutable caching for css/js/woff2
4. After HTTPS is confirmed stable, uncomment the HSTS header line.
5. Verify live: `npx lighthouse https://mariuszmachuta.com`, securityheaders.com
   scan, and click-through from a phone.

**Rollback** (~1 min): restore `.htaccess.linkstack.bak` over `.htaccess` and
delete `index.html` from the docroot. LinkStack is untouched underneath.

**Retirement**: after 2–4 stable weeks, delete the LinkStack directories from
the server (they stay in git history here).

### If the host turns out to be IIS

Mirror `.htaccess` in `web.config`: `<defaultDocument>` → index.html, URL
Rewrite rules for canonical + 301s + Laravel-dir blocking, and
`<httpProtocol><customHeaders>` for the security headers. Back up the old
`web.config` the same way.
