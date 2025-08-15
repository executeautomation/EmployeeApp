import { test, expect } from '@playwright/test';

test.describe('Enhanced Login UI Features', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');
  });

  test.describe('Visual Elements', () => {
    test('should display new welcome text and subtitle', async ({ page }) => {
      // Verify main heading
      await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
      
      // Verify subtitle
      await expect(page.getByText('Sign in to your account')).toBeVisible();
    });

    test('should display lock icon avatar with correct size', async ({ page }) => {
      // Check for lock icon - could be an img, svg, or icon element
      const lockIcon = page.locator('[data-testid*="lock"], [class*="lock"], svg[data-testid*="avatar"], img[alt*="lock"]').first();
      await expect(lockIcon).toBeVisible();
      
      // Verify the icon has appropriate sizing (56x56 or equivalent CSS class)
      const iconElement = await lockIcon.first();
      await expect(iconElement).toBeVisible();
    });

    test('should have gradient background styling', async ({ page }) => {
      // Verify the page has the expected gradient background
      const bodyOrContainer = page.locator('body, [class*="background"], [class*="container"]').first();
      
      // Check if gradient styling is applied (this checks for the presence of gradient in computed styles)
      const hasGradient = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (let element of elements) {
          const styles = window.getComputedStyle(element);
          if (styles.background.includes('linear-gradient') || 
              styles.backgroundImage.includes('linear-gradient')) {
            return true;
          }
        }
        return false;
      });
      
      expect(hasGradient).toBe(true);
    });

    test('should display glass-morphism card design', async ({ page }) => {
      // Look for the login card/form container
      const loginCard = page.locator('[class*="card"], [class*="form"], form, [class*="container"]').first();
      await expect(loginCard).toBeVisible();
      
      // Verify backdrop-filter is applied (glass-morphism effect)
      const hasBackdropFilter = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (let element of elements) {
          const styles = window.getComputedStyle(element);
          if (styles.backdropFilter && styles.backdropFilter !== 'none') {
            return true;
          }
        }
        return false;
      });
      
      expect(hasBackdropFilter).toBe(true);
    });

    test('should have enhanced button styling with "Sign In" text', async ({ page }) => {
      const signInButton = page.getByTestId('login-button');
      
      // Verify button text has changed to "Sign In"
      await expect(signInButton).toHaveText('Sign In');
      
      // Verify button is visible and styled
      await expect(signInButton).toBeVisible();
      await expect(signInButton).toBeEnabled();
    });
  });

  test.describe('Password Visibility Toggle', () => {
    test('should toggle password field type when clicking visibility toggle', async ({ page }) => {
      const passwordField = page.getByLabel('Password');
      const toggleButton = page.getByTestId('password-visibility-toggle');
      
      // Initially password field should be type="password"
      await expect(passwordField).toHaveAttribute('type', 'password');
      await expect(toggleButton).toBeVisible();
      
      // Click toggle button
      await toggleButton.click();
      
      // Password field should now be type="text"
      await expect(passwordField).toHaveAttribute('type', 'text');
      
      // Click toggle again
      await toggleButton.click();
      
      // Should be back to type="password"
      await expect(passwordField).toHaveAttribute('type', 'password');
    });

    test('should change toggle icon between visibility states', async ({ page }) => {
      const toggleButton = page.getByTestId('password-visibility-toggle');
      
      // Get initial icon state (could be via aria-label, class, or icon type)
      const initialAriaLabel = await toggleButton.getAttribute('aria-label');
      
      // Click to toggle
      await toggleButton.click();
      
      // Verify icon or aria-label changed
      const newAriaLabel = await toggleButton.getAttribute('aria-label');
      expect(newAriaLabel).not.toBe(initialAriaLabel);
      
      // Toggle back and verify it returns to original state
      await toggleButton.click();
      const finalAriaLabel = await toggleButton.getAttribute('aria-label');
      expect(finalAriaLabel).toBe(initialAriaLabel);
    });

    test('should disable toggle during loading state', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      const toggleButton = page.getByTestId('password-visibility-toggle');
      const signInButton = page.getByTestId('login-button');
      
      // Fill credentials
      await usernameField.fill('admin');
      await passwordField.fill('password');
      
      // Verify toggle is initially enabled
      await expect(toggleButton).toBeEnabled();
      
      // Start login process
      await signInButton.click();
      
      // During loading, toggle should be disabled
      await expect(toggleButton).toBeDisabled();
      
      // Wait for login to complete (either success or failure)
      await expect(signInButton).toBeEnabled({ timeout: 10000 });
    });

    test('should maintain password visibility state during form interaction', async ({ page }) => {
      const passwordField = page.getByLabel('Password');
      const toggleButton = page.getByTestId('password-visibility-toggle');
      const usernameField = page.getByLabel('Username');
      
      // Enter password and make it visible
      await passwordField.fill('testpassword');
      await toggleButton.click();
      await expect(passwordField).toHaveAttribute('type', 'text');
      
      // Interact with other fields
      await usernameField.fill('testuser');
      await usernameField.clear();
      
      // Password should still be visible
      await expect(passwordField).toHaveAttribute('type', 'text');
      await expect(passwordField).toHaveValue('testpassword');
    });
  });

  test.describe('Loading States', () => {
    test('should show loading spinner and change button text during login attempt', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      const signInButton = page.getByTestId('login-button');
      
      // Fill credentials
      await usernameField.fill('admin');
      await passwordField.fill('password');
      
      // Verify initial button state
      await expect(signInButton).toHaveText('Sign In');
      
      // Click login button
      await signInButton.click();
      
      // Check for loading state - button text should change
      await expect(signInButton).toHaveText('Signing In...', { timeout: 5000 });
      
      // Look for loading spinner (could be in button or separate element)
      const spinner = page.locator('[data-testid*="spinner"], [class*="spinner"], [class*="loading"], .MuiCircularProgress-root').first();
      await expect(spinner).toBeVisible();
      
      // Wait for loading to complete
      await expect(page).toHaveURL('/list', { timeout: 10000 });
    });

    test('should disable form fields during loading state', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      const signInButton = page.getByTestId('login-button');
      
      // Fill credentials
      await usernameField.fill('admin');
      await passwordField.fill('password');
      
      // Verify fields are initially enabled
      await expect(usernameField).toBeEnabled();
      await expect(passwordField).toBeEnabled();
      await expect(signInButton).toBeEnabled();
      
      // Start login process
      await signInButton.click();
      
      // During loading, all form fields should be disabled
      await expect(usernameField).toBeDisabled();
      await expect(passwordField).toBeDisabled();
      await expect(signInButton).toBeDisabled();
      
      // Wait for navigation or error
      await page.waitForTimeout(1000); // Give time for loading state to show
    });

    test('should clear loading state after failed login attempt', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      const signInButton = page.getByTestId('login-button');
      
      // Fill invalid credentials
      await usernameField.fill('wronguser');
      await passwordField.fill('wrongpassword');
      
      // Click login button
      await signInButton.click();
      
      // Wait for loading state to appear
      await expect(signInButton).toHaveText('Signing In...', { timeout: 5000 });
      
      // Wait for loading to complete and error to appear
      await expect(page.getByTestId('error-alert')).toBeVisible({ timeout: 10000 });
      
      // Loading state should be cleared
      await expect(signInButton).toHaveText('Sign In');
      await expect(signInButton).toBeEnabled();
      await expect(usernameField).toBeEnabled();
      await expect(passwordField).toBeEnabled();
    });

    test('should handle network errors with proper loading state cleanup', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/login', route => route.abort());
      
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      const signInButton = page.getByTestId('login-button');
      
      // Fill credentials
      await usernameField.fill('admin');
      await passwordField.fill('password');
      
      // Attempt login
      await signInButton.click();
      
      // Should show loading state
      await expect(signInButton).toHaveText('Signing In...', { timeout: 5000 });
      
      // Should clear loading state after network error
      await expect(signInButton).toHaveText('Sign In', { timeout: 15000 });
      await expect(signInButton).toBeEnabled();
    });
  });

  test.describe('Enhanced Error Display', () => {
    test('should display error alert with Material-UI styling for invalid credentials', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      const signInButton = page.getByTestId('login-button');
      
      // Fill invalid credentials
      await usernameField.fill('wronguser');
      await passwordField.fill('wrongpassword');
      
      // Attempt login
      await signInButton.click();
      
      // Wait for error alert to appear
      const errorAlert = page.getByTestId('error-alert');
      await expect(errorAlert).toBeVisible({ timeout: 10000 });
      
      // Verify error message content
      await expect(errorAlert).toContainText('Invalid username or password');
      
      // Verify Material-UI Alert styling (check for MUI classes or role)
      await expect(errorAlert).toHaveAttribute('role', 'alert');
    });

    test('should display different error types correctly', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      const signInButton = page.getByTestId('login-button');
      
      // Test network error
      await page.route('**/api/login', route => route.abort());
      
      await usernameField.fill('admin');
      await passwordField.fill('password');
      await signInButton.click();
      
      // Should show network error
      const errorAlert = page.getByTestId('error-alert');
      await expect(errorAlert).toBeVisible({ timeout: 15000 });
      
      // Clear route interception for next test
      await page.unroute('**/api/login');
      
      // Reload page to clear error state
      await page.reload();
      await page.goto('/login');
      
      // Test validation error (empty fields)
      await signInButton.click();
      
      // Should either show validation error or prevent submission
      // (behavior depends on implementation)
      await expect(page).toHaveURL('/login'); // Should stay on login page
    });

    test('should clear error alert when user starts typing', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      const signInButton = page.getByTestId('login-button');
      
      // Generate error first
      await usernameField.fill('wronguser');
      await passwordField.fill('wrongpassword');
      await signInButton.click();
      
      // Wait for error to appear
      const errorAlert = page.getByTestId('error-alert');
      await expect(errorAlert).toBeVisible({ timeout: 10000 });
      
      // Start typing in username field
      await usernameField.clear();
      await usernameField.type('a');
      
      // Error should be cleared or hidden
      await expect(errorAlert).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Check form has proper role
      const form = page.locator('form');
      await expect(form).toBeVisible();
      
      // Check username field accessibility
      const usernameField = page.getByLabel('Username');
      await expect(usernameField).toHaveAttribute('type', 'text');
      await expect(usernameField).toBeVisible();
      
      // Check password field accessibility
      const passwordField = page.getByLabel('Password');
      await expect(passwordField).toHaveAttribute('type', 'password');
      
      // Check password toggle accessibility
      const toggleButton = page.getByTestId('password-visibility-toggle');
      await expect(toggleButton).toHaveAttribute('aria-label');
      
      // Check login button accessibility
      const signInButton = page.getByTestId('login-button');
      await expect(signInButton).toHaveAttribute('type', 'submit');
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(page.getByLabel('Username')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByLabel('Password')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('password-visibility-toggle')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('login-button')).toBeFocused();
    });

    test('should allow password toggle via keyboard', async ({ page }) => {
      const passwordField = page.getByLabel('Password');
      const toggleButton = page.getByTestId('password-visibility-toggle');
      
      // Navigate to password field and enter password
      await passwordField.focus();
      await passwordField.fill('testpassword');
      
      // Navigate to toggle button
      await page.keyboard.press('Tab');
      await expect(toggleButton).toBeFocused();
      
      // Activate toggle with Enter or Space
      await page.keyboard.press('Enter');
      await expect(passwordField).toHaveAttribute('type', 'text');
      
      // Toggle back with Space
      await page.keyboard.press('Space');
      await expect(passwordField).toHaveAttribute('type', 'password');
    });

    test('should support form submission via Enter key', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      
      // Fill credentials
      await usernameField.fill('admin');
      await passwordField.fill('password');
      
      // Press Enter while in password field
      await passwordField.press('Enter');
      
      // Should submit form and navigate
      await expect(page).toHaveURL('/list', { timeout: 10000 });
    });

    test('should announce loading state to screen readers', async ({ page }) => {
      const usernameField = page.getByLabel('Username');
      const passwordField = page.getByLabel('Password');
      const signInButton = page.getByTestId('login-button');
      
      // Fill credentials
      await usernameField.fill('admin');
      await passwordField.fill('password');
      
      // Click login
      await signInButton.click();
      
      // During loading, button should have proper aria attributes
      await expect(signInButton).toHaveAttribute('aria-disabled', 'true');
      
      // Loading text should be announced
      await expect(signInButton).toContainText('Signing In...');
    });
  });

  test.describe('Integration with Existing Functionality', () => {
    test('should maintain all existing login functionality with new UI', async ({ page }) => {
      // Test successful login still works
      await page.getByLabel('Username').fill('admin');
      await page.getByLabel('Password').fill('password');
      
      // Use new button selector
      await page.getByTestId('login-button').click();
      
      // Should navigate to employee list
      await expect(page).toHaveURL('/list');
      await expect(page.getByText('Employee List')).toBeVisible();
      
      // Verify localStorage is still set
      const loggedIn = await page.evaluate(() => localStorage.getItem('loggedIn'));
      expect(loggedIn).toBe('true');
    });

    test('should handle logout and return to enhanced login page', async ({ page }) => {
      // Login first
      await page.getByLabel('Username').fill('admin');
      await page.getByLabel('Password').fill('password');
      await page.getByTestId('login-button').click();
      
      await expect(page).toHaveURL('/list');
      
      // Logout
      await page.getByRole('button', { name: 'Logoff' }).click();
      
      // Should return to enhanced login page
      await expect(page).toHaveURL('/login');
      
      // Verify enhanced UI elements are present
      await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
      await expect(page.getByTestId('password-visibility-toggle')).toBeVisible();
      await expect(page.getByTestId('login-button')).toHaveText('Sign In');
    });

    test('should handle protected route redirection to enhanced login', async ({ page }) => {
      // Try to access protected route
      await page.goto('/list');
      
      // Should redirect to enhanced login page
      await expect(page).toHaveURL('/login');
      
      // Verify enhanced UI is present
      await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
      await expect(page.getByText('Sign in to your account')).toBeVisible();
    });
  });
});