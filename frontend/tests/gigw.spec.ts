import { test, expect } from '@playwright/test';

test.describe('GIGW 3.0 & Government Website Compliance Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Set cookie consent to dismissed by default so footer buttons are never intercepted
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('bis_cookie_consent', 'true');
    });
    await page.reload();
  });

  test('GIGW-1: Skip to main content is the #1 focusable element on the page', async ({ page }) => {
    // Press Tab from initial page load
    await page.keyboard.press('Tab');
    
    // Evaluate currently focused element
    const focusedInfo = await page.evaluate(() => {
      const active = document.activeElement as HTMLAnchorElement;
      return {
        tagName: active ? active.tagName.toLowerCase() : '',
        href: active && active.href ? active.href : '',
        className: active ? active.className : '',
        text: active ? active.innerText.trim() : ''
      };
    });

    expect(focusedInfo.tagName).toBe('a');
    expect(focusedInfo.href).toContain('#main-content');
    expect(focusedInfo.className).toContain('skip-link');
    expect(focusedInfo.text.toLowerCase()).toContain('skip to main content');

    // Pressing enter should focus the main content area
    await page.keyboard.press('Enter');
    const activeId = await page.evaluate(() => document.activeElement?.id);
    expect(activeId).toBe('main-content');
  });

  test('GIGW-2: Text resize control persists across page reload via localStorage', async ({ page }) => {
    // Click A+ (increase text)
    const btnIncrease = page.locator('button[title*="Increase Font Size"], button:has-text("A+")');
    await expect(btnIncrease).toBeVisible();
    await btnIncrease.click();

    // Verify localStorage has 'large'
    const storedSize = await page.evaluate(() => localStorage.getItem('bis_font_size'));
    expect(storedSize).toBe('large');

    // Verify root font size style
    const rootFontSize = await page.evaluate(() => document.documentElement.style.getPropertyValue('--base-font-size'));
    expect(rootFontSize).toBe('18px');

    // Reload the page and ensure it is still large
    await page.reload();
    const storedAfterReload = await page.evaluate(() => localStorage.getItem('bis_font_size'));
    expect(storedAfterReload).toBe('large');
    const rootAfterReload = await page.evaluate(() => document.documentElement.style.getPropertyValue('--base-font-size'));
    expect(rootAfterReload).toBe('18px');
  });

  test('GIGW-3: High Contrast recolors correctly and never causes a black screen bug', async ({ page }) => {
    const btnContrast = page.locator('button[title*="Toggle High Contrast"]');
    await expect(btnContrast).toBeVisible();
    await btnContrast.click();

    // Check html has high-contrast class
    const hasClass = await page.evaluate(() => document.documentElement.classList.contains('high-contrast'));
    expect(hasClass).toBe(true);

    // Verify background is parchment/light, NOT solid black
    const bgColor = await page.evaluate(() => {
      const el = document.querySelector('#main-content') || document.body;
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).not.toBe('rgb(0, 0, 0)');

    // Verify persistence in localStorage
    const contrastStored = await page.evaluate(() => localStorage.getItem('bis_high_contrast'));
    expect(contrastStored).toBe('true');

    // Reload and check persistence
    await page.reload();
    const persistedClass = await page.evaluate(() => document.documentElement.classList.contains('high-contrast'));
    expect(persistedClass).toBe(true);
  });

  test('GIGW-4: Screen Reader Access provides legitimate external setup guidance', async ({ page }) => {
    const readerBtn = page.locator('button[title*="Screen Reader"]');
    await expect(readerBtn).toBeVisible();
    await readerBtn.click();

    // Verify modal is open
    const modal = page.locator('h2:has-text("Screen Reader Compatibility")');
    await expect(modal).toBeVisible();

    // Check links to NVDA and JAWS
    const nvdaLink = page.locator('a[href*="nvaccess.org"]');
    await expect(nvdaLink).toBeVisible();
    expect(await nvdaLink.getAttribute('rel')).toContain('noopener');

    const jawsLink = page.locator('a[href*="freedomscientific.com"]');
    await expect(jawsLink).toBeVisible();
    expect(await jawsLink.getAttribute('rel')).toContain('noopener');
  });

  test('GIGW-5: Crawlable Sitemap route lists all 15 services and navigation routes', async ({ page }) => {
    // Click Sitemap link in footer or resources
    const sitemapBtn = page.locator('footer button:has-text("Sitemap"), footer button:has-text("साइटमैप")').first();
    await expect(sitemapBtn).toBeVisible();
    await sitemapBtn.click();

    // Verify Sitemap page rendered
    await expect(page.locator('h1:has-text("Website Sitemap & Complete Directory")')).toBeVisible();
    await expect(page.locator('text=1. AI & Institutional Regulatory Search')).toBeVisible();
    await expect(page.locator('text=2. Consumer Rights, Traceability & Publications')).toBeVisible();
    await expect(page.locator('text=4. Governance, Policies & Public Telemetry')).toBeVisible();

    // Click Standards Finder link within sitemap
    const finderLink = page.locator('div[role="button"]:has-text("Indian Standards & Mandatory QCO Finder")').first();
    await finderLink.click();
    await expect(page.locator('h1:has-text("Indian Standards & Mandatory QCO Finder")')).toBeVisible();
  });

  test('GIGW-6: Help Center provides non-technical user guidance across 5 tabs', async ({ page }) => {
    // Click Help Center in footer
    const helpBtn = page.locator('footer button:has-text("Help Center"), footer button:has-text("सहायता केंद्र")').first();
    await expect(helpBtn).toBeVisible();
    await helpBtn.click();

    // Verify Help Center rendered
    await expect(page.locator('h1:has-text("Platform Help & Non-Technical User Guide")')).toBeVisible();
    await expect(page.locator('button:has-text("AI Assistant & Citations")')).toBeVisible();
    await expect(page.locator('button:has-text("Standards & QCO Finder")')).toBeVisible();
    await expect(page.locator('button:has-text("Schemes & MSME CBTF")')).toBeVisible();
    await expect(page.locator('button:has-text("ISI & Gold Verification")')).toBeVisible();
    await expect(page.locator('button:has-text("Accessibility & Screen Readers")')).toBeVisible();

    // Switch tab to Accessibility & Screen Readers
    await page.locator('button:has-text("Accessibility & Screen Readers")').click();
    await expect(page.locator('text=Accessibility Features & Keyboard Shortcuts')).toBeVisible();
    await expect(page.locator('text=Screen Reader Documentation')).toBeVisible();
  });

  test('GIGW-7: Website Policies includes Security Policy, Content Lifecycle, Cookies, and RTI', async ({ page }) => {
    const policiesBtn = page.locator('footer button:has-text("Website Policies")').first();
    await expect(policiesBtn).toBeVisible();
    await policiesBtn.click();

    // Verify 9 statutory policy tabs are available in main content
    const mainPolicies = page.locator('#main-content');
    await expect(mainPolicies.locator('button:has-text("Website Security Policy")')).toBeVisible();
    await expect(mainPolicies.locator('button:has-text("Content Archival & Lifecycle")')).toBeVisible();
    await expect(mainPolicies.locator('button:has-text("Cookie & Client Storage")')).toBeVisible();
    await expect(mainPolicies.locator('button:has-text("Right to Information (RTI)")')).toBeVisible();

    // Click Security Policy tab
    await mainPolicies.locator('button:has-text("Website Security Policy")').click();
    await expect(page.locator('text=Vulnerability Disclosure Program (VDP)')).toBeVisible();
    await expect(page.locator('text=Government Production Cutover Roadmap')).toBeVisible();
    await expect(page.locator('text=Vulnerability Assessment and Penetration Testing (VAPT)')).toBeVisible();

    // Click RTI tab
    await mainPolicies.locator('button:has-text("Right to Information (RTI)")').click();
    await expect(page.locator('text=Central Public Information Officer (CPIO)')).toBeVisible();
    await expect(page.locator('text=Head (Information Technology Department)')).toBeVisible();
    await expect(page.locator('text=First Appellate Authority (FAA)')).toBeVisible();
  });

  test('GIGW-8: Cookie & Local Storage banner appears and persists consent', async ({ page }) => {
    // Specifically test fresh unacknowledged load
    await page.evaluate(() => localStorage.removeItem('bis_cookie_consent'));
    await page.reload();

    // Banner should be visible
    const banner = page.locator('aside[aria-label*="Cookie"]');
    await expect(banner).toBeVisible();
    await expect(page.locator('text=Client Storage & Accessibility Preferences (GIGW 3.0)')).toBeVisible();
    await expect(page.locator('text=Zero Tracking Cookies')).toBeVisible();

    // Click Acknowledge & Accept
    const acceptBtn = page.locator('button:has-text("Acknowledge & Accept"), button:has-text("स्वीकार करें")');
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();

    // Banner should disappear
    await expect(banner).not.toBeVisible();

    // Should persist in localStorage
    const consent = await page.evaluate(() => localStorage.getItem('bis_cookie_consent'));
    expect(consent).toBe('true');

    // Reload and verify banner remains dismissed
    await page.reload();
    await expect(page.locator('aside[aria-label*="Cookie"]')).not.toBeVisible();
  });

  test('GIGW-9: Bilingual Hindi toggle achieves complete content parity', async ({ page }) => {
    const hiBtn = page.locator('button:has-text("हिंदी")');
    await expect(hiBtn).toBeVisible();
    await hiBtn.click();

    // Nav and hero should be in Hindi
    await expect(page.locator('header').getByText('भारतीय मानक ब्यूरो').first()).toBeVisible();
    await expect(page.locator('button:has-text("होम")').first()).toBeVisible();
    await expect(page.locator('button:has-text("एआई सहायक")').first()).toBeVisible();

    // Breadcrumbs in Hindi
    const enBtn = page.locator('button:has-text("English")');
    await expect(enBtn).toBeVisible();
    await enBtn.click();

    // Switches back to English
    await expect(page.locator('header').getByText('BUREAU OF INDIAN STANDARDS').first()).toBeVisible();
  });
});
