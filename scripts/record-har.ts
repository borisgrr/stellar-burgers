import { chromium } from '@playwright/test';

async function recordHar() {
  const browser = await chromium.launch();

  const context = await browser.newContext({
    recordHar: {
      path: 'tests/hars/ingredients.har'
    }
  });

  const page = await context.newPage();

  const ingredientsResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/ingredients') &&
      response.request().method() === 'GET'
  );

  await page.goto('http://localhost:4000/');

  await ingredientsResponse;

  await context.close();

  await browser.close();
}

recordHar();
