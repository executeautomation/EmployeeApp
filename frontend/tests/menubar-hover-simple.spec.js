import { test, expect } from '@playwright/test';

test.describe('MenuBar Hover Menus - Core Tests', () => {
  test('theme menu basic functionality', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    const themeButton = page.locator('[data-testid="theme-menu-button"]');
    
    // Theme button should be visible
    await expect(themeButton).toBeVisible();
    
    // Should initially show "Light"
    await expect(themeButton).toContainText('Light');
  });

  test('employee menu appears for logged in users', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Login first
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL('http://localhost:5173/list');
    
    // Employee button should now be visible
    const employeeButton = page.locator('[data-testid="employee-menu-button"]');
    await expect(employeeButton).toBeVisible();
    
    // Should contain "Employees" text
    await expect(employeeButton).toContainText('Employees');
  });
});