import { test, expect } from '@playwright/test';

test.describe('Text Highlighter Extension - Trigger Mode', () => {
  test('hover mode highlights text on mousemove without clicking', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <p id="p1">Hover over this sentence to highlight it.</p>
        </body>
      </html>
    `);

    await page.addScriptTag({ path: './dist/content/index.js', type: 'module' });
    await page.addStyleTag({ path: './src/styles/theme.css' });
    await page.addStyleTag({ path: './src/styles/highlighter.css' });

    // Enable hover mode with sentence granularity
    await page.evaluate(() => {
      // @ts-ignore
      window.__ADHD_READ_CONFIG__({
        activeMode: 'sentence',
        isEnabled: true,
        lightColor: '#ffff00',
        darkColor: '#004d40',
        themeMode: 'light',
        opacity: 0.5,
        triggerMode: 'hover',
      });
    });

    // Hover over the paragraph (no click)
    const p1 = page.locator('#p1');
    await p1.hover({ position: { x: 50, y: 10 } });

    // Wait for debounce to fire
    await page.waitForTimeout(150);

    const highlight = page.locator('.ext-highlighter-active');
    await expect(highlight).toBeVisible();
  });

  test('click mode does NOT highlight on hover', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <p id="p1">This should not highlight on hover.</p>
        </body>
      </html>
    `);

    await page.addScriptTag({ path: './dist/content/index.js', type: 'module' });
    await page.addStyleTag({ path: './src/styles/theme.css' });
    await page.addStyleTag({ path: './src/styles/highlighter.css' });

    // Enable click mode (default)
    await page.evaluate(() => {
      // @ts-ignore
      window.__ADHD_READ_CONFIG__({
        activeMode: 'sentence',
        isEnabled: true,
        lightColor: '#ffff00',
        darkColor: '#004d40',
        themeMode: 'light',
        opacity: 0.5,
        triggerMode: 'click',
      });
    });

    // Only hover, don't click
    const p1 = page.locator('#p1');
    await p1.hover();
    await page.waitForTimeout(150);

    const highlight = page.locator('.ext-highlighter-active');
    await expect(highlight).toHaveCount(0);
  });
});
