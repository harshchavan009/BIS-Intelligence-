import { test, expect } from '@playwright/test';

test.describe('Institutional Palette & Complete Dark/Light Coverage Audit', () => {
  const tabs = [
    'landing',
    'chat',
    'faq',
    'registry',
    'analytics',
    'media',
    'finder',
    'schemes',
    'labs',
    'consumer',
    'hallmarking',
    'glossary',
    'contact',
    'policies',
    'help',
    'about',
    'sitemap'
  ];

  test('Audit 1: Light Theme - Zero Blue Bleed, Crisp Hero, Maroon Buttons', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    // 1. Verify Hero headline text is solid crisp white over hero image scrim
    const heroHeadline = page.locator('h1').first();
    await expect(heroHeadline).toBeVisible();
    const headlineColor = await heroHeadline.evaluate((el) => window.getComputedStyle(el).color);
    // Should be white (rgb(255, 255, 255)), definitely NOT blue (e.g. rgb(11, 60, 111) or rgb(59, 130, 246))
    expect(headlineColor).toBe('rgb(255, 255, 255)');

    // 2. Verify primary CTAs have solid maroon background (#A61E22 = rgb(166, 30, 34))
    const primaryBtn = page.locator('button:has-text("Search Standards Catalog"), button:has-text("Ask the Assistant")').first();
    await expect(primaryBtn).toBeVisible();
    const btnBg = await primaryBtn.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(btnBg).toBe('rgb(166, 30, 34)');

    // 3. Verify Light theme background is pure white #FFFFFF
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(255, 255, 255)');

    // 4. Capture screenshot
    await page.screenshot({ path: 'test-results/light-theme-home.png', fullPage: false });
  });

  test('Audit 2: Dark Theme - No leftover white blocks across all tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Enable dark theme
    const themeBtn = page.locator('button[aria-label*="dark mode" i], button[aria-label*="light mode" i]');
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Verify Dark background is #0E141C = rgb(14, 20, 28)
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(14, 20, 28)');

    // Iterate through all tabs and check for leftover white elements
    for (const tab of tabs) {
      await page.evaluate((targetTab) => {
        // Direct state transition
        const store = (window as any).__BIS_STORE__;
        if (store) {
          store.getState().setActiveTab(targetTab);
        } else {
          // Fallback: look for button or click
          const btn = document.querySelector(`button[data-tab="${targetTab}"]`);
          if (btn) (btn as HTMLElement).click();
        }
      }, tab);

      await page.waitForTimeout(150);

      // Check for any rogue solid white backgrounds (width > 50px, height > 20px)
      const whiteBlocks = await page.evaluate(() => {
        const rogueElements: string[] = [];
        const allEls = document.querySelectorAll('main *, #main-content *, [role="main"] *');
        allEls.forEach((el) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          // Filter visible elements with non-trivial size
          if (rect.width > 50 && rect.height > 20 && style.display !== 'none' && style.visibility !== 'hidden') {
            const bg = style.backgroundColor;
            // Check if computed background is pure solid white rgb(255, 255, 255)
            if (bg === 'rgb(255, 255, 255)') {
              const tag = el.tagName.toLowerCase();
              const className = el.className.toString().slice(0, 50);
              rogueElements.push(`${tag}.${className}`);
            }
          }
        });
        return rogueElements;
      });

      expect(whiteBlocks, `Found leftover pure white blocks on tab: ${tab}`).toEqual([]);
    }

    // Capture screenshot on dark mode
    await page.screenshot({ path: 'test-results/dark-theme-coverage.png', fullPage: false });
  });

  test('Audit 3: Semantic Palette Tokens Verification in both themes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Light mode verification
    const lightTokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        background: style.getPropertyValue('--background').trim(),
        surface: style.getPropertyValue('--surface').trim(),
        surfaceAlt: style.getPropertyValue('--surface-alt').trim(),
        border: style.getPropertyValue('--border').trim(),
        textPrimary: style.getPropertyValue('--text-primary').trim(),
        textSecondary: style.getPropertyValue('--text-secondary').trim(),
        brandPrimary: style.getPropertyValue('--brand-primary').trim(),
        brandAccent: style.getPropertyValue('--brand-accent').trim(),
        statusSuccess: style.getPropertyValue('--status-success').trim(),
        statusWarning: style.getPropertyValue('--status-warning').trim(),
      };
    });

    expect(lightTokens.background.toUpperCase()).toBe('#FFFFFF');
    expect(lightTokens.surface.toUpperCase()).toBe('#FFFFFF');
    expect(lightTokens.surfaceAlt.toUpperCase()).toBe('#F2F4F7');
    expect(lightTokens.border.toUpperCase()).toBe('#D8DEE5');
    expect(lightTokens.textPrimary.toUpperCase()).toBe('#1A1F26');
    expect(lightTokens.textSecondary.toUpperCase()).toBe('#5B6470');
    expect(lightTokens.brandPrimary.toUpperCase()).toBe('#0B3C6F');
    expect(lightTokens.brandAccent.toUpperCase()).toBe('#A61E22');
    expect(lightTokens.statusSuccess.toUpperCase()).toBe('#1E7145');
    expect(lightTokens.statusWarning.toUpperCase()).toBe('#B8860B');

    // Switch to Dark mode
    const themeBtn = page.locator('button[aria-label*="dark mode" i], button[aria-label*="light mode" i]');
    await themeBtn.click();

    const darkTokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        background: style.getPropertyValue('--background').trim(),
        surface: style.getPropertyValue('--surface').trim(),
        surfaceAlt: style.getPropertyValue('--surface-alt').trim(),
        border: style.getPropertyValue('--border').trim(),
        textPrimary: style.getPropertyValue('--text-primary').trim(),
        textSecondary: style.getPropertyValue('--text-secondary').trim(),
        brandPrimary: style.getPropertyValue('--brand-primary').trim(),
        brandAccent: style.getPropertyValue('--brand-accent').trim(),
        statusSuccess: style.getPropertyValue('--status-success').trim(),
        statusWarning: style.getPropertyValue('--status-warning').trim(),
      };
    });

    expect(darkTokens.background.toUpperCase()).toBe('#0E141C');
    expect(darkTokens.surface.toUpperCase()).toBe('#161E29');
    expect(darkTokens.surfaceAlt.toUpperCase()).toBe('#1C2531');
    expect(darkTokens.border.toUpperCase()).toBe('#2B3542');
    expect(darkTokens.textPrimary.toUpperCase()).toBe('#E7EAEE');
    expect(darkTokens.textSecondary.toUpperCase()).toBe('#9AA4B1');
    expect(darkTokens.brandPrimary.toUpperCase()).toBe('#6F9BC7');
    expect(darkTokens.brandAccent.toUpperCase()).toBe('#C24A4E');
    expect(darkTokens.statusSuccess.toUpperCase()).toBe('#3FA873');
    expect(darkTokens.statusWarning.toUpperCase()).toBe('#D1A233');
  });
});
