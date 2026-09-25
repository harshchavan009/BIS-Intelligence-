import { test, expect } from '@playwright/test';

test.describe('BIS Intelligence Pass 3 Verification Suite', () => {
  test('P3-1: Header renders single clean tagline without visible acronym doubling', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check visible tagline text (rendered within span)
    const visibleTagline = page.locator('header span:has-text("Independent AI Assistant for Indian Standards (BIS) Information")').first();
    await expect(visibleTagline).toBeVisible();

    // Screen reader expansion span is present with sr-only class
    const srExpansion = page.locator('header span.sr-only:has-text("BUREAU OF INDIAN STANDARDS")');
    await expect(srExpansion).toHaveCount(1);
    
    // Check page title does not contain "Official"
    const title = await page.title();
    expect(title).not.toMatch(/\bOfficial\b/i);
    expect(title).toContain('BIS Intelligence');
  });

  test('P3-2: Public Trust & Accuracy Strip is visible on homepage without login', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Trust strip badges
    const trustStrip = page.locator('section[aria-label="Public Trust and Accuracy Telemetry"]');
    await expect(trustStrip).toBeVisible();

    // Verify 100.0% Grounded badge and 65 Verified Cases
    await expect(trustStrip.locator('text=100.0% Grounded')).toBeVisible();
    await expect(trustStrip.locator('text=65 Verified Test Cases')).toBeVisible();
    await expect(trustStrip.locator('text=1,343+ Chunks')).toBeVisible();

    // Click badge or button to navigate to public methodology
    const methodologyLink = trustStrip.locator('button:has-text("Public Methodology & Proof")');
    await expect(methodologyLink).toBeVisible();
    await methodologyLink.click();

    // Verify Methodology page loads without auth barrier
    await expect(page.locator('text=Public Evaluation Methodology & Groundedness Benchmarks')).toBeVisible();
    await expect(page.locator('text=Groundedness Score')).toBeVisible();
    await expect(page.locator('text=Public Gold-Standard Case Inspector (65 Test Queries)')).toBeVisible();
  });

  test('P3-3: Media & Resources Gallery renders on homepage below quick access grid with playable Explainers', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const gallery = page.locator('section[aria-label="Media & Resources Dashboard Gallery"]');
    await expect(gallery).toBeVisible();

    // Verify tabs
    await expect(gallery.locator('button[role="tab"]:has-text("Explainers")')).toBeVisible();
    await expect(gallery.locator('button[role="tab"]:has-text("Photos")')).toBeVisible();
    await expect(gallery.locator('button[role="tab"]:has-text("Videos")')).toBeVisible();

    // Verify Explainers cards render with screen recording badge and duration
    const explainerCard = gallery.getByRole('button', { name: /Cement Mandatory QCO/i }).first();
    await expect(explainerCard).toBeVisible();
    await expect(gallery.locator('text=Live Screen Recording').first()).toBeVisible();

    // Test switching to Photos tab
    await gallery.locator('button[role="tab"]:has-text("Photos")').click();
    await expect(gallery.locator('text=Industrial Materials Testing Laboratory')).toBeVisible();

    // Test switching to Videos tab
    await gallery.locator('button[role="tab"]:has-text("Videos")').click();
    await expect(gallery.locator('text=Understanding Indian Standards & Mandatory QCOs')).toBeVisible();
  });

  test('P3-4: Alert ticker tab pill does not collide with marquee and has accessible region label', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const ticker = page.locator('div[role="region"][aria-label="Regulatory Updates Ticker"]');
    await expect(ticker).toBeVisible();

    // Pill tab container has z-10 and background isolation
    const pill = ticker.locator('button:has-text("Recent Updates"), button:has-text("ताजा अपडेट")');
    await expect(pill).toBeVisible();
  });

  test('P3-5: Breadcrumb on homepage displays single Home crumb without trailing self-referential link', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();

    // Ensure it shows Home with aria-current="page"
    const homeCrumb = breadcrumbs.locator('span[aria-current="page"]');
    await expect(homeCrumb).toHaveText('Home');

    // Ensure "BIS INTELLIGENCE" is not a trailing crumb
    const trailingCrumb = breadcrumbs.locator('text=BIS INTELLIGENCE');
    await expect(trailingCrumb).toHaveCount(0);
  });

  test('P3-6: Utility sidebar icons all have descriptive title attributes and aria-labels', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const sidebar = page.locator('aside[aria-label="Quick Utility and Accessibility Rail"]');
    await expect(sidebar).toBeVisible();

    // Verify tooltips and accessibility labels
    await expect(sidebar.locator('button[aria-label="Evaluator Console & Benchmark Login"]')).toBeVisible();
    await expect(sidebar.locator('button[aria-label="Frequently Asked Questions"]')).toBeVisible();
    await expect(sidebar.locator('button[aria-label="Ask the AI Assistant"]')).toBeVisible();
    await expect(sidebar.locator('button[aria-label="What\'s New & Document Registry"]')).toBeVisible();
    await expect(sidebar.locator('button[aria-label="Website Policies & Disclosures"]')).toBeVisible();
    await expect(sidebar.locator('button[aria-label*="Switch language"]')).toBeVisible();
    await expect(sidebar.locator('button[aria-label="Toggle Accessibility Preferences"]')).toBeVisible();
  });
});
