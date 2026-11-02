import { test, expect } from '@playwright/test';

const VIEWS = ['client', 'dev', 'recruiter'];
const panel = (page, view) => page.locator(`[data-view="${view}"]`);
const button = (page, view) => page.locator(`[data-vsw="${view}"]`);

for (const view of VIEWS) {
  test(`${view} button shows only that view, keeps the URL and moves focus`, async ({ page }) => {
    await page.goto('/');
    const url = page.url();

    await button(page, view).click();

    for (const other of VIEWS) {
      if (other === view) await expect(panel(page, other)).toBeVisible();
      else await expect(panel(page, other)).toBeHidden();
    }
    await expect(button(page, view)).toHaveAttribute('aria-pressed', 'true');
    await expect(panel(page, view).locator('h1')).toBeFocused();
    expect(page.url()).toBe(url);
  });

  test(`${view} view has no axe violations`, async ({ page }) => {
    // Switching fades the buttons; axe must not measure contrast mid-fade.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await button(page, view).click();
    await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });

    const { violations } = await page.evaluate(() => window.axe.run());

    const found = violations.flatMap(({ id, nodes }) => nodes.map(({ target }) => `${id}: ${target}`));
    expect(found).toEqual([]);
  });
}

test.describe('with JavaScript off', () => {
  test.use({ javaScriptEnabled: false });

  test('the switcher is hidden and only the client view shows', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.vsw-row')).toBeHidden();
    await expect(panel(page, 'client')).toBeVisible();
    await expect(panel(page, 'dev')).toBeHidden();
    await expect(panel(page, 'recruiter')).toBeHidden();
  });
});

test('a link to a section in another view opens that view', async ({ page }) => {
  await page.goto('/#rnumbers');

  await expect(page.locator('#rnumbers')).toBeInViewport();
  await expect(button(page, 'recruiter')).toHaveAttribute('aria-pressed', 'true');
});

test('a hash change to a section in another view opens that view', async ({ page }) => {
  await page.goto('/');

  await page.evaluate(() => {
    location.hash = '#dstack';
  });

  await expect(page.locator('#dstack')).toBeInViewport();
  await expect(button(page, 'dev')).toHaveAttribute('aria-pressed', 'true');
});

// 800px is inside the band where the switcher row wraps and the header is taller.
for (const width of [1280, 800]) {
  test(`menu link clears the sticky header at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');

    await page.locator('a.nav-link[href="#work"]').click();

    const gap = await page.evaluate(() => {
      const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
      return document.querySelector('#work').getBoundingClientRect().top - headerBottom;
    });
    expect(gap).toBeGreaterThanOrEqual(0);
    expect(gap).toBeLessThan(40);
  });
}

test('the headline dot stops blinking within five seconds (WCAG 2.2.2)', async ({ page }) => {
  await page.goto('/');

  const endTime = await page
    .locator('.caret')
    .evaluate((caret) => caret.getAnimations()[0].effect.getComputedTiming().endTime);

  expect(endTime).toBeLessThanOrEqual(5000);
});
