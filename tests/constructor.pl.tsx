import { expect, test } from '@playwright/test';
test.describe('Конструктор', () => {
  test('добавление ингредиента из списка в конструктор', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    await page.goto('http://localhost:4000/');

    const bun = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    const main = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магноли' });

    await main.getByRole('button', { name: 'Добавить' }).click();

    const sauce = page.locator('li').filter({ hasText: 'Соус Spicy-X' });

    await sauce.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();

    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();

    const costruktor = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    await expect(
      costruktor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();

    await expect(costruktor.getByText('Соус Spicy-X')).toBeVisible();
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    await page.goto('http://localhost:4000/');

    const bun = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });

    await bun.click();

    await expect(page.getByText('Информация об ингредиенте')).toBeVisible();
  });
  test('закрытие по клику на крестик', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    await page.goto('http://localhost:4000/');

    const bun = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bun.click();

    const modal = page.getByText(
      'Информация об ингредиентеКраторная булка N-200iКалории, ккал420Белки, г80'
    );

    await modal.getByRole('button').filter({ hasText: /^$/ }).click();

    await expect(page.getByText('Информация об ингредиенте')).toBeHidden();
  });
  test('закрытие по клику на оверлей', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    await page.goto('http://localhost:4000/');

    const bun = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });

    await bun.click();

    const overlay = page.getByTestId('modal-overlay');

    await overlay.click({
      position: { x: 10, y: 10 }
    });

    await expect(page.getByText('Информация об ингредиенте')).toBeHidden();
  });

  test('создание заказа', async ({ page }) => {
    const expectedOrderNumber = 110559;

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

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

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
            number: expectedOrderNumber,
            price: 5510
          }
        })
      });
    });
    await page.goto('http://localhost:4000/');

    const bun = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    const main = page
      .locator('li')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' });

    await main.getByRole('button', { name: 'Добавить' }).click();

    await page.locator('button').filter({ hasText: 'Оформить заказ' }).click();

    const orderNumber = page.getByText(String(expectedOrderNumber));
    await expect(page.getByText(String(expectedOrderNumber))).toBeVisible();

    const modal = orderNumber.locator('xpath=../..');

    await modal.getByRole('button').click();

    const costruktor = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    await expect(costruktor.getByText('Краторная булка N-200i')).toBeHidden();

    await expect(
      costruktor.getByText('Говяжий метеорит (отбивная)')
    ).toBeHidden();

    await expect(page.getByText(String(expectedOrderNumber))).toBeHidden();
  });
});
