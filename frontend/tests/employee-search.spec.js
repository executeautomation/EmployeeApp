import { test, expect } from '@playwright/test';

test.describe('Employee Search', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/list');
    
    // Create some test employees for searching
    const employees = [
      { name: 'Alice Johnson', email: 'alice.johnson@company.com', position: 'Frontend Developer' },
      { name: 'Bob Smith', email: 'bob.smith@company.com', position: 'Backend Developer' },
      { name: 'Carol Wilson', email: 'carol.wilson@company.com', position: 'UI/UX Designer' },
      { name: 'David Brown', email: 'david.brown@company.com', position: 'Product Manager' }
    ];
    
    for (const employee of employees) {
      await page.getByRole('button', { name: '+ Add Employee' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByLabel('Name').fill(employee.name);
      await page.getByLabel('Email').fill(employee.email);
      await page.getByLabel('Position').fill(employee.position);
      await page.getByRole('button', { name: /add|submit/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    }
  });

  test('search by employee name', async ({ page }) => {
    // Look for search input field
    const searchInput = page.getByLabel('Search employees');
    
    // Search for specific employee by name
    await searchInput.fill('Alice');
    
    // Verify only matching employee is shown
    await expect(page.getByRole('table')).toContainText('Alice Johnson');
    await expect(page.getByRole('table')).not.toContainText('Bob Smith');
    await expect(page.getByRole('table')).not.toContainText('Carol Wilson');
    await expect(page.getByRole('table')).not.toContainText('David Brown');
  });

  test('search by employee email', async ({ page }) => {
    // Look for search input field
    const searchInput = page.getByLabel('Search employees');
    
    // Search for specific employee by email
    await searchInput.fill('bob.smith');
    
    // Verify only matching employee is shown
    await expect(page.getByRole('table')).toContainText('Bob Smith');
    await expect(page.getByRole('table')).not.toContainText('Alice Johnson');
    await expect(page.getByRole('table')).not.toContainText('Carol Wilson');
    await expect(page.getByRole('table')).not.toContainText('David Brown');
  });

  test('search by employee position', async ({ page }) => {
    // Look for search input field
    const searchInput = page.getByLabel('Search employees');
    
    // Search for employees by position
    await searchInput.fill('Developer');
    
    // Verify matching employees are shown
    await expect(page.getByRole('table')).toContainText('Alice Johnson');
    await expect(page.getByRole('table')).toContainText('Bob Smith');
    await expect(page.getByRole('table')).not.toContainText('Carol Wilson');
    await expect(page.getByRole('table')).not.toContainText('David Brown');
  });

  test('case insensitive search', async ({ page }) => {
    // Look for search input field
    const searchInput = page.getByLabel('Search employees');
    
    // Search with different case
    await searchInput.fill('ALICE');
    
    // Should still find the employee
    await expect(page.getByRole('table')).toContainText('Alice Johnson');
  });

  test('partial search matches', async ({ page }) => {
    // Look for search input field
    const searchInput = page.getByLabel('Search employees');
    
    // Search with partial name
    await searchInput.fill('Car');
    
    // Should find Carol
    await expect(page.getByRole('table')).toContainText('Carol Wilson');
    await expect(page.getByRole('table')).not.toContainText('Alice Johnson');
  });

  test('no results found', async ({ page }) => {
    // Look for search input field
    const searchInput = page.getByLabel('Search employees');
    
    // Search for non-existent employee
    await searchInput.fill('NonExistent');
    
    // Should show no results message
    await expect(page.getByText('No employees found.')).toBeVisible();
  });

  test('clear search shows all employees', async ({ page }) => {
    // Look for search input field
    const searchInput = page.getByLabel('Search employees');
    
    // First search for specific employee
    await searchInput.fill('Alice');
    await expect(page.getByRole('table')).toContainText('Alice Johnson');
    
    // Clear search
    await searchInput.fill('');
    
    // Should show all employees again
    await expect(page.getByRole('table')).toContainText('Alice Johnson');
    await expect(page.getByRole('table')).toContainText('Bob Smith');
    await expect(page.getByRole('table')).toContainText('Carol Wilson');
    await expect(page.getByRole('table')).toContainText('David Brown');
  });

  test('real-time search updates', async ({ page }) => {
    // Look for search input field
    const searchInput = page.getByLabel('Search employees');
    
    // Type characters one by one and verify updates
    await searchInput.type('A');
    await expect(page.getByRole('table')).toContainText('Alice Johnson');
    
    await searchInput.type('l');
    await expect(page.getByRole('table')).toContainText('Alice Johnson');
    
    await searchInput.type('i');
    await expect(page.getByRole('table')).toContainText('Alice Johnson');
    await expect(page.getByRole('table')).not.toContainText('Bob Smith');
  });
});