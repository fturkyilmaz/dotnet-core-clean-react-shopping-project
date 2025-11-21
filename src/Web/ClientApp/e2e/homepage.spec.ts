import { test, expect } from '@playwright/test';

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display homepage with products', async ({ page }) => {
    // Check if header is visible
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('Furkan Store')).toBeVisible();

    // Check if products are loaded
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to product detail page', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('.product-card', { timeout: 10000 });

    // Click on first product
    await page.locator('.product-card').first().click();

    // Verify we're on product detail page
    await expect(page).toHaveURL(/\/product\/\d+/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('.product-card', { timeout: 10000 });

    // Click "Add to Cart" button on first product
    await page.locator('.product-card').first().locator('button:has-text("Sepete Ekle")').click();

    // Verify cart badge is updated
    await expect(page.locator('.badge.bg-danger')).toBeVisible();
  });

  test('should change language', async ({ page }) => {
    // Click language dropdown
    await page.locator('button:has-text("EN")').click();

    // Select Turkish
    await page.locator('button:has-text("🇹🇷 Türkçe")').click();

    // Verify language changed
    await expect(page.locator('button:has-text("TR")').first()).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    // Get initial theme
    const navbar = page.locator('nav');
    const initialBg = await navbar.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );

    // Click theme toggle button
    await page.locator('button[aria-label="Toggle theme"]').click();

    // Wait for transition
    await page.waitForTimeout(500);

    // Verify theme changed
    const newBg = await navbar.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(initialBg).not.toBe(newBg);
  });
});
