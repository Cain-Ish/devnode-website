// Audience switcher — the only JavaScript on this page.
//
// Constraints from the design handoff, all client requirements:
//   * switching must NOT touch the URL (no hash, no query param, no
//     pushState, no routing, no reload) — it is local UI state only;
//   * the `client` view must render complete and usable with JS disabled,
//     so all three views ship in the HTML and `dev`/`recruiter` carry the
//     `hidden` attribute from the server. This file only ever toggles it.
//
// Nothing here gates the default view: with this script absent or broken,
// the page still renders the full client view.

const VIEWS = ['client', 'dev', 'recruiter'];

const panels = new Map();
const navGroups = new Map();
for (const view of VIEWS) {
  panels.set(view, document.querySelector(`[data-view="${view}"]`));
  navGroups.set(view, document.querySelector(`[data-nav-view="${view}"]`));
}

const buttons = Array.from(document.querySelectorAll('[data-vsw]'));

// If the markup is not what we expect, leave the page exactly as served
// rather than half-applying a state change.
const ready =
  buttons.length === VIEWS.length &&
  VIEWS.every((v) => panels.get(v) && navGroups.get(v));

function show(view) {
  // Without this, an unrecognised value makes every branch below inactive and
  // hides all three panels at once — a blank page until reload. Cheap guard
  // against a mistyped data-vsw or a fourth view added to the markup but not
  // to VIEWS.
  if (!VIEWS.includes(view)) return;

  for (const v of VIEWS) {
    const isActive = v === view;
    panels.get(v).hidden = !isActive;
    navGroups.get(v).hidden = !isActive;
  }
  for (const button of buttons) {
    const isActive = button.dataset.vsw === view;
    button.dataset.active = String(isActive);
    button.setAttribute('aria-pressed', String(isActive));
  }

  // Move focus into the panel that just appeared.
  //
  // Without this the swap is silent: toggling `hidden` triggers no assistive-
  // technology announcement, and the screen-reader cursor stays parked on the
  // button in the header while every word below it has been replaced. Focusing
  // the new view's h1 announces it, relocates both the AT and keyboard cursor
  // to the top of the new content, and gives sighted keyboard users a visible
  // focus ring confirming something happened. Same technique the skip link
  // already uses on <main tabindex="-1">.
  //
  // preventScroll keeps focus and scrolling independent — we want the page at
  // the very top, not merely at the heading.
  const heading = panels.get(view).querySelector('h1');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }

  // Instant, not smooth: this is a content swap, not navigation, and a
  // smooth scroll here would read as lag.
  window.scrollTo(0, 0);
}

if (ready) {
  for (const button of buttons) {
    button.setAttribute('aria-pressed', String(button.dataset.active === 'true'));
    button.addEventListener('click', () => show(button.dataset.vsw));
  }
}
