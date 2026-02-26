import { test, expect } from '@playwright/test';

test.describe('Text Highlighter Extension - Row Mode', () => {
  test('clicking a line in row mode highlights the full width', async ({ page }) => {
    // 1. Setup a test page
    await page.setContent(`
      <html>
        <head>
          <style>
            #content { width: 500px; line-height: 20px; font-size: 16px; }
          </style>
        </head>
        <body>
          <div id="content">
            <p id="p1">This is a long paragraph that should definitely span multiple lines in a container that is only five hundred pixels wide so we can test row detection.</p>
          </div>
        </body>
      </html>
    `);

    // 2. Inject scripts and styles
    await page.addScriptTag({ path: './dist/content/index.js' });
    await page.addStyleTag({ path: './src/styles/theme.css' });
    await page.addStyleTag({ path: './src/styles/highlighter.css' });

    // 3. Enable Row mode
    await page.evaluate(() => {
      // @ts-ignore
      window.currentConfig = { activeMode: 'row', isEnabled: true, color: '#ffff00', opacity: 0.5 };
    });

    // 4. Click on the first line
    const p1 = page.locator('#p1');
    await p1.click({ position: { x: 50, y: 10 } });

    // 5. Verify the highlight overlay
    const overlay = page.locator('.ext-highlighter-row-overlay');
    await expect(overlay).toBeVisible();
    
    // Check if it's full width (based on container width)
    const box = await overlay.boundingBox();
    expect(box?.width).toBeGreaterThan(400); // Should be close to 500px
    expect(box?.height).toBeCloseTo(20, 0); // Matches line-height
  });
});
