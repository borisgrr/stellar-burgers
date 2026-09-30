import { chromium } from '@playwright/test';

async function recordHar() {
  const browser = await chromium.launch();

  const context = await browser.newContext({
    recordHar: {
      path: 'tests/hars/ingredients.har'
    }
  });

  const page = await context.newPage();

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          email: 'boris1@mail.ru',
          name: 'Борис'
        }
      })
    });
  });

  await page.route('**/api/orders', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'Метеоритный краторный бургер',
        order: {
          ingredients: [
            {
              _id: '643d69a5c3f7b9001cfa093c',
              name: 'Краторная булка N-200i',
              type: 'bun',
              proteins: 80,
              fat: 24,
              carbohydrates: 53,
              calories: 420,
              price: 1255,
              image: 'https://code.s3.yandex.net/react/code/bun-02.png',
              image_mobile:
                'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/bun-02-large.png',
              __v: 0
            },
            {
              _id: '643d69a5c3f7b9001cfa0940',
              name: 'Говяжий метеорит (отбивная)',
              type: 'main',
              proteins: 800,
              fat: 800,
              carbohydrates: 300,
              calories: 2674,
              price: 3000,
              image: 'https://code.s3.yandex.net/react/code/meat-04.png',
              image_mobile:
                'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/meat-04-large.png',
              __v: 0
            },
            {
              _id: '643d69a5c3f7b9001cfa093c',
              name: 'Краторная булка N-200i',
              type: 'bun',
              proteins: 80,
              fat: 24,
              carbohydrates: 53,
              calories: 420,
              price: 1255,
              image: 'https://code.s3.yandex.net/react/code/bun-02.png',
              image_mobile:
                'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/bun-02-large.png',
              __v: 0
            }
          ],
          _id: '6ab574d56a172d001b995b55',
          owner: {
            name: 'Борис',
            email: 'boris1@mail.ru',
            createdAt: '2026-09-23T19:36:27.301Z',
            updatedAt: '2026-09-23T19:36:27.301Z'
          },
          status: 'done',
          name: 'Метеоритный краторный бургер',
          createdAt: '2026-09-24T19:07:01.613Z',
          updatedAt: '2026-09-24T19:07:01.710Z',
          number: 110559,
          price: 5510
        }
      })
    });
  });

  const ingredientsResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/ingredients') &&
      response.request().method() === 'GET'
  );

  const userResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/auth/user') &&
      response.request().method() === 'GET'
  );

  const orderResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/orders') &&
      response.request().method() === 'POST'
  );

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'fake-refresh-token');
  });

  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'fake-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.goto('http://localhost:4000/');

  await ingredientsResponse;
  await userResponse;

  const bun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });

  await bun.getByRole('button', { name: 'Добавить' }).click();

  const main = page
    .locator('li')
    .filter({ hasText: 'Говяжий метеорит (отбивная)' });

  await main.getByRole('button', { name: 'Добавить' }).click();

  await page.locator('button').filter({ hasText: 'Оформить заказ' }).click();

  await orderResponse;

  await context.close();
  await browser.close();
}

recordHar();
