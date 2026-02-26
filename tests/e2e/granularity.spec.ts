import { test, expect } from '@playwright/test';

test.describe('Text Highlighter Extension - Granularity', () => {
  test('can switch to word mode and highlight a single word', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <p id="p1">Highlight this specific word.</p>
        </body>
      </html>
    `);

    await page.addScriptTag({ path: './dist/content/index.js' });
    await page.addStyleTag({ path: './src/styles/theme.css' });
    await page.addStyleTag({ path: './src/styles/highlighter.css' });

    // Enable Word mode
    await page.evaluate(() => {
      // @ts-ignore
      window.currentConfig = { activeMode: 'word', isEnabled: true, color: '#ffff00', opacity: 0.5 };
    });

    // Click near "this"
    const p1 = page.locator('#p1');
    await p1.click({ position: { x: 80, y: 10 } });

    const highlight = page.locator('.ext-highlighter-active');
    await expect(highlight).toBeVisible();
    await expect(highlight).toHaveText('this');
  });

  test('can switch to paragraph mode and highlight the full block', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <p id="p1">This is a full paragraph that should be highlighted entirely.</p>
        </body>
      </html>
    `);

    await page.addScriptTag({ path: './dist/content/index.js' });
    await page.addStyleTag({ path: './src/styles/theme.css' });
    await page.addStyleTag({ path: './src/styles/highlighter.css' });

    // Enable Paragraph mode
    await page.evaluate(() => {
      // @ts-ignore
      window.currentConfig = { activeMode: 'paragraph', isEnabled: true, color: '#ffff00', opacity: 0.5 };
    });

    const p1 = page.locator('#p1');
    await p1.click();

    const highlight = page.locator('.ext-highlighter-active');
    await expect(highlight).toBeVisible();
    await expect(highlight).toHaveText('This is a full paragraph that should be highlighted entirely.');
  });
});
