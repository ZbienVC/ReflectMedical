import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.error('ERROR:', error.message));
  try {
    await page.goto('http://localhost:3000/membership', { waitUntil: 'load', timeout: 30000 });
    console.log("Page loaded!");
    await page.waitForTimeout(2000); // Wait for React to mount
  } catch (e) {
    console.error('NAV ERROR:', e.message);
  }
  await browser.close();
})();
