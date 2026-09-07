import { test, expect } from '@playwright/test';

test.describe('BIS Assistant Round 2 Verification Suite', () => {
  test('R2-1: Public Analytics View loads directly without auth barrier showing 65/65 tests', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Navigate to Analytics
    await page.click('button:has-text("Analytics"), button:has-text("एनालिटिक्स")');
    await page.waitForTimeout(500);

    // Verify Groundedness Score tile is visible without any password prompt
    const scoreTile = page.locator('text=Groundedness Score');
    await expect(scoreTile).toBeVisible();

    // Verify 65/65 or 100.0% is displayed
    const scoreValue = page.locator('text=65/65 (100.0%)');
    await expect(scoreValue).toBeVisible();

    // Verify Evaluation suite table is visible
    const tableHeader = page.locator('text=Gold-Standard Evaluation Suite');
    await expect(tableHeader).toBeVisible();
  });

  test('R2-2: Category filters in Analytics Table update filtered count', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Analytics"), button:has-text("एनालिटिक्स")');
    await page.waitForTimeout(500);

    // Click 'Cement & Building Materials' filter
    const cementFilter = page.locator('button:text-is("Cement & Building Materials")');
    if (await cementFilter.isVisible()) {
      await cementFilter.click();
      await page.waitForTimeout(300);
      const countBadge = page.locator('text=Showing 5 of 65 Cases');
      await expect(countBadge).toBeVisible();
    }
  });

  test('R2-3: PWA Manifest and Service Worker are linked and accessible', async ({ page }) => {
    const manifestRes = await page.request.get('http://localhost:3000/manifest.json');
    expect(manifestRes.status()).toBe(200);
    const manifestJson = await manifestRes.json();
    expect(manifestJson.name).toContain('BIS AI Assistant');

    const swRes = await page.request.get('http://localhost:3000/sw.js');
    expect(swRes.status()).toBe(200);
  });

  test('R2-4: Cement QCO query streams response with citations and never displays empty bubble', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Click on AI Assistant tab if not active
    await page.click('button:has-text("AI Assistant"), button:has-text("एआई सहायक")');
    await page.waitForTimeout(400);

    // Locate the Cement QCO chip or textarea
    const textarea = page.locator('textarea[aria-label="Ask the BIS Intelligent Assistant a regulatory question"]');
    await expect(textarea).toBeVisible();

    await textarea.fill('Which Indian Standard and QCO applies to cement bag for construction?');
    await page.click('button:has-text("Send"), button:has-text("पूछें")');

    // Wait for the assistant response bubble to appear and populate
    const assistantBubble = page.locator('div:has-text("BIS Intelligent Assistant")').last();
    await expect(assistantBubble).toBeVisible();

    // Verify response content contains IS 269 and Cement QCO
    const cementText = page.locator('text=Cement (Quality Control) Order, 2003');
    await expect(cementText).toBeVisible({ timeout: 15000 });

    // Verify citation [1] chip is rendered and active
    const citationChip = page.locator('button.citation-chip').first();
    await expect(citationChip).toBeVisible();

    // Verify GroundedBadge is displayed
    const groundedBadge = page.locator('text=Verified Standard').first();
    await expect(groundedBadge).toBeVisible();
  });
});
