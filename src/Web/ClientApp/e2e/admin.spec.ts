import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard E2E Tests', () => {
  test('should navigate to admin dashboard', async ({ page }) => {
    await page.goto('/admin');

    await expect(page).toHaveURL('/admin');
    await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    await page.goto('/admin');

    // Check for statistics cards
    await expect(page.getByText('Total Products')).toBeVisible();
    await expect(page.getByText('Total Orders')).toBeVisible();
    await expect(page.getByText('Total Revenue')).toBeVisible();
    await expect(page.getByText('Active Users')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/admin');

    // Click Products tab
    await page.getByRole('button', { name: /products/i }).click();
    await expect(page.getByText('Product Management')).toBeVisible();

    // Click Overview tab
    await page.getByRole('button', { name: /overview/i }).click();
    await expect(page.getByText('Recent Activity')).toBeVisible();
  });

  test('should navigate to add product page', async ({ page }) => {
    await page.goto('/admin');

    // Click Add Product button
    await page.getByRole('button', { name: /add product/i }).first().click();

    // Verify we're on add product page
    await expect(page).toHaveURL('/admin/products/add');
    await expect(page.getByRole('heading', { name: /add new product/i })).toBeVisible();
  });

  test('should fill and submit product form', async ({ page }) => {
    await page.goto('/admin/products/add');

    // Fill in form
    await page.getByLabel(/product title/i).fill('Test Product');
    await page.getByLabel(/description/i).fill('This is a test product description');
    await page.getByLabel(/price/i).fill('99.99');
    await page.getByLabel(/category/i).selectOption('Electronics');
    await page.getByLabel(/image url/i).fill('https://via.placeholder.com/300');

    // Verify image preview appears
    await expect(page.locator('img[alt="Preview"]')).toBeVisible();

    // Submit form
    await page.getByRole('button', { name: /add product/i }).click();

    // Wait for navigation back to admin
    await page.waitForTimeout(2000);
  });

  test('should cancel product creation', async ({ page }) => {
    await page.goto('/admin/products/add');

    // Fill in some data
    await page.getByLabel(/product title/i).fill('Test Product');

    // Click cancel
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: /cancel/i }).click();

    // Should navigate back to admin
    await expect(page).toHaveURL('/admin');
  });
});
