# mariuszmachuta.com

Single-page static site for `<DevNode /> Unicorn Division` — the sole
proprietorship of Mariusz Machuta, lead frontend developer, Warsaw.

**Vite 7 + hand-written CSS. No framework, no Tailwind, no TypeScript, and no
JavaScript at all** — the built page ships exactly one `<script>` tag, and it
holds JSON-LD. That is deliberate: the page claims zero cookies, zero trackers
and self-hosted fonts, and a reviewer is expected to open DevTools and check.

The LinkStack install that used to live here was removed in full; it remains in
git history.

## Layout

```
index.html            the entire page
src/styles/main.css   design tokens, components, breakpoints
public/               copied verbatim into dist/
  fonts/              self-hosted woff2 (Inter Variable, JetBrains Mono 400/700)
  cv/                 the CV PDF — gitignored, see below
  og/og-image.png     1200×630 social card
  .htaccess           deploy config: canonical, CSP, security headers, caching
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

## The CV is not in git

`public/cv/mariusz-machuta-cv.pdf` is gitignored — it carries a phone number and
a full employment history, and this repo is public. The page links to
`/cv/mariusz-machuta-cv.pdf` in three places; **upload the PDF to that path on
the host**, or the links 404.

Keep a local copy at `public/cv/mariusz-machuta-cv.pdf` so `npm run build`
produces a complete `dist/`.

## Verification gates

All must pass before deploy.

```bash
npm run build                                 # 0 errors
npx html-validate dist/index.html             # 0 errors
npx serve dist -l 4174                        # then, in another shell:
npx lighthouse http://localhost:4174 --preset=desktop --quiet   # ≥95 all
npx lighthouse http://localhost:4174 --quiet                    # mobile ≥95 all
```

> Audit against `npx serve dist`, **not** `vite preview` — local dev extensions
> inject scripts into Vite responses and corrupt the charset and bf-cache
> audits.

**axe-core:** copy `node_modules/axe-core/axe.min.js` into `dist/`, inject it in
the DevTools console, run `axe.run()` — expect 0 violations. Decorative glyphs
(`▸ ⋯ / ·`) report as *incomplete* on colour-contrast because they hold no text;
that is correct, not a finding. Delete the copy afterwards.

**Manual:** keyboard pass (skip link must be the first focusable element), 320px
reflow with no horizontal scroll, `prefers-reduced-motion: reduce` (the hero
caret must stop blinking), print preview (must be ink-on-paper, not blank), and
confirm the four claims in the hero panel still hold of the built output.

### Two lint rules are deliberately relaxed — do not "fix" them

`.htmlvalidate.json` turns off `no-redundant-role` and excludes `list` from
`prefer-native-element`. Both exist so the eight `ul`/`ol` elements can carry
`role="list"`.

That role is **not** redundant in practice: Safari/VoiceOver silently drop
`list`/`listitem` semantics when `list-style: none` is applied, which this
design requires everywhere. Without the role, a VoiceOver user hears no "list,
N items" for the verify panel, the delivered-for roster, every work card's
outcomes, the career timeline or the process steps. Re-enabling the rules and
stripping the roles trades a real accessibility regression for a cosmetically
cleaner lint run — on this page especially, that is the wrong trade.

Evidence it is doing work: axe-core passing checks go from 36 to **40** with the
roles present.

Last measured 2026-07-28: **100 / 100 / 100 / 100 desktop and mobile**, axe 0
violations, 7 requests, all same-origin.

## Content rules — do not "improve" these

Deliberate client decisions, not oversights:

1. **No years of experience and no employment dates anywhere on the page.** The
   CV carries them; the career section says so explicitly and that line stays.
2. No testimonials — references are taken by phone.
3. No availability badge, no "available now" status. It goes stale.
4. No rates, no pricing, no day-rate range.
5. Only claim what a reader can verify in DevTools. Lighthouse scores and
   page-weight figures are deliberately **not** on the page. Re-add them only
   after measuring the real deployed site.
6. The contact copy promises a written answer but **no response-time SLA**.
7. No phone number on the page. Two conversion goals only: open the CV, send an
   email.
8. **The AI engineering section (02) is a client-confirmed service line, not a
   derivation from the CV.** `Profile.pdf` carries it as a single bullet under
   the CodiLime role; building LLM tooling is now roughly half the work and must
   be visible. Do not trim, merge or demote it — it sits above Selected Work on
   purpose, because it is the rarest capability on the page. *Open item: the
   CV's AI bullet should be strengthened so the two documents agree, since the
   page links to the CV as its proof.*
9. **Within that section, cards `/04` Evals & guardrails and `/05` Designing for
   the failure are load-bearing — keep them and keep their length.** Evaluation
   is the scarcest skill in agentic hiring and the dominant rejection pattern is
   demo-ware sold as production; those two cards, the "not in notebooks"
   credibility line, and the FAQ "Why should a frontend lead be the one building
   your agents?" are the page's answer to both. The 250 KB-budget / 90%-hook-
   coverage reference inside `/04` is a real CodiLime figure and is the evidence
   for the eval claim — do not genericise it.
10. **Two first-person ownership claims must keep their first-person framing.**
    (a) He **built and shipped an MCP server** exposing a design system to
    agents — stated in AI card `/03`, the manifest AI row, the dev view's agent
    section, and the recruiter SPECIALISMS line. (b) He **built the axe-core
    accessibility gate in CI** — stated in the Receipts/Numbers stat, capability
    `03`, the CodiLime work card, and the EAA/WCAG FAQ. "Built" is the point:
    many candidates *use* MCP servers and *audit* accessibility; very few have
    shipped one or automated the other. Never soften to "worked with" or
    "experience in".
11. **The dev view's "Two things I got wrong" section is real and confirmed** —
    both stories were recovered from the client's own git history and commit
    messages. **Keep every figure exact** (4 GB, 19 MB/s, 4.5 GB, 4,543 MB →
    365 MB, five days): they are the evidence, and rounding them weakens the
    section more than shortening it would. **Do not reorder the two stories** —
    testing leads because it sits inside his claimed expertise and shows depth
    while admitting error; the infra story follows as a shorter beat, explicitly
    framed as outside his lane, which is what justifies the dev view's "Around
    me, not mine" block. **Do not cut the closing sentence that links the two.**
    Redactions are already applied: no employer, product, repo, design-system or
    ticket identifiers, and the datastore and orchestrator are deliberately
    unnamed — do not reintroduce any of them.

### Confidentiality — read before touching any client description

The end client of the CodiLime engagement is **under NDA**: characterise, never
name. Only these approved strings may be used, verbatim:

- "platform for a US enterprise-security leader" (work-card role)
- "one of the larger US enterprise cybersecurity vendors" (work-card body)
- "a US cybersecurity leader" (career list)

`enterprise cybersecurity` appears in the recruiter DOMAINS keywords so ATS
searches still match. **Never** add the company name, internal repo names,
internal service names, or the client's internal design-system name — not in
copy, JSON-LD, comments, or commit messages. Do not add further identifying
detail (region counts, tenancy model, product category); the current wording is
the agreed ceiling. CodiLime itself is the intermediary employer and is named
openly — it is not the NDA'd party.

The design source of truth is the Claude Design handoff bundle
(`design_handoff_devnode_landing/`, gitignored): its README is the spec, and the
inline styles of `DevNode Landing.dc.html` are the exact values.

## Deploy (Apache)

LinkStack is fully retired. The docroot should contain this site and nothing
else — if any Laravel directories are still on the server, delete them before
deploying rather than relying on `.htaccess` to hide them.

1. Empty the docroot of the old install.
2. Upload the **contents** of `dist/` into it.
3. Upload the CV to `/cv/mariusz-machuta-cv.pdf` (gitignored, see above).
4. `.htaccess` sets `DirectoryIndex index.html`, forces HTTPS and non-www,
   denies PHP / dot-files / backup extensions, collapses `/index.html` onto `/`,
   and sets CSP plus security headers. There is **no catch-all redirect**:
   unknown URLs return a genuine 404 rather than a soft-404 301 to the homepage.
5. Once HTTPS is confirmed stable, uncomment the HSTS line.
6. Verify live: `npx lighthouse https://mariuszmachuta.com`, a
   securityheaders.com scan, and a click-through from a phone.

**Rollback:** keep the previous `dist/` upload. Restoring it is a re-upload;
there is no application layer to revert.
