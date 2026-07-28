# mariuszmachuta.com

Single-page site for `<DevNode /> Unicorn Division` — Mariusz Machuta, lead
frontend developer, Warsaw.

Vite 7 and hand-written CSS. No framework, no CSS library, no TypeScript, and
one small script. The page claims zero cookies, zero trackers and self-hosted
fonts, and a reader is expected to open DevTools and check — so the build stays
dependency-free on purpose.

## Three views, one URL

The page serves three audiences from a single document, switched by a control in
the header:

| View | For | Character |
|---|---|---|
| `client` *(default)* | Businesses, hiring managers, agencies | Outcome-led. The full page. |
| `dev` | Tech leads running the technical screen | Peer-to-peer. Stack rated honestly, decisions with reasoning, opinions, two real failures. |
| `recruiter` | Recruiters and sourcers | Built for a 30-second scan. Facts, keywords, numbers, CV. |

All three render in the HTML; the two inactive ones carry `hidden`.
`src/main.js` toggles that attribute and moves focus to the incoming view's
`h1`.

Two constraints hold this together, and both are deliberate:

- **Switching never touches the URL** — no hash, no query parameter, no
  `pushState`, no reload. It is local UI state.
- **The `client` view works with JavaScript disabled.** Nothing is gated behind
  a script; with JS off the default view renders complete and the switcher is
  hidden via a stylesheet loaded from `<noscript>`.

## Layout

```
index.html            the entire page, all three views
src/main.js           the audience switcher — the only JavaScript
src/styles/main.css   tokens, components, breakpoints, print
public/               copied verbatim into dist/
  fonts/              self-hosted woff2 (Inter Variable, JetBrains Mono 400/700)
  cv/                 the CV PDF — gitignored, see below
  noscript.css        hides the switcher when scripting is off
  .htaccess           canonical redirects, CSP, security headers, caching
scripts/gen-icons.mjs regenerates the favicon set from public/favicon.svg
```

## Commands

```bash
npm install
npm run dev        # dev server
npm run build      # → dist/
npm run preview    # serve the production build
npm run icons      # regenerate favicons after editing public/favicon.svg
```

## The CV is not in this repo

`public/cv/mariusz-machuta-cv.pdf` is gitignored — it carries a phone number and
a full employment history. The page links to `/cv/mariusz-machuta-cv.pdf` from
five places; **upload the PDF to that path on the host**, or those links 404.

Keep a local copy at `public/cv/` so `npm run build` produces a complete `dist/`.

## Verification

Every gate below must pass, **against each of the three views**, before deploy.

```bash
npm run build                                  # 0 errors
npx html-validate dist/index.html              # 0 errors
npx serve dist -l 4174
npx lighthouse http://localhost:4174 --preset=desktop --quiet   # ≥95 all
npx lighthouse http://localhost:4174 --quiet                    # mobile ≥95 all
```

> Audit against `npx serve dist`, **not** `vite preview` — local browser
> extensions inject scripts into Vite responses and corrupt the charset and
> bf-cache audits.

**axe-core:** copy `node_modules/axe-core/axe.min.js` into `dist/`, inject it in
the console, run `axe.run()` — expect 0 violations in every view. Decorative
glyphs (`▸ ⋯ / · ×`) report as *incomplete* on colour-contrast because they hold
no text; that is correct, not a finding. Delete the copy afterwards.

**Manual:** keyboard pass (the skip link must be the first focusable element);
switcher buttons operable with Enter and Space; the URL unchanged after
switching; one `h1` and no skipped heading levels within each view; 320px reflow
with no horizontal scroll; `prefers-reduced-motion: reduce`; print preview
(ink-on-paper, not blank); and confirm the four claims in the hero panel still
hold of the built output.

Current: **100 / 100 / 100 / 100** desktop on all three views, mobile 100 for
`client` and 99 performance for `dev` and `recruiter`. axe 0 violations. All
requests same-origin.

### Two lint rules are relaxed on purpose

`.htmlvalidate.json` disables `no-redundant-role` and excludes `list` from
`prefer-native-element` so the `ul`/`ol` elements can carry `role="list"`.

That role is not redundant in practice: Safari and VoiceOver drop list semantics
when `list-style: none` is applied, which this design requires throughout.
Without it a VoiceOver user hears no "list, N items" anywhere on the page.
Re-enabling the rules and stripping the roles trades a real accessibility
regression for a tidier lint run. Evidence it does work: axe passing checks rise
from 36 to 40 with the roles present.

## Editing the page

Copy and layout come from a design handoff kept outside this repo. A few
constraints are load-bearing rather than stylistic:

- **No employment dates and no years-of-experience figure appear anywhere.** The
  CV carries them, and the page says so explicitly. Durations tied to a specific
  engagement are fine; a career total is not.
- **No testimonials, no availability badge, no rates, no response-time SLA, no
  phone number.**
- **Only claims a reader can verify.** No Lighthouse scores or page-weight
  figures about this page.
- **Two ownership claims stay in the first person** — building and shipping an
  MCP server, and building the axe-core accessibility gate in CI. "Built" is the
  point; do not soften either to "worked with" or "experience in".
- The dev view separates what the author owns from what he only works alongside.
  **Never merge the "Around me, not mine" list into the claimed-skill columns** —
  the dashed styling and the disclaimer are the honesty mechanism.
- The `STRONG` / `MEDIUM` / `LOOSE` chips are 11px with `.06em` tracking. Do not
  reduce the size; it was smaller once and that was wrong on a page selling
  accessibility.

### Client confidentiality

One engagement's end client is under NDA. Client descriptions on the page are
deliberately characterising rather than naming, and must stay that way. Do not
add a company name, internal repository or service name, or any further
identifying detail — in copy, structured data, comments, or commit messages.

## Deploy (Apache)

1. Upload the **contents** of `dist/` into the docroot.
2. Upload the CV to `/cv/mariusz-machuta-cv.pdf`.
3. `.htaccess` sets `DirectoryIndex index.html`, forces HTTPS and non-www,
   denies PHP, dot-files and backup extensions, collapses `/index.html` onto `/`,
   and sets CSP plus security headers. There is deliberately **no catch-all
   redirect** — unknown URLs return a genuine 404 rather than a soft-404 301 to
   the homepage.
4. Once HTTPS is confirmed stable, uncomment the HSTS header.
5. Verify live: `npx lighthouse https://mariuszmachuta.com`, a
   securityheaders.com scan, and a click-through from a phone.

**Rollback:** keep the previous `dist/` upload — restoring it is a re-upload.
There is no application layer to revert.

## Accessibility

The page sells accessibility work, so its own markup is part of the argument.
Real landmarks, a skip link first in the DOM, `section[aria-labelledby]`
throughout, real `<dl>` for term/value pairs with `<dt>` always preceding its
`<dd>` in source order, no heading-level skips, decorative glyphs hidden from
assistive technology, and a visible focus ring on everything focusable.

Found a problem? [Open an issue](https://github.com/Cain-Ish/devnode-website/issues).
