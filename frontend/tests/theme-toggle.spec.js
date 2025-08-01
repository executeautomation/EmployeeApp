import { test, expect } from '@playwright/test';

test.describe('Theme Toggle (Dark/Light Mode)', () => {
  test.beforeEach(async ({ page }) => {
    // Start from login page
    await page.goto('/login');
  });

  test('toggle theme on login page', async ({ page }) => {
    // Check initial theme (should be light mode)
    const body = page.locator('body');
    
    // Look for theme toggle button
    const themeToggleButton = page.locator('[data-testid="theme-toggle"], button:has(svg)').last();
    
    // Initial state should be light mode (look for light mode icon)
    await expect(page.locator('[data-testid="Brightness4Icon"], svg[data-testid="Brightness4Icon"]')).toBeVisible();
    
    // Click theme toggle
    await themeToggleButton.click();
    
    // Should now show dark mode icon
    await expect(page.locator('[data-testid="Brightness7Icon"], svg[data-testid="Brightness7Icon"]')).toBeVisible();
    
    // Click again to toggle back to light mode
    await themeToggleButton.click();
    
    // Should show light mode icon again
    await expect(page.locator('[data-testid="Brightness4Icon"], svg[data-testid="Brightness4Icon"]')).toBeVisible();
  });

  test('theme persists after login', async ({ page }) => {
    // Toggle to dark mode on login page
    const themeToggleButton = page.locator('[data-testid="theme-toggle"], button:has(svg)').last();
    await themeToggleButton.click();
    
    // Login
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/list');
    
    // Theme should still be dark mode
    await expect(page.locator('[data-testid="Brightness7Icon"], svg[data-testid="Brightness7Icon"]')).toBeVisible();
  });

  test('theme toggle works on employee list page', async ({ page }) => {
    // Login first
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/list');
    
    // Toggle theme on employee list page
    const themeToggleButton = page.locator('[data-testid="theme-toggle"], button:has(svg)').last();
    
    // Should start in light mode
    await expect(page.locator('[data-testid="Brightness4Icon"], svg[data-testid="Brightness4Icon"]')).toBeVisible();
    
    // Toggle to dark mode
    await themeToggleButton.click();
    await expect(page.locator('[data-testid="Brightness7Icon"], svg[data-testid="Brightness7Icon"]')).toBeVisible();
    
    // Toggle back to light mode
    await themeToggleButton.click();
    await expect(page.locator('[data-testid="Brightness4Icon"], svg[data-testid="Brightness4Icon"]')).toBeVisible();
  });

  test('theme toggle works on employee form page', async ({ page }) => {
    // Login and navigate to form
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/list');
    
    await page.click('text=Add Employee');
    await expect(page).toHaveURL('/form');
    
    // Toggle theme on form page
    const themeToggleButton = page.locator('[data-testid="theme-toggle"], button:has(svg)').last();
    
    // Toggle to dark mode
    await themeToggleButton.click();
    await expect(page.locator('[data-testid="Brightness7Icon"], svg[data-testid="Brightness7Icon"]')).toBeVisible();
    
    // Toggle back to light mode
    await themeToggleButton.click();
    await expect(page.locator('[data-testid="Brightness4Icon"], svg[data-testid="Brightness4Icon"]')).toBeVisible();
  });

  test('theme changes affect visual appearance', async ({ page }) => {
    // Login first
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/list');
    
    // Get initial background color (light mode)
    const body = page.locator('body');
    const lightBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Toggle to dark mode
    const themeToggleButton = page.locator('[data-testid="theme-toggle"], button:has(svg)').last();
    await themeToggleButton.click();
    
    // Wait a moment for theme to apply
    await page.waitForTimeout(100);
    
    // Get dark mode background color
    const darkBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Colors should be different
    expect(lightBgColor).not.toBe(darkBgColor);
    
    // Toggle back to light mode
    await themeToggleButton.click();
    await page.waitForTimeout(100);
    
    // Should return to original color
    const returnedBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(returnedBgColor).toBe(lightBgColor);
  });

  test('theme state maintained across page navigation', async ({ page }) => {
    // Login and toggle to dark mode
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    const themeToggleButton = page.locator('[data-testid="theme-toggle"], button:has(svg)').last();
    await themeToggleButton.click(); // Switch to dark mode
    
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/list');
    
    // Should still be in dark mode
    await expect(page.locator('[data-testid="Brightness7Icon"], svg[data-testid="Brightness7Icon"]')).toBeVisible();
    
    // Navigate to form page
    await page.click('text=Add Employee');
    await expect(page).toHaveURL('/form');
    
    // Should still be in dark mode
    await expect(page.locator('[data-testid="Brightness7Icon"], svg[data-testid="Brightness7Icon"]')).toBeVisible();
    
    // Navigate back to list
    await page.click('text=Employee List');
    await expect(page).toHaveURL('/list');
    
    // Should still be in dark mode
    await expect(page.locator('[data-testid="Brightness7Icon"], svg[data-testid="Brightness7Icon"]')).toBeVisible();
  });
});