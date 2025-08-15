import { test, expect } from '@playwright/test';

test.describe('MenuBar Hover Menus - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('employee menu shows on hover when logged in', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/list');

    // Test employee menu hover
    const employeeButton = page.locator('[data-testid="employee-menu-button"]');
    const employeeMenu = page.locator('[data-testid="employee-menu"]');

    // Initially menu should not be visible
    await expect(employeeMenu).not.toBeVisible();

    // Hover over the employee button
    await employeeButton.hover();
    
    // Menu should become visible
    await expect(employeeMenu).toBeVisible();
    
    // Menu should contain both expected items
    await expect(page.locator('[data-testid="add-employee-menu-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="employee-list-menu-item"]')).toBeVisible();
  });

  test('theme menu shows on hover', async ({ page }) => {
    // Can test on login page (theme menu available when logged out)
    await page.goto('/login');

    const themeButton = page.locator('[data-testid="theme-menu-button"]');
    const themeMenu = page.locator('[data-testid="theme-menu"]');

    // Initially menu should not be visible
    await expect(themeMenu).not.toBeVisible();

    // Hover over the theme button
    await themeButton.hover();
    
    // Menu should become visible
    await expect(themeMenu).toBeVisible();
    
    // Check all theme options are present
    const expectedThemes = ['light', 'dark', 'blue', 'green', 'purple', 'orange'];
    
    for (const theme of expectedThemes) {
      await expect(page.locator(`[data-testid="theme-${theme}-menu-item"]`)).toBeVisible();
    }
  });

  test('employee menu navigation works', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/list');

    // Test Add Employee navigation
    const employeeButton = page.locator('[data-testid="employee-menu-button"]');
    const addEmployeeItem = page.locator('[data-testid="add-employee-menu-item"]');

    await employeeButton.hover();
    await addEmployeeItem.click();

    // Should navigate to form page
    await expect(page).toHaveURL('/form');
  });

  test('theme selection works', async ({ page }) => {
    await page.goto('/login');

    const themeButton = page.locator('[data-testid="theme-menu-button"]');
    
    // Initially should show "Light" theme
    await expect(themeButton).toContainText('Light');
    
    // Change to Dark theme
    await themeButton.hover();
    await page.locator('[data-testid="theme-dark-menu-item"]').click();
    
    // Button should now show "Dark"
    await expect(themeButton).toContainText('Dark');
  });

  test('employee menu not visible when logged out', async ({ page }) => {
    await page.goto('/login');
    
    // Employee menu button should not exist when logged out
    await expect(page.locator('[data-testid="employee-menu-button"]')).not.toBeVisible();
  });
});