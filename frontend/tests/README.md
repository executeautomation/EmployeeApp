# UI Tests for Employee Manager

This directory contains Playwright UI tests for the Employee Manager application.

## Tests Included

- **Login Tests** (`login.spec.js`) - Tests for user authentication functionality
- **Employee Creation Tests** (`employee-creation.spec.js`) - Tests for adding new employees
- **Employee Search Tests** (`employee-search.spec.js`) - Tests for searching and filtering employees
- **Theme Toggle Tests** (`theme-toggle.spec.js`) - Tests for dark/light mode switching
- **Employee Edit Tests** (`employee-edit.spec.js`) - Tests for editing employee information
- **Employee Delete Tests** (`employee-delete.spec.js`) - Tests for deleting employees

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Start the application servers first:
```bash
# Start backend server (in backend directory)
cd ../backend && node server.js

# Start frontend server (in another terminal, in frontend directory)
npm run dev
```

### Run all tests:
```bash
npm test
```

### Run specific test file:
```bash
npx playwright test tests/login.spec.js
```

### Run tests in headed mode (with browser window):
```bash
npm run test:headed
```

### Run tests with UI mode (interactive):
```bash
npm run test:ui
```

### View test report:
```bash
npm run test:report
```

## Configuration

- `playwright.config.js` - Main Playwright configuration with webServer setup
- `playwright-simple.config.js` - Simple configuration for manual server setup

## Test Coverage

The tests cover all the main functionality requirements:

✅ Login with valid/invalid credentials  
✅ Employee creation via form and dialog  
✅ Employee search by name, email, and position  
✅ Dark mode and light mode theme switching  
✅ Employee editing functionality  
✅ Employee deletion with confirmation  

## Notes

- Tests use Material-UI specific selectors and roles for better reliability
- Each test suite has proper setup and teardown
- Tests include both positive and negative scenarios
- Real-time search functionality is tested
- Theme persistence across navigation is verified