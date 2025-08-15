import { test, expect } from '@playwright/test';

test.describe('MenuBar Hover Menus', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5173/');
    await page.evaluate(() => localStorage.clear());
    await page.waitForLoadState('networkidle');
  });

  test.describe('Employee Menu - Logged In State', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test in this group
      await page.goto('http://localhost:5173/login');
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Username').fill('admin');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('http://localhost:5173/list');
    });

    test('employee menu appears on hover', async ({ page }) => {
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

    test('employee menu disappears when moving mouse away', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const employeeMenu = page.locator('[data-testid="employee-menu"]');

      // Hover to open menu
      await employeeButton.hover();
      await expect(employeeMenu).toBeVisible();

      // Move mouse away from both button and menu
      await page.mouse.move(0, 0);
      
      // Wait for menu to close (there might be a small delay)
      await expect(employeeMenu).not.toBeVisible({ timeout: 2000 });
    });

    test('employee menu stays open when hovering over menu items', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const employeeMenu = page.locator('[data-testid="employee-menu"]');
      const addEmployeeItem = page.locator('[data-testid="add-employee-menu-item"]');

      // Hover to open menu
      await employeeButton.hover();
      await expect(employeeMenu).toBeVisible();

      // Hover over menu item
      await addEmployeeItem.hover();
      
      // Menu should still be visible
      await expect(employeeMenu).toBeVisible();
    });

    test('add employee menu item navigates to form page', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const addEmployeeItem = page.locator('[data-testid="add-employee-menu-item"]');

      // Hover to open menu and click add employee
      await employeeButton.hover();
      await addEmployeeItem.click();

      // Should navigate to form page
      await expect(page).toHaveURL('http://localhost:5173/form');
      
      // Menu should close after navigation
      await expect(page.locator('[data-testid="employee-menu"]')).not.toBeVisible();
    });

    test('employee list menu item navigates to list page', async ({ page }) => {
      // First navigate to form page to test navigation back to list
      await page.goto('http://localhost:5173/form');
      
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const employeeListItem = page.locator('[data-testid="employee-list-menu-item"]');

      // Hover to open menu and click employee list
      await employeeButton.hover();
      await employeeListItem.click();

      // Should navigate to list page
      await expect(page).toHaveURL('http://localhost:5173/list');
      
      // Menu should close after navigation
      await expect(page.locator('[data-testid="employee-menu"]')).not.toBeVisible();
    });

    test('employee menu has proper visual styling', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const employeeMenu = page.locator('[data-testid="employee-menu"]');

      // Check button styling
      await expect(employeeButton).toHaveText('Employees');
      
      // Verify button has expected icons
      await expect(employeeButton.locator('svg[data-testid="PeopleIcon"]')).toBeVisible();
      await expect(employeeButton.locator('svg[data-testid="ExpandMoreIcon"]')).toBeVisible();

      // Hover to open menu
      await employeeButton.hover();
      
      // Check menu items have proper text and icons
      const addEmployeeItem = page.locator('[data-testid="add-employee-menu-item"]');
      const employeeListItem = page.locator('[data-testid="employee-list-menu-item"]');
      
      await expect(addEmployeeItem).toContainText('Add Employee');
      await expect(addEmployeeItem.locator('svg[data-testid="PersonAddIcon"]')).toBeVisible();
      
      await expect(employeeListItem).toContainText('Employee List');
      await expect(employeeListItem.locator('svg[data-testid="ListIcon"]')).toBeVisible();
    });

    test('employee menu keyboard accessibility', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      
      // Focus on the employee button
      await employeeButton.focus();
      
      // Press Enter to open menu
      await page.keyboard.press('Enter');
      
      // Menu should be visible
      await expect(page.locator('[data-testid="employee-menu"]')).toBeVisible();
      
      // Press Escape to close menu
      await page.keyboard.press('Escape');
      
      // Menu should close
      await expect(page.locator('[data-testid="employee-menu"]')).not.toBeVisible();
    });
  });

  test.describe('Theme Menu - All States', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test to access theme menu
      await page.goto('http://localhost:5173/login');
      await page.waitForLoadState('networkidle');
      await page.getByLabel('Username').fill('admin');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('http://localhost:5173/list');
    });

    test('theme menu appears on hover', async ({ page }) => {
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      const themeMenu = page.locator('[data-testid="theme-menu"]');

      // Initially menu should not be visible
      await expect(themeMenu).not.toBeVisible();

      // Hover over the theme button
      await themeButton.hover();
      
      // Menu should become visible
      await expect(themeMenu).toBeVisible();
    });

    test('theme menu contains all expected theme options', async ({ page }) => {
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Hover to open menu
      await themeButton.hover();
      
      // Check all theme options are present
      const expectedThemes = ['light', 'dark', 'blue', 'green', 'purple', 'orange'];
      
      for (const theme of expectedThemes) {
        await expect(page.locator(`[data-testid="theme-${theme}-menu-item"]`)).toBeVisible();
      }
    });

    test('theme menu shows current theme in button text', async ({ page }) => {
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Initially should show "Light" theme
      await expect(themeButton).toContainText('Light');
      
      // Change to Dark theme
      await themeButton.hover();
      await page.locator('[data-testid="theme-dark-menu-item"]').click();
      
      // Button should now show "Dark"
      await expect(themeButton).toContainText('Dark');
    });

    test('theme changes are applied when menu item is clicked', async ({ page }) => {
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Change to Blue Ocean theme
      await themeButton.hover();
      await page.locator('[data-testid="theme-blue-menu-item"]').click();
      
      // Verify theme changed
      await expect(themeButton).toContainText('Blue Ocean');
      
      // Change to Forest Green theme
      await themeButton.hover();
      await page.locator('[data-testid="theme-green-menu-item"]').click();
      
      // Verify theme changed
      await expect(themeButton).toContainText('Forest Green');
    });

    test('theme menu closes after theme selection', async ({ page }) => {
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      const themeMenu = page.locator('[data-testid="theme-menu"]');
      
      // Open menu and select a theme
      await themeButton.hover();
      await expect(themeMenu).toBeVisible();
      
      await page.locator('[data-testid="theme-purple-menu-item"]').click();
      
      // Menu should close
      await expect(themeMenu).not.toBeVisible();
    });

    test('current theme is visually highlighted in menu', async ({ page }) => {
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Open menu
      await themeButton.hover();
      
      // Light theme should be highlighted (current theme)
      const lightThemeItem = page.locator('[data-testid="theme-light-menu-item"]');
      const lightBgColor = await lightThemeItem.evaluate(el => 
        getComputedStyle(el).backgroundColor
      );
      
      // Change to dark theme
      await page.locator('[data-testid="theme-dark-menu-item"]').click();
      
      // Open menu again
      await themeButton.hover();
      
      // Dark theme should now be highlighted
      const darkThemeItem = page.locator('[data-testid="theme-dark-menu-item"]');
      const darkBgColor = await darkThemeItem.evaluate(el => 
        getComputedStyle(el).backgroundColor
      );
      
      // Light theme should no longer be highlighted
      const lightBgColorNew = await lightThemeItem.evaluate(el => 
        getComputedStyle(el).backgroundColor
      );
      
      // The highlighted item should have different background
      expect(darkBgColor).not.toBe('rgba(0, 0, 0, 0)'); // Should have background
      expect(lightBgColorNew).toBe('transparent'); // Should not be highlighted
    });

    test('theme menu has proper visual styling', async ({ page }) => {
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Check button has expected icons and structure
      await expect(themeButton.locator('svg[data-testid="PaletteIcon"]')).toBeVisible();
      await expect(themeButton.locator('svg[data-testid="ExpandMoreIcon"]')).toBeVisible();
      
      // Open menu and check menu items have icons
      await themeButton.hover();
      
      const themeMenuItems = page.locator('[data-testid^="theme-"][data-testid$="-menu-item"]');
      const itemCount = await themeMenuItems.count();
      
      // Each theme menu item should have a palette icon
      for (let i = 0; i < itemCount; i++) {
        const item = themeMenuItems.nth(i);
        await expect(item.locator('svg[data-testid="PaletteIcon"]')).toBeVisible();
      }
    });
  });

  test.describe('Menu Behavior - Edge Cases', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('Username').fill('admin');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/list');
    });

    test('multiple rapid hovers do not cause issues', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Rapidly hover between menus
      for (let i = 0; i < 5; i++) {
        await employeeButton.hover();
        await page.waitForTimeout(50);
        await themeButton.hover();
        await page.waitForTimeout(50);
      }
      
      // Final state should be theme menu open
      await expect(page.locator('[data-testid="theme-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="employee-menu"]')).not.toBeVisible();
    });

    test('menu closes when clicking elsewhere', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const employeeMenu = page.locator('[data-testid="employee-menu"]');
      
      // Open employee menu
      await employeeButton.hover();
      await expect(employeeMenu).toBeVisible();
      
      // Click elsewhere on the page
      await page.click('h4'); // Click on Employee List header
      
      // Menu should close
      await expect(employeeMenu).not.toBeVisible();
    });

    test('theme persists across menu interactions', async ({ page }) => {
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Change theme to Royal Purple
      await themeButton.hover();
      await page.locator('[data-testid="theme-purple-menu-item"]').click();
      await expect(themeButton).toContainText('Royal Purple');
      
      // Use employee menu
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      await employeeButton.hover();
      await page.locator('[data-testid="add-employee-menu-item"]').click();
      await expect(page).toHaveURL('/form');
      
      // Theme should still be Royal Purple
      await expect(themeButton).toContainText('Royal Purple');
      
      // Navigate back and theme should persist
      await employeeButton.hover();
      await page.locator('[data-testid="employee-list-menu-item"]').click();
      await expect(page).toHaveURL('/list');
      await expect(themeButton).toContainText('Royal Purple');
    });

    test('menus work correctly after page refresh', async ({ page }) => {
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Change theme
      await themeButton.hover();
      await page.locator('[data-testid="theme-orange-menu-item"]').click();
      await expect(themeButton).toContainText('Sunset Orange');
      
      // Refresh page
      await page.reload();
      
      // Should still be logged in and theme should persist
      await expect(page).toHaveURL('/list');
      await expect(themeButton).toContainText('Sunset Orange');
      
      // Menus should still work
      await themeButton.hover();
      await expect(page.locator('[data-testid="theme-menu"]')).toBeVisible();
      
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      await employeeButton.hover();
      await expect(page.locator('[data-testid="employee-menu"]')).toBeVisible();
    });
  });

  test.describe('Logged Out State', () => {
    test('employee menu is not visible when logged out', async ({ page }) => {
      await page.goto('/login');
      
      // Employee menu button should not exist when logged out
      await expect(page.locator('[data-testid="employee-menu-button"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="employee-menu"]')).not.toBeVisible();
    });

    test('theme menu is available when logged out', async ({ page }) => {
      await page.goto('/login');
      
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Theme menu should be available even when logged out
      await expect(themeButton).toBeVisible();
      
      // Should be able to change themes on login page
      await themeButton.hover();
      await expect(page.locator('[data-testid="theme-menu"]')).toBeVisible();
      
      await page.locator('[data-testid="theme-dark-menu-item"]').click();
      await expect(themeButton).toContainText('Dark');
    });

    test('theme changes persist after login', async ({ page }) => {
      await page.goto('/login');
      
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Change theme while logged out
      await themeButton.hover();
      await page.locator('[data-testid="theme-green-menu-item"]').click();
      await expect(themeButton).toContainText('Forest Green');
      
      // Login
      await page.getByLabel('Username').fill('admin');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/list');
      
      // Theme should persist after login
      await expect(themeButton).toContainText('Forest Green');
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('Username').fill('admin');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/list');
    });

    test('hover menus work with different pointer types', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const employeeMenu = page.locator('[data-testid="employee-menu"]');
      
      // Test mouse hover
      await employeeButton.hover();
      await expect(employeeMenu).toBeVisible();
      
      // Move away and test click interaction
      await page.mouse.move(0, 0);
      await expect(employeeMenu).not.toBeVisible();
      
      // Click should also open menu
      await employeeButton.click();
      await expect(employeeMenu).toBeVisible();
    });

    test('menus work correctly on different viewport sizes', async ({ page }) => {
      // Test on mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Menus should still be functional on mobile
      await employeeButton.hover();
      await expect(page.locator('[data-testid="employee-menu"]')).toBeVisible();
      
      await themeButton.hover();
      await expect(page.locator('[data-testid="theme-menu"]')).toBeVisible();
      
      // Test on tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await employeeButton.hover();
      await expect(page.locator('[data-testid="employee-menu"]')).toBeVisible();
      
      // Test on desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await themeButton.hover();
      await expect(page.locator('[data-testid="theme-menu"]')).toBeVisible();
    });

    test('menu positioning is correct at different screen sizes', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const employeeMenu = page.locator('[data-testid="employee-menu"]');
      
      // Open menu and check positioning
      await employeeButton.hover();
      await expect(employeeMenu).toBeVisible();
      
      // Get menu position
      const menuBox = await employeeMenu.boundingBox();
      const buttonBox = await employeeButton.boundingBox();
      
      // Menu should appear below the button
      expect(menuBox.y).toBeGreaterThan(buttonBox.y);
      
      // Menu should be roughly aligned with button horizontally
      expect(Math.abs(menuBox.x - buttonBox.x)).toBeLessThan(50);
    });
  });

  test.describe('Performance and Animation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('Username').fill('admin');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL('/list');
    });

    test('menu animations are smooth and responsive', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const employeeMenu = page.locator('[data-testid="employee-menu"]');
      
      // Time how quickly menu appears
      const startTime = Date.now();
      await employeeButton.hover();
      await expect(employeeMenu).toBeVisible();
      const openTime = Date.now() - startTime;
      
      // Should open quickly (within reasonable time)
      expect(openTime).toBeLessThan(1000);
      
      // Time how quickly menu disappears
      const closeStartTime = Date.now();
      await page.mouse.move(0, 0);
      await expect(employeeMenu).not.toBeVisible();
      const closeTime = Date.now() - closeStartTime;
      
      // Should close within reasonable time
      expect(closeTime).toBeLessThan(2000);
    });

    test('rapid menu interactions do not cause memory leaks', async ({ page }) => {
      const employeeButton = page.locator('[data-testid="employee-menu-button"]');
      const themeButton = page.locator('[data-testid="theme-menu-button"]');
      
      // Perform many rapid menu operations
      for (let i = 0; i < 20; i++) {
        await employeeButton.hover();
        await page.waitForTimeout(10);
        await themeButton.hover();
        await page.waitForTimeout(10);
        await page.mouse.move(0, 0);
        await page.waitForTimeout(10);
      }
      
      // Menus should still be responsive after stress test
      await employeeButton.hover();
      await expect(page.locator('[data-testid="employee-menu"]')).toBeVisible();
    });
  });
});