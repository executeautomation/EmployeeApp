import { test, expect } from '@playwright/test';

test.describe('Employee Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/list');
  });

  test('create employee via form page', async ({ page }) => {
    // Navigate to employee form
    await page.getByRole('button', { name: 'Add Employee' }).click();
    await expect(page).toHaveURL('/form');
    
    // Wait for form to load
    await expect(page.getByText('Add Employee')).toBeVisible();
    
    // Fill in employee details
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john.doe@example.com');
    await page.getByLabel('Position').fill('Software Engineer');
    
    // Submit form
    await page.getByRole('button', { name: /add|submit/i }).click();
    
    // Should redirect to employee list
    await expect(page).toHaveURL('/list');
    
    // Verify employee appears in the list
    await expect(page.getByRole('table')).toContainText('John Doe');
    await expect(page.getByRole('table')).toContainText('john.doe@example.com');
    await expect(page.getByRole('table')).toContainText('Software Engineer');
  });

  test('create employee via add dialog from list page', async ({ page }) => {
    // Click Add Employee button which opens a dialog
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    
    // Should open a dialog
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Add Employee')).toBeVisible();
    
    // Fill in employee details in the dialog
    await page.getByLabel('Name').fill('Jane Smith');
    await page.getByLabel('Email').fill('jane.smith@example.com');
    await page.getByLabel('Position').fill('Product Manager');
    
    // Submit form
    await page.getByRole('button', { name: /add|submit/i }).click();
    
    // Dialog should close and employee should appear in the list
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Verify new employee appears in the list
    await expect(page.getByRole('table')).toContainText('Jane Smith');
    await expect(page.getByRole('table')).toContainText('jane.smith@example.com');
    await expect(page.getByRole('table')).toContainText('Product Manager');
  });

  test('form validation - empty fields', async ({ page }) => {
    // Navigate to employee form or open dialog
    await page.getByRole('button', { name: 'Add Employee' }).click();
    
    // Check if we're on form page or in dialog
    const isDialog = await page.getByRole('dialog').isVisible().catch(() => false);
    const isFormPage = page.url().includes('/form');
    
    expect(isDialog || isFormPage).toBe(true);
    
    // Try to submit empty form
    await page.getByRole('button', { name: /add|submit/i }).click();
    
    // Should show validation errors or remain on form/dialog
    if (isFormPage) {
      await expect(page).toHaveURL('/form');
    } else {
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('form validation - invalid email', async ({ page }) => {
    // Navigate to employee form or open dialog
    await page.getByRole('button', { name: 'Add Employee' }).click();
    
    // Fill invalid email
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Position').fill('Tester');
    
    // Try to submit form
    await page.getByRole('button', { name: /add|submit/i }).click();
    
    // Should stay on form or show error (HTML5 validation should catch this)
    const isDialog = await page.getByRole('dialog').isVisible().catch(() => false);
    const isFormPage = page.url().includes('/form');
    
    expect(isDialog || isFormPage).toBe(true);
  });

  test('cancel employee creation', async ({ page }) => {
    // Navigate to employee form
    await page.getByRole('button', { name: 'Add Employee' }).click();
    
    const isDialog = await page.getByRole('dialog').isVisible().catch(() => false);
    
    if (isDialog) {
      // Fill some data
      await page.getByLabel('Name').fill('Test Cancel');
      
      // Close dialog
      await page.getByRole('button', { name: 'Cancel' }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    } else {
      // Fill some data on form page
      await page.getByLabel('Name').fill('Test Cancel');
      
      // Navigate back to list
      await page.getByRole('button', { name: 'Employee List' }).click();
      await expect(page).toHaveURL('/list');
    }
    
    // Employee should not be created
    await expect(page.getByRole('table')).not.toContainText('Test Cancel');
  });
});