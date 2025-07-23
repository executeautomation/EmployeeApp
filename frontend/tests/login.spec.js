import { test, expect } from '@playwright/test';

test.describe('Login functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('successful login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for the page to load
    await expect(page.getByText('Login')).toBeVisible();
    
    // Fill in valid credentials - using labels to find inputs
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for navigation to employee list
    await expect(page).toHaveURL('/list');
    
    // Verify we're on the employee list page
    await expect(page.getByText('Employee List')).toBeVisible();
    
    // Verify login state is stored
    const loggedIn = await page.evaluate(() => localStorage.getItem('loggedIn'));
    expect(loggedIn).toBe('true');
  });

  test('failed login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.getByLabel('Username').fill('wronguser');
    await page.getByLabel('Password').fill('wrongpassword');
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should still be on login page
    await expect(page).toHaveURL('/login');
    
    // Should show error message
    await expect(page.getByText('Invalid username or password')).toBeVisible();
    
    // Verify login state is not stored
    const loggedIn = await page.evaluate(() => localStorage.getItem('loggedIn'));
    expect(loggedIn).toBeNull();
  });

  test('failed login with empty credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Click login button without filling credentials
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should still be on login page (form validation should prevent submission)
    await expect(page).toHaveURL('/login');
    
    // Verify login state is not stored
    const loggedIn = await page.evaluate(() => localStorage.getItem('loggedIn'));
    expect(loggedIn).toBeNull();
  });

  test('logout functionality', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for navigation to employee list
    await expect(page).toHaveURL('/list');
    
    // Click logout button
    await page.getByRole('button', { name: 'Logoff' }).click();
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    
    // Verify login state is cleared
    const loggedIn = await page.evaluate(() => localStorage.getItem('loggedIn'));
    expect(loggedIn).toBeNull();
  });

  test('protected route redirection', async ({ page }) => {
    // Try to access protected route without login
    await page.goto('/list');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });
});