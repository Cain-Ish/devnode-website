# Content placeholders — fill before launch

Every `[PLACEHOLDER: …]` below is visible on the page with a dashed underline
(`.ph` class). Replace the text and remove the `<span class="ph">` wrapper.
When all are done, delete the `.ph` rule from `src/styles/main.css`.

| # | Section | Placeholder | Notes |
|---|---------|-------------|-------|
| 1 | Hero | Availability ("Available for new engagements — from when") | Honest scarcity; update whenever it changes |
| 2 | Credibility strip | Years of experience ("10+") | Same number reused in About |
| 3 | Proof — receipts | Lighthouse scores | ✅ Filled 2026-07-24: desktop 100/100/100/100, mobile 99/100/100/100 (headless CLI, clean static server) |
| 4 | Proof — receipts | Page weight | ✅ Filled 2026-07-24: ≈125 KB gz first visit (HTML 6.4 + CSS 4.2 + JS 0.8 + fonts ≈114) |
| 5 | Proof — work card 1 | Industry / engagement / outcome with a number | Anonymized is fine ("fintech scale-up") |
| 6 | Proof — work card 2 | Industry / engagement / outcome with a number | |
| 7 | Testimonials | Quote + attribution | Section ships `hidden`; remove the `hidden` attribute in `index.html` once one real quote exists |
| 8 | About | Years of experience | Keep consistent with #2 |
| 9 | Process 02 | Engagement model (fixed-scope / T&M policy) | |
| 10 | Process 03 | Demo cadence (weekly / bi-weekly) | |
| 11 | FAQ — remote | US East overlap hours | Delete clause if not relevant |
| 12 | FAQ — start | Availability + notice period | |
| 13 | FAQ — rates | Day-rate range or "shared in proposal" | |
| 14 | Contact | Reply-time commitment ("24 hours") | Only promise what you keep |
| 15 | Footer | NIP | Required on a business site in PL |
| 16 | Footer | Registered business name | "<DevNode> Unicorn Division" is a working label — confirm the CEIDG-registered name |
| 17 | JSON-LD | `vatID` deliberately omitted | Add `"vatID": "PL<NIP>"` to the ProfessionalService node when NIP is public |

Also before launch:

- [ ] **Remove the `<meta name="robots" content="noindex, follow">` tag from
  `index.html`** — it's there so placeholder text never gets indexed. The site
  is invisible to Google until you remove it.
- [ ] Add "When can you start?" and "What are your rates?" to the FAQPage
  JSON-LD once their visible answers are final (schema must match page text).
- [ ] Replace the JSON-LD `image` (currently the OG banner) with a real
  headshot/square logo when available.

- [ ] OG image `public/og/og-image.png` (1200×630) — generated during build/verify phase
- [ ] Consider a dedicated mailbox (hello@mariuszmachuta.com) instead of Gmail
- [ ] Re-run the full verification loop after content lands (copy changes can shift contrast/headings)
