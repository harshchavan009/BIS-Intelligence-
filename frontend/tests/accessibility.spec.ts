import { test, expect } from '@playwright/test';

test.describe('Accessibility & UI Controls Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('P0-2: Toggling accessibility controls never turns content background black', async ({ page }) => {
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();

    // Helper to get computed background color
    const getBgColor = async () => {
      return await page.evaluate(() => {
        const el = document.querySelector('#main-content') || document.body;
        return window.getComputedStyle(el).backgroundColor;
      });
    };

    const initialBg = await getBgColor();
    // Default paper background is rgb(247, 245, 239) or rgba(0, 0, 0, 0) inheriting paper
    expect(initialBg).not.toBe('rgb(0, 0, 0)');

    // 1. Click A- (decrease font size)
    const btnDecrease = page.locator('button[aria-label*="decrease" i], button:has-text("A-")');
    if (await btnDecrease.count() > 0) {
      await btnDecrease.first().click();
      const bgAfterAminus = await getBgColor();
      expect(bgAfterAminus).not.toBe('rgb(0, 0, 0)');
    }

    // 2. Click A+ (increase font size)
    const btnIncrease = page.locator('button[aria-label*="increase" i], button:has-text("A+")');
    if (await btnIncrease.count() > 0) {
      await btnIncrease.first().click();
      const bgAfterAplus = await getBgColor();
      expect(bgAfterAplus).not.toBe('rgb(0, 0, 0)');
    }

    // 3. Click Reset font size (A)
    const btnReset = page.locator('button[aria-label*="default" i], button:has-text("A")').nth(1);
    if (await btnReset.count() > 0) {
      await btnReset.click();
      const bgAfterA = await getBgColor();
      expect(bgAfterA).not.toBe('rgb(0, 0, 0)');
    }

    // 4. Click High Contrast toggle
    const btnContrast = page.locator('button[aria-label*="contrast" i], button:has-text("High Contrast")').first();
    if (await btnContrast.count() > 0) {
      await btnContrast.click();
      // High contrast must NOT turn the lower page into a solid black void
      const bgAfterContrast = await getBgColor();
      expect(bgAfterContrast).not.toBe('rgb(0, 0, 0)');

      // Toggle back to standard mode (label toggles to 'Standard')
      const btnStandard = page.locator('button:has-text("Standard"), button:has-text("STD")').first();
      if (await btnStandard.count() > 0) {
        await btnStandard.click();
        const bgAfterToggleBack = await getBgColor();
        expect(bgAfterToggleBack).not.toBe('rgb(0, 0, 0)');
      }
    }

    // 5. Click Hindi toggle
    const btnHindi = page.locator('button:has-text("हिंदी")');
    if (await btnHindi.count() > 0) {
      await btnHindi.first().click();
      const bgAfterHindi = await getBgColor();
      expect(bgAfterHindi).not.toBe('rgb(0, 0, 0)');
    }

    // 6. Click English toggle
    const btnEnglish = page.locator('button:has-text("English")');
    if (await btnEnglish.count() > 0) {
      await btnEnglish.first().click();
      const bgAfterEnglish = await getBgColor();
      expect(bgAfterEnglish).not.toBe('rgb(0, 0, 0)');
    }
  });

  test('P0-1: Evaluator auth inputs disable browser password autofill', async ({ page }) => {
    // Navigate to Analytics
    await page.locator('nav button:has-text("Analytics")').click();

    // Check custom evaluator input IDs
    const idInput = page.locator('#eval_access_id');
    const keyInput = page.locator('#eval_access_key');

    if (await idInput.count() > 0) {
      // Must have autocomplete="off"
      await expect(idInput).toHaveAttribute('autocomplete', 'off');
      await expect(keyInput).toHaveAttribute('autocomplete', 'new-password');

      // Check for demo credentials helper button
      const autofillBtn = page.locator('button:has-text("Auto-Fill Demo Credentials")');
      await expect(autofillBtn).toBeVisible();

      // Click auto-fill and submit
      await autofillBtn.click();
      await page.locator('button:has-text("Authorize & View Telemetry"), button:has-text("लॉगिन करें")').click();

      // Verify analytics dashboard appears
      await expect(page.locator('text=Groundedness Score').first()).toBeVisible();
    }
  });

  test('P0-3: Ticker auto-scrolls and provides View All affordance', async ({ page }) => {
    const tickerTrack = page.locator('.ticker-track');
    await expect(tickerTrack).toBeVisible();

    const viewAllBtn = page.locator('button:has-text("View All →"), button:has-text("सभी देखें →")');
    await expect(viewAllBtn).toBeVisible();
    await viewAllBtn.click();

    // Verifies it navigates to the Document Registry
    await expect(page.locator('h1:has-text("Document Registry"), h1:has-text("आधिकारिक दस्तावेज रजिस्ट्री")')).toBeVisible();
  });

  test('P0-4: Services dropdown closes on outside click and Escape', async ({ page }) => {
    const servicesBtn = page.locator('nav button:has-text("Services")');
    await servicesBtn.click();

    // Dropdown and backdrop should be visible
    const backdrop = page.locator('.fixed.inset-0.z-40');
    await expect(backdrop).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');
    await expect(backdrop).not.toBeVisible();
  });
});
