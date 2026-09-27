import { expect, test } from '@playwright/test';

test.describe('Конструктор', () => {
  test('добавление ингредиента из списка в конструктор', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/**'
    });

    await page.goto('http://localhost:4000/');

    const costruktor = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    await expect(
      costruktor.getByText('Краторная булка N-200i (верх)')
    ).toBeHidden();

    await expect(
      costruktor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeHidden();

    await expect(costruktor.getByText('Соус Spicy-X')).toBeHidden();

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

    await expect(
      costruktor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();

    await expect(costruktor.getByText('Соус Spicy-X')).toBeVisible();
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/**'
    });

    await page.goto('http://localhost:4000/');

    const sauce = page.locator('li').filter({ hasText: 'Соус Spicy-X' });

    await expect(page.getByText('Информация об ингредиенте')).toBeHidden();

    await sauce.click();

    const modal = page.locator('#modals');

    await expect(modal.getByText('Информация об ингредиенте')).toBeVisible();

    await expect(modal.getByText('Соус Spicy-X')).toBeVisible();

    await expect(
      modal
        .getByRole('listitem')
        .filter({ hasText: 'Калории, ккал' })
        .getByText('30')
    ).toBeVisible();

    await expect(
      modal
        .getByRole('listitem')
        .filter({ hasText: 'Белки, г' })
        .getByText('30')
    ).toBeVisible();
  });

  test('закрытие по клику на крестик', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/**'
    });

    await page.goto('http://localhost:4000/');

    const sauce = page.locator('li').filter({ hasText: 'Соус Spicy-X' });

    await sauce.click();

    const modal = page.locator('#modals');

    await expect(modal.getByText('Информация об ингредиенте')).toBeVisible();

    await modal.getByRole('button').click();

    await expect(page.getByText('Информация об ингредиенте')).toBeHidden();
  });

  test('закрытие по клику на оверлей', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/**'
    });

    await page.goto('http://localhost:4000/');

    const sauce = page.locator('li').filter({ hasText: 'Соус Spicy-X' });

    await sauce.click();

    await expect(page.getByText('Информация об ингредиенте')).toBeVisible();

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
      url: '**/api/**'
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

    const costruktor = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    await expect(
      costruktor.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();

    await expect(
      costruktor.getByText('Краторная булка N-200i (низ)')
    ).toBeVisible();

    await expect(
      costruktor.getByText('Говяжий метеорит (отбивная)')
    ).toBeVisible();

    await page.locator('button').filter({ hasText: 'Оформить заказ' }).click();

    const orderNumber = page.getByText(String(expectedOrderNumber));

    await expect(page.getByText(String(expectedOrderNumber))).toBeVisible();

    const modal = orderNumber.locator('xpath=../..');

    await modal.getByRole('button').click();

    await expect(
      costruktor.getByText('Краторная булка N-200i (верх)')
    ).toBeHidden();

    await expect(
      costruktor.getByText('Краторная булка N-200i (низ)')
    ).toBeHidden();

    await expect(
      costruktor.getByText('Говяжий метеорит (отбивная)')
    ).toBeHidden();

    await expect(page.getByText(String(expectedOrderNumber))).toBeHidden();
  });
});
