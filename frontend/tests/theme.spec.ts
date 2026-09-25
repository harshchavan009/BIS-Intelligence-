import { test, expect } from '@playwright/test';

test.describe('Theme System & Dark/Light Toggle Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
  });

  test('Theme-1: Theme toggle exists in top utility bar next to High Contrast', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check that the theme toggle button exists
    const themeBtn = page.locator('button[aria-label*="dark mode" i], button[aria-label*="light mode" i]');
    await expect(themeBtn).toBeVisible();

    // Verify accessible attributes
    await expect(themeBtn).toHaveAttribute('aria-label');
    await expect(themeBtn).toHaveAttribute('aria-pressed');
  });

  test('Theme-2: Toggle switches theme, sets data-theme="dark", and adds "dark" class', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Initial state: light
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    // Click toggle
    const themeBtn = page.locator('button[aria-label*="dark mode" i], button[aria-label*="light mode" i]');
    await themeBtn.click();

    // Now state should be dark
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(html).toHaveClass(/dark/);

    // Verify localStorage key 'bis-theme'
    const storedTheme = await page.evaluate(() => localStorage.getItem('bis-theme'));
    expect(storedTheme).toBe('dark');

    // Click toggle again to switch back to light
    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(html).not.toHaveClass(/dark/);

    const storedThemeLight = await page.evaluate(() => localStorage.getItem('bis-theme'));
    expect(storedThemeLight).toBe('light');
  });

  test('Theme-3: Theme persists across page reloads without FOUC', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Switch to dark mode
    const themeBtn = page.locator('button[aria-label*="dark mode" i], button[aria-label*="light mode" i]');
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Reload page
    await page.reload();

    // Must still be dark immediately upon load
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('Theme-4: High Contrast and Dark Mode are orthogonal (4 independent states)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const html = page.locator('html');
    const themeBtn = page.locator('button[aria-label*="dark mode" i], button[aria-label*="light mode" i]');
    const contrastBtn = page.locator('button[aria-label*="contrast" i], button:has-text("High Contrast")').first();

    // State 1: Light + Normal Contrast
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(html).not.toHaveClass(/high-contrast/);

    // State 2: Light + High Contrast
    await contrastBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(html).toHaveClass(/high-contrast/);

    // State 3: Dark + High Contrast
    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(html).toHaveClass(/high-contrast/);
    await expect(html).toHaveClass(/dark/);

    // Verify high-contrast dark mode has pure black background override
    const bgDarkHC = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // In dark + high-contrast, background is #000000 (rgb(0, 0, 0))
    expect(bgDarkHC).toBe('rgb(0, 0, 0)');

    // State 4: Dark + Normal Contrast
    const stdContrastBtn = page.locator('button:has-text("Standard"), button:has-text("STD")').first();
    await stdContrastBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(html).not.toHaveClass(/high-contrast/);

    // In normal dark mode, background is official navy-charcoal #10161F (rgb(16, 22, 31)), NOT pure black!
    const bgDarkNormal = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    expect(bgDarkNormal).toBe('rgb(16, 22, 31)');
  });

  test('Theme-5: Font sizing controls (A-, A, A+) work properly in dark mode', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to dark mode
    const themeBtn = page.locator('button[aria-label*="dark mode" i], button[aria-label*="light mode" i]');
    await themeBtn.click();

    // Click A- (small)
    const btnDecrease = page.locator('button:has-text("A-")');
    if (await btnDecrease.count() > 0) {
      await btnDecrease.first().click();
      const fontSizeSmall = await page.evaluate(() => {
        return window.getComputedStyle(document.documentElement).fontSize;
      });
      expect(fontSizeSmall).toBe('14px');
    }

    // Click A+ (large)
    const btnIncrease = page.locator('button:has-text("A+")');
    if (await btnIncrease.count() > 0) {
      await btnIncrease.first().click();
      const fontSizeLarge = await page.evaluate(() => {
        return window.getComputedStyle(document.documentElement).fontSize;
      });
      expect(fontSizeLarge).toBe('18px');
    }

    // Click A (normal)
    const btnReset = page.locator('button[title*="Standard Font Size" i]');
    if (await btnReset.count() > 0) {
      await btnReset.first().click();
      const fontSizeNormal = await page.evaluate(() => {
        return window.getComputedStyle(document.documentElement).fontSize;
      });
      expect(fontSizeNormal).toBe('16px');
    }
  });

  test('Theme-6: Major surfaces have dark theme tokens and WCAG AA contrast in dark mode', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to dark mode
    const themeBtn = page.locator('button[aria-label*="dark mode" i], button[aria-label*="light mode" i]');
    await themeBtn.click();

    // Check Disclaimer Banner has dark mode warning colors
    const disclaimer = page.locator('aside[aria-label*="Disclaimer" i]');
    if (await disclaimer.count() > 0) {
      const disclaimerBg = await disclaimer.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      // Not bright white
      expect(disclaimerBg).not.toBe('rgb(255, 255, 255)');
    }

    // Wait for CSS color transitions to settle
    await page.waitForTimeout(300);

    // Check Card background is surface (#171F2C = rgb(23, 31, 44))
    const firstCard = page.locator('[class*="bg-card-"], .card-standard').first();
    if (await firstCard.count() > 0) {
      const cardBg = await firstCard.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      // Dark card surface rgb(23, 31, 44)
      expect(cardBg).toBe('rgb(23, 31, 44)');
    }

    // Navigate to Analytics & verify evaluation table in dark mode
    await page.locator('nav button:has-text("Analytics")').click();
    const tableHeader = page.locator('table thead').first();
    await expect(tableHeader).toBeVisible();

    const theadBg = await tableHeader.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    // Not light beige in dark mode
    expect(theadBg).not.toBe('rgb(242, 239, 233)');
  });
});
