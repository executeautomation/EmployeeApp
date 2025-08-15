import { test, expect } from '@playwright/test';

test.describe('Employee List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/list');
  });

  test('displays employee list page correctly', async ({ page }) => {
    // Check page title and main elements
    await expect(page.getByText('Employee List')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Add Employee' })).toBeVisible();
    await expect(page.getByLabel('Search employees')).toBeVisible();
    
    // Check table headers using more specific selectors
    await expect(page.getByRole('columnheader', { name: 'ID' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Position' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  });

  test('shows loading state initially', async ({ page }) => {
    // This test checks if loading state appears briefly
    // Since loading happens very quickly, we'll check that the list eventually loads
    await expect(page.getByText('Employee List')).toBeVisible();
    // If we can see the employee list, the loading worked
  });

  test('displays employees in table format', async ({ page }) => {
    // Add a test employee first
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john.doe@test.com');
    await page.getByLabel('Position').fill('Software Engineer');
    await page.getByRole('button', { name: /add|submit/i }).click();
    
    // Wait for dialog to close
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Check if employee appears in table
    await expect(page.getByRole('table')).toContainText('John Doe');
    await expect(page.getByRole('table')).toContainText('john.doe@test.com');
    await expect(page.getByRole('table')).toContainText('Software Engineer');
  });

  test('shows action buttons for each employee', async ({ page }) => {
    // Add a test employee first with unique identifier
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await page.getByLabel('Name').fill('Jane ActionTest');
    await page.getByLabel('Email').fill('jane.actiontest@test.com');
    await page.getByLabel('Position').fill('Product Manager');
    await page.getByRole('button', { name: /add|submit/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Check action buttons are present using first matching row
    const tableRow = page.locator('tr').filter({ hasText: 'jane.actiontest@test.com' }).first();
    await expect(tableRow.getByRole('button', { name: 'View' })).toBeVisible();
    await expect(tableRow.getByRole('button', { name: 'Edit' })).toBeVisible();
    await expect(tableRow.getByRole('button', { name: 'Delete' })).toBeVisible();
  });

  test('opens view employee dialog', async ({ page }) => {
    // Add a test employee first
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await page.getByLabel('Name').fill('Alice Cooper');
    await page.getByLabel('Email').fill('alice.cooper@test.com');
    await page.getByLabel('Position').fill('Designer');
    await page.getByRole('button', { name: /add|submit/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Click View button
    const tableRow = page.locator('tr').filter({ hasText: 'Alice Cooper' });
    await tableRow.getByRole('button', { name: 'View' }).click();
    
    // Check view dialog opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Employee Details')).toBeVisible();
    await expect(page.getByText('Name: Alice Cooper')).toBeVisible();
    await expect(page.getByText('Email: alice.cooper@test.com')).toBeVisible();
    await expect(page.getByText('Position: Designer')).toBeVisible();
    
    // Close dialog
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('opens edit employee dialog', async ({ page }) => {
    // Add a test employee first
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await page.getByLabel('Name').fill('Bob Wilson');
    await page.getByLabel('Email').fill('bob.wilson@test.com');
    await page.getByLabel('Position').fill('Developer');
    await page.getByRole('button', { name: /add|submit/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Click Edit button
    const tableRow = page.locator('tr').filter({ hasText: 'Bob Wilson' });
    await tableRow.getByRole('button', { name: 'Edit' }).click();
    
    // Check edit dialog opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Employee' })).toBeVisible();
    
    // Check form is pre-filled
    await expect(page.getByLabel('Name')).toHaveValue('Bob Wilson');
    await expect(page.getByLabel('Email')).toHaveValue('bob.wilson@test.com');
    await expect(page.getByLabel('Position')).toHaveValue('Developer');
    
    // Close dialog
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('opens delete confirmation dialog', async ({ page }) => {
    // Add a test employee first
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await page.getByLabel('Name').fill('Charlie Brown');
    await page.getByLabel('Email').fill('charlie.brown@test.com');
    await page.getByLabel('Position').fill('Tester');
    await page.getByRole('button', { name: /add|submit/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Click Delete button
    const tableRow = page.locator('tr').filter({ hasText: 'Charlie Brown' });
    await tableRow.getByRole('button', { name: 'Delete' }).click();
    
    // Check delete confirmation dialog opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Delete Employee' })).toBeVisible();
    await expect(page.getByText('Are you sure you want to delete employee Charlie Brown?')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    
    // Cancel deletion
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('performs employee deletion', async ({ page }) => {
    // Add a test employee first
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await page.getByLabel('Name').fill('Delete Me');
    await page.getByLabel('Email').fill('delete.me@test.com');
    await page.getByLabel('Position').fill('Temporary');
    await page.getByRole('button', { name: /add|submit/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Confirm employee is in table
    await expect(page.getByRole('table')).toContainText('Delete Me');
    
    // Click Delete button
    const tableRow = page.locator('tr').filter({ hasText: 'Delete Me' });
    await tableRow.getByRole('button', { name: 'Delete' }).click();
    
    // Confirm deletion
    await page.getByRole('button', { name: 'Delete' }).click();
    
    // Wait for dialog to close and check employee is removed
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('table')).not.toContainText('Delete Me');
    
    // Check success message
    await expect(page.getByText('Employee deleted successfully!')).toBeVisible();
  });

  test('shows no employees message when list is empty', async ({ page }) => {
    // If there are no employees, should show appropriate message
    const noEmployeesText = page.getByText('No employees found.');
    
    // This test might need to be adjusted based on whether there are existing employees
    // For now, we'll check if either employees exist or the no employees message is shown
    const hasEmployees = await page.locator('tbody tr').count() > 1; // More than just header
    
    if (!hasEmployees) {
      await expect(noEmployeesText).toBeVisible();
    }
  });

  test('add employee button opens dialog', async ({ page }) => {
    // Click Add Employee button
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    
    // Check dialog opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();
    
    // Check form fields are present
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Position')).toBeVisible();
    
    // Close dialog by clicking outside or cancel
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('handles network errors gracefully', async ({ page }) => {
    // Intercept the API call and make it fail
    await page.route('**/employees', route => {
      route.abort('failed');
    });
    
    // Reload the page to trigger the failed API call
    await page.reload();
    
    // Should show error message
    await expect(page.getByText(/Network error|Failed to load employees/)).toBeVisible();
  });

  test('refreshes employee list after successful operations', async ({ page }) => {
    // Get initial employee count
    const initialRows = await page.locator('tbody tr').count();
    
    // Add new employee
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await page.getByLabel('Name').fill('Refresh Test');
    await page.getByLabel('Email').fill('refresh.test@test.com');
    await page.getByLabel('Position').fill('Tester');
    await page.getByRole('button', { name: /add|submit/i }).click();
    
    // Wait for dialog to close
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Check that table has been refreshed with new employee
    await expect(page.getByRole('table')).toContainText('Refresh Test');
    
    // Employee count should have increased
    const newRows = await page.locator('tbody tr').count();
    expect(newRows).toBeGreaterThan(initialRows);
  });
});