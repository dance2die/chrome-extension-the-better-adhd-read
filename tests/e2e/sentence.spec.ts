import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Text Highlighter Extension - Sentence Mode', () => {
  let extensionId: string;

  test.beforeEach(async ({ context }) => {
    // Note: Assuming standard playwright extension loading setup in a fixture or global setup.
    // For a basic test without complex background page manifest loading, 
    // we assume the page is injected with the content script.
    // In a real unpacked extension test, we'd launch a persistent context with --load-extension.
    // Given the constraints of the standard config generated, we will mock the DOM interaction
    // that the content script would perform, or rely on a pre-configured fixture if one existed.
    // For now, we will create a robust test that verifies the DOM manipulation logic.
  });

  test('clicking a sentence highlights it', async ({ page }) => {
    // 1. Setup a test page with sentences
    await page.setContent(`
      <html>
        <body>
          <div id="content">
            <p id="p1">Hello world. This is the first test sentence. And this is the second.</p>
          </div>
        </body>
      </html>
    `);

    // 2. Inject our content script logic directly for the test since we aren't 
    // launching a full persistent Chrome profile with the unpacked extension here.
    // In a full CI setup, this would be handled by launching chromium with `--load-extension`.
    await page.addScriptTag({ path: './dist/content/index.js' });
    await page.addStyleTag({ path: './src/styles/theme.css' });
    await page.addStyleTag({ path: './src/styles/highlighter.css' });

    // 3. Simulate the config being loaded and enabled
    await page.evaluate(() => {
      // @ts-ignore - injecting mock state into the page
      window.currentConfig = { activeMode: 'sentence', isEnabled: true, color: '#ffff00', opacity: 0.5 };
    });

    // 4. Click on the first sentence (approximate coordinates or specific element)
    // We need to click specifically on the text node. Playwright's click on the <p> 
    // might hit the middle. Let's click near the start.
    const p1 = page.locator('#p1');
    await p1.click({ position: { x: 10, y: 5 } }); // Click near "Hello"

    // 5. Verify the highlight span was created
    const highlight = page.locator('.ext-highlighter-active');
    await expect(highlight).toBeVisible();
    await expect(highlight).toHaveText('Hello world.');
  });
});
