import { test, expect } from '@playwright/test';

test.describe('Employee Edit', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/list');
    
    // Create a test employee to edit
    await page.click('text=Add Employee');
    await expect(page).toHaveURL('/form');
    await page.fill('input[name="name"]', 'Test Employee');
    await page.fill('input[name="email"]', 'test.employee@company.com');
    await page.fill('input[name="position"]', 'Test Position');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/list');
    
    // Verify employee was created
    await expect(page.locator('table')).toContainText('Test Employee');
  });

  test('edit employee via edit button', async ({ page }) => {
    // Find and click edit button for the test employee
    const editButton = page.locator('tr:has-text("Test Employee") button:has-text("Edit"), tr:has-text("Test Employee") [data-testid="edit-button"], tr:has-text("Test Employee") button[aria-label="Edit"]').first();
    await editButton.click();
    
    // Should open edit dialog or navigate to edit form
    // Check if it's a dialog or form page
    const isDialog = await page.locator('[role="dialog"]').isVisible().catch(() => false);
    const isEditPage = await page.url().includes('/form') || await page.locator('h4:has-text("Edit Employee")').isVisible().catch(() => false);
    
    expect(isDialog || isEditPage).toBe(true);
    
    // Update employee details
    const nameInput = page.locator('input[name="name"], input[value="Test Employee"]').first();
    const emailInput = page.locator('input[name="email"], input[value="test.employee@company.com"]').first();
    const positionInput = page.locator('input[name="position"], input[value="Test Position"]').first();
    
    await nameInput.fill('Updated Employee');
    await emailInput.fill('updated.employee@company.com');
    await positionInput.fill('Updated Position');
    
    // Submit the edit
    const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
    await submitButton.click();
    
    // Should return to list and show updated employee
    if (isDialog) {
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    } else {
      await expect(page).toHaveURL('/list');
    }
    
    // Verify updated employee appears in the list
    await expect(page.locator('table')).toContainText('Updated Employee');
    await expect(page.locator('table')).toContainText('updated.employee@company.com');
    await expect(page.locator('table')).toContainText('Updated Position');
    
    // Verify old data is not present
    await expect(page.locator('table')).not.toContainText('Test Employee');
    await expect(page.locator('table')).not.toContainText('test.employee@company.com');
    await expect(page.locator('table')).not.toContainText('Test Position');
  });

  test('cancel employee edit', async ({ page }) => {
    // Find and click edit button
    const editButton = page.locator('tr:has-text("Test Employee") button:has-text("Edit"), tr:has-text("Test Employee") [data-testid="edit-button"], tr:has-text("Test Employee") button[aria-label="Edit"]').first();
    await editButton.click();
    
    // Make some changes
    const nameInput = page.locator('input[name="name"], input[value="Test Employee"]').first();
    await nameInput.fill('Should Not Save');
    
    // Cancel the edit
    const cancelButton = page.locator('button:has-text("Cancel"), [data-testid="cancel-button"]').first();
    await cancelButton.click();
    
    // Should return to list without changes
    await expect(page.locator('table')).toContainText('Test Employee');
    await expect(page.locator('table')).not.toContainText('Should Not Save');
  });

  test('edit employee with invalid data', async ({ page }) => {
    // Find and click edit button
    const editButton = page.locator('tr:has-text("Test Employee") button:has-text("Edit"), tr:has-text("Test Employee") [data-testid="edit-button"], tr:has-text("Test Employee") button[aria-label="Edit"]').first();
    await editButton.click();
    
    // Clear required fields or enter invalid data
    const nameInput = page.locator('input[name="name"], input[value="Test Employee"]').first();
    const emailInput = page.locator('input[name="email"], input[value="test.employee@company.com"]').first();
    
    await nameInput.fill('');
    await emailInput.fill('invalid-email');
    
    // Try to submit
    const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
    await submitButton.click();
    
    // Should show validation errors or stay on edit form
    const isDialog = await page.locator('[role="dialog"]').isVisible().catch(() => false);
    const isEditPage = await page.url().includes('/form') || await page.locator('h4:has-text("Edit Employee")').isVisible().catch(() => false);
    
    expect(isDialog || isEditPage).toBe(true);
    
    // Original employee should still be in the list unchanged
    await page.locator('button:has-text("Cancel"), [data-testid="cancel-button"]').first().click();
    await expect(page.locator('table')).toContainText('Test Employee');
    await expect(page.locator('table')).toContainText('test.employee@company.com');
  });

  test('edit multiple fields', async ({ page }) => {
    // Find and click edit button
    const editButton = page.locator('tr:has-text("Test Employee") button:has-text("Edit"), tr:has-text("Test Employee") [data-testid="edit-button"], tr:has-text("Test Employee") button[aria-label="Edit"]').first();
    await editButton.click();
    
    // Update all fields
    const nameInput = page.locator('input[name="name"], input[value="Test Employee"]').first();
    const emailInput = page.locator('input[name="email"], input[value="test.employee@company.com"]').first();
    const positionInput = page.locator('input[name="position"], input[value="Test Position"]').first();
    
    await nameInput.fill('John Updated');
    await emailInput.fill('john.updated@newcompany.com');
    await positionInput.fill('Senior Developer');
    
    // Submit the edit
    const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
    await submitButton.click();
    
    // Verify all fields were updated
    await expect(page.locator('table')).toContainText('John Updated');
    await expect(page.locator('table')).toContainText('john.updated@newcompany.com');
    await expect(page.locator('table')).toContainText('Senior Developer');
  });

  test('edit employee and verify data persistence', async ({ page }) => {
    // Edit employee
    const editButton = page.locator('tr:has-text("Test Employee") button:has-text("Edit"), tr:has-text("Test Employee") [data-testid="edit-button"], tr:has-text("Test Employee") button[aria-label="Edit"]').first();
    await editButton.click();
    
    const nameInput = page.locator('input[name="name"], input[value="Test Employee"]').first();
    await nameInput.fill('Persistent Employee');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
    await submitButton.click();
    
    // Refresh the page
    await page.reload();
    
    // Data should still be there after refresh
    await expect(page.locator('table')).toContainText('Persistent Employee');
  });
});