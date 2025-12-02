import { test, expect } from '@playwright/test';

test.describe('Shopping Cart E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to empty cart page', async ({ page }) => {
    await page.goto('/carts');

    // Should show empty cart message
    await expect(page.getByText(/sepetiniz boş/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /alışverişe başla/i })).toBeVisible();
  });

  test('should add product to cart from homepage', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('.product-card', { timeout: 10000 });

    // Click "Add to Cart" on first product
    await page.locator('.product-card').first().locator('button:has-text(\"Sepete Ekle\")').click();

    // Verify success toast appears
    await expect(page.getByText(/ürün sepete eklendi/i)).toBeVisible({ timeout: 3000 });

    // Verify cart badge shows "1"
    await expect(page.locator('.badge.bg-danger')).toContainText('1');
  });

  test('should view cart with added items', async ({ page }) => {
    // Add product to cart first
    await page.waitForSelector('.product-card', { timeout: 10000 });
    await page.locator('.product-card').first().locator('button:has-text(\"Sepete Ekle\")').click();
    await page.waitForTimeout(1000);

    // Navigate to cart
    await page.goto('/carts');

    // Should show cart items
    await expect(page.getByText(/alışveriş sepetim/i)).toBeVisible();
    await expect(page.locator('.row.align-items-center').first()).toBeVisible();
  });

  test('should increase product quantity in cart', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('.product-card', { timeout: 10000 });
    await page.locator('.product-card').first().locator('button:has-text(\"Sepete Ekle\")').click();
    await page.waitForTimeout(1000);

    // Navigate to cart
    await page.goto('/carts');

    // Find the quantity display
    const quantityText = await page.locator('.fw-bold.px-2').first().textContent();
    const initialQuantity = parseInt(quantityText || '0');

    // Click increase button (+)
    await page.locator('button.text-success').first().click();
    await page.waitForTimeout(500);

    // Verify quantity increased
    const newQuantityText = await page.locator('.fw-bold.px-2').first().textContent();
    const newQuantity = parseInt(newQuantityText || '0');
    expect(newQuantity).toBe(initialQuantity + 1);
  });

  test('should decrease product quantity in cart', async ({ page }) => {
    // Add product to cart twice
    await page.waitForSelector('.product-card', { timeout: 10000 });
    await page.locator('.product-card').first().locator('button:has-text(\"Sepete Ekle\")').click();
    await page.waitForTimeout(500);
    await page.locator('.product-card').first().locator('button:has-text(\"Sepete Ekle\")').click();
    await page.waitForTimeout(1000);

    // Navigate to cart
    await page.goto('/carts');

    // Get initial quantity
    const quantityText = await page.locator('.fw-bold.px-2').first().textContent();
    const initialQuantity = parseInt(quantityText || '0');

    // Click decrease button (-)
    await page.locator('button.text-danger').first().click();
    await page.waitForTimeout(500);

    // Verify quantity decreased
    const newQuantityText = await page.locator('.fw-bold.px-2').first().textContent();
    const newQuantity = parseInt(newQuantityText || '0');
    expect(newQuantity).toBe(initialQuantity - 1);
  });

  test('should complete purchase', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('.product-card', { timeout: 10000 });
    await page.locator('.product-card').first().locator('button:has-text(\"Sepete Ekle\")').click();
    await page.waitForTimeout(1000);

    // Navigate to cart
    await page.goto('/carts');

    // Click complete purchase button
    await page.getByRole('button', { name: /siparişi tamamla/i }).click();

    // Should show success message
    await expect(page.getByText(/satın alma işlemi başarılı/i)).toBeVisible({ timeout: 3000 });

    // Cart should be empty after purchase
    await page.waitForTimeout(500);
    await expect(page.getByText(/sepetiniz boş/i)).toBeVisible();
  });

  test('should calculate totals correctly', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('.product-card', { timeout: 10000 });
    
    // Get product price from card
    const priceText = await page.locator('.product-card').first().locator('.fw-bold.text-primary').textContent();
    const productPrice = parseFloat(priceText?.replace(/[^\d.]/g, '') || '0');

    await page.locator('.product-card').first().locator('button:has-text(\"Sepete Ekle\")').click();
    await page.waitForTimeout(1000);

    // Navigate to cart
    await page.goto('/carts');

    // Verify subtotal
    const subtotalText = await page.getByText(/ara toplam/i).locator('..').locator('.fw-semibold').textContent();
    const subtotal = parseFloat(subtotalText?.replace(/[^\d.]/g, '') || '0');
    
    expect(Math.abs(subtotal - productPrice)).toBeLessThan(0.01); // Allow for floating point precision
  });
});
