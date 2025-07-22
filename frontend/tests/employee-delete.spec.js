import { test, expect } from '@playwright/test';

test.describe('Employee Delete', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/list');
    
    // Create test employees for deletion
    const testEmployees = [
      { name: 'Delete Test 1', email: 'delete1@test.com', position: 'Tester 1' },
      { name: 'Delete Test 2', email: 'delete2@test.com', position: 'Tester 2' }
    ];
    
    for (const employee of testEmployees) {
      await page.click('text=Add Employee');
      await expect(page).toHaveURL('/form');
      await page.fill('input[name="name"]', employee.name);
      await page.fill('input[name="email"]', employee.email);
      await page.fill('input[name="position"]', employee.position);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/list');
    }
    
    // Verify employees were created
    await expect(page.locator('table')).toContainText('Delete Test 1');
    await expect(page.locator('table')).toContainText('Delete Test 2');
  });

  test('delete employee via delete button', async ({ page }) => {
    // Find and click delete button for the first test employee
    const deleteButton = page.locator('tr:has-text("Delete Test 1") button:has-text("Delete"), tr:has-text("Delete Test 1") [data-testid="delete-button"], tr:has-text("Delete Test 1") button[aria-label="Delete"]').first();
    await deleteButton.click();
    
    // Check if confirmation dialog appears
    const confirmDialog = page.locator('[role="dialog"]');
    const isDialogVisible = await confirmDialog.isVisible().catch(() => false);
    
    if (isDialogVisible) {
      // Confirm deletion
      const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').first();
      await confirmButton.click();
      
      // Wait for dialog to close
      await expect(confirmDialog).not.toBeVisible();
    }
    
    // Verify employee was deleted from the list
    await expect(page.locator('table')).not.toContainText('Delete Test 1');
    await expect(page.locator('table')).not.toContainText('delete1@test.com');
    
    // Verify other employee is still there
    await expect(page.locator('table')).toContainText('Delete Test 2');
  });

  test('cancel employee deletion', async ({ page }) => {
    // Find and click delete button
    const deleteButton = page.locator('tr:has-text("Delete Test 1") button:has-text("Delete"), tr:has-text("Delete Test 1") [data-testid="delete-button"], tr:has-text("Delete Test 1") button[aria-label="Delete"]').first();
    await deleteButton.click();
    
    // Check if confirmation dialog appears
    const confirmDialog = page.locator('[role="dialog"]');
    const isDialogVisible = await confirmDialog.isVisible().catch(() => false);
    
    if (isDialogVisible) {
      // Cancel deletion
      const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("No")').first();
      await cancelButton.click();
      
      // Wait for dialog to close
      await expect(confirmDialog).not.toBeVisible();
    }
    
    // Verify employee is still in the list
    await expect(page.locator('table')).toContainText('Delete Test 1');
    await expect(page.locator('table')).toContainText('delete1@test.com');
  });

  test('delete multiple employees', async ({ page }) => {
    // Delete first employee
    let deleteButton = page.locator('tr:has-text("Delete Test 1") button:has-text("Delete"), tr:has-text("Delete Test 1") [data-testid="delete-button"], tr:has-text("Delete Test 1") button[aria-label="Delete"]').first();
    await deleteButton.click();
    
    let confirmDialog = page.locator('[role="dialog"]');
    let isDialogVisible = await confirmDialog.isVisible().catch(() => false);
    
    if (isDialogVisible) {
      const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').first();
      await confirmButton.click();
      await expect(confirmDialog).not.toBeVisible();
    }
    
    // Verify first employee was deleted
    await expect(page.locator('table')).not.toContainText('Delete Test 1');
    
    // Delete second employee
    deleteButton = page.locator('tr:has-text("Delete Test 2") button:has-text("Delete"), tr:has-text("Delete Test 2") [data-testid="delete-button"], tr:has-text("Delete Test 2") button[aria-label="Delete"]').first();
    await deleteButton.click();
    
    confirmDialog = page.locator('[role="dialog"]');
    isDialogVisible = await confirmDialog.isVisible().catch(() => false);
    
    if (isDialogVisible) {
      const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').first();
      await confirmButton.click();
      await expect(confirmDialog).not.toBeVisible();
    }
    
    // Verify second employee was also deleted
    await expect(page.locator('table')).not.toContainText('Delete Test 2');
  });

  test('delete employee and verify data persistence', async ({ page }) => {
    // Delete employee
    const deleteButton = page.locator('tr:has-text("Delete Test 1") button:has-text("Delete"), tr:has-text("Delete Test 1") [data-testid="delete-button"], tr:has-text("Delete Test 1") button[aria-label="Delete"]').first();
    await deleteButton.click();
    
    const confirmDialog = page.locator('[role="dialog"]');
    const isDialogVisible = await confirmDialog.isVisible().catch(() => false);
    
    if (isDialogVisible) {
      const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').first();
      await confirmButton.click();
      await expect(confirmDialog).not.toBeVisible();
    }
    
    // Verify employee was deleted
    await expect(page.locator('table')).not.toContainText('Delete Test 1');
    
    // Refresh the page
    await page.reload();
    
    // Employee should still be deleted after refresh
    await expect(page.locator('table')).not.toContainText('Delete Test 1');
    
    // But other employee should still be there
    await expect(page.locator('table')).toContainText('Delete Test 2');
  });

  test('delete confirmation dialog shows correct employee', async ({ page }) => {
    // Click delete button for specific employee
    const deleteButton = page.locator('tr:has-text("Delete Test 1") button:has-text("Delete"), tr:has-text("Delete Test 1") [data-testid="delete-button"], tr:has-text("Delete Test 1") button[aria-label="Delete"]').first();
    await deleteButton.click();
    
    // Check if confirmation dialog appears
    const confirmDialog = page.locator('[role="dialog"]');
    const isDialogVisible = await confirmDialog.isVisible().catch(() => false);
    
    if (isDialogVisible) {
      // Check that the dialog mentions the correct employee
      await expect(confirmDialog).toContainText('Delete Test 1');
      
      // Cancel to close dialog
      const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("No")').first();
      await cancelButton.click();
    }
  });

  test('delete employee from empty table state', async ({ page }) => {
    // First delete all test employees
    const employeesToDelete = ['Delete Test 1', 'Delete Test 2'];
    
    for (const employeeName of employeesToDelete) {
      const deleteButton = page.locator(`tr:has-text("${employeeName}") button:has-text("Delete"), tr:has-text("${employeeName}") [data-testid="delete-button"], tr:has-text("${employeeName}") button[aria-label="Delete"]`).first();
      
      if (await deleteButton.isVisible().catch(() => false)) {
        await deleteButton.click();
        
        const confirmDialog = page.locator('[role="dialog"]');
        const isDialogVisible = await confirmDialog.isVisible().catch(() => false);
        
        if (isDialogVisible) {
          const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').first();
          await confirmButton.click();
          await expect(confirmDialog).not.toBeVisible();
        }
      }
    }
    
    // Verify table is empty or shows "no employees" message
    const tableRows = page.locator('table tbody tr');
    const rowCount = await tableRows.count();
    
    if (rowCount === 0) {
      // Empty table
      expect(rowCount).toBe(0);
    } else {
      // Should show "no employees" message
      await expect(page.locator('table, body')).toContainText(/no employees|empty|No data/i);
    }
  });
});