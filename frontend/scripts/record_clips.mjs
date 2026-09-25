import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function recordClip({ query, outputName, waitTimeMs = 4000 }) {
  const outputDir = path.resolve('./public/videos/recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  console.log(`Navigating for: ${outputName}...`);
  await page.goto('http://127.0.0.1:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // If terms modal or disclaimer is open, accept / dismiss it
  const acceptBtn = page.locator('button:has-text("I Understand & Accept"), button:has-text("Accept & Continue"), button:has-text("Dismiss")');
  if (await acceptBtn.isVisible()) {
    await acceptBtn.click();
    await page.waitForTimeout(500);
  }

  // Switch to AI Assistant tab
  const assistantBtn = page.locator('header button:has-text("Ask the Assistant"), header button:has-text("एआई सहायक से पूछें")').first();
  if (await assistantBtn.isVisible()) {
    await assistantBtn.click();
    await page.waitForTimeout(1000);
  }

  // Type the query slowly to simulate realistic interaction
  const textarea = page.locator('textarea[aria-label="Ask the BIS Intelligent Assistant a regulatory question"]');
  await textarea.waitFor({ state: 'visible', timeout: 5000 });
  await textarea.click();
  await textarea.fill(query);
  await page.waitForTimeout(600);

  // Click Send
  const sendBtn = page.locator('button:has-text("Send"), button:has-text("पूछें")');
  await sendBtn.click();

  // Wait for response bubble and citation chip
  console.log('Waiting for assistant response...');
  try {
    const citationChip = page.locator('button.citation-chip').first();
    await citationChip.waitFor({ state: 'visible', timeout: 15000 });
  } catch (e) {
    console.log('Citation chip wait timed out, proceeding with timeout');
  }

  await page.waitForTimeout(2000);

  // Scroll smoothly down to highlight the answer and citations
  await page.evaluate(() => {
    window.scrollBy({ top: 250, behavior: 'smooth' });
  });

  await page.waitForTimeout(waitTimeMs);

  const videoPath = await page.video()?.path();
  await page.close();
  await context.close();
  await browser.close();

  if (videoPath && fs.existsSync(videoPath)) {
    const targetFile = path.resolve(`./public/videos/${outputName}.webm`);
    fs.copyFileSync(videoPath, targetFile);
    const stats = fs.statSync(targetFile);
    console.log(`Created ${outputName}.webm: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  }
}

async function run() {
  await recordClip({
    query: 'Which Indian Standard and QCO applies to cement bag for construction?',
    outputName: 'explainer-cement-qco',
    waitTimeMs: 4000
  });

  await recordClip({
    query: 'What are the mandatory requirements for gold jewelry hallmarking and HUID under BIS regulations?',
    outputName: 'explainer-gold-hallmarking',
    waitTimeMs: 4000
  });

  await recordClip({
    query: 'What are the mandatory quality control requirements for Fe 500D TMT steel bars under IS 1786?',
    outputName: 'explainer-steel-tmt',
    waitTimeMs: 4000
  });
  
  console.log('All clips recorded successfully!');
}

run().catch(console.error);
