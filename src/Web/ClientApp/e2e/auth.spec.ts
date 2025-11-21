import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');

    // Click submit without filling form
    await page.getByRole('button', { name: /sign in/i }).click();

    // HTML5 validation should prevent submission
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeFocused();
  });

  test('should submit login form', async ({ page }) => {
    await page.goto('/login');

    // Fill in form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for navigation or success message
    await page.waitForTimeout(2000);
  });

  test('should navigate to register page from login', async ({ page }) => {
    await page.goto('/login');

    // Click "Sign Up" link
    await page.getByRole('link', { name: /sign up/i }).click();

    // Verify we're on register page
    await expect(page).toHaveURL('/register');
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
  });

  test('should validate password confirmation on register', async ({ page }) => {
    await page.goto('/register');

    // Fill in form with mismatched passwords
    await page.getByLabel(/^email/i).fill('test@example.com');
    await page.getByLabel(/^password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('different');

    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();

    // Wait for error message
    await expect(page.getByText(/passwords don't match/i)).toBeVisible({ timeout: 2000 });
  });

  test('should register new user', async ({ page }) => {
    await page.goto('/register');

    // Fill in form
    await page.getByLabel(/^email/i).fill('newuser@example.com');
    await page.getByLabel(/^password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');

    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();

    // Wait for success and redirect
    await page.waitForTimeout(3000);
  });
});
