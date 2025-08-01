# UI and Database Tests for Employee Manager

This directory contains comprehensive Playwright tests for the Employee Manager application, covering both UI functionality and database operations.

## Tests Included

### UI Tests
- **Login Tests** (`login.spec.js`) - Tests for user authentication functionality
- **Employee Creation Tests** (`employee-creation.spec.js`) - Tests for adding new employees
- **Employee Search Tests** (`employee-search.spec.js`) - Tests for searching and filtering employees
- **Theme Toggle Tests** (`theme-toggle.spec.js`) - Tests for dark/light mode switching
- **Employee Edit Tests** (`employee-edit.spec.js`) - Tests for editing employee information
- **Employee Delete Tests** (`employee-delete.spec.js`) - Tests for deleting employees

### Database Integration Tests
- **Database Tests** (`database.spec.js`) - Direct SQLite database testing with comprehensive coverage
  - Database schema validation
  - CRUD operations testing
  - Data persistence verification
  - Performance and scalability testing
  - Error handling and security testing
  - See `DATABASE_TESTS.md` for detailed documentation

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

### For UI Tests (requires running servers):

#### Start the application servers first:
```bash
# Start backend server (in backend directory)
cd ../backend && node server.js

# Start frontend server (in another terminal, in frontend directory)
npm run dev
```

#### Run all UI tests:
```bash
npm test
```

#### Run specific UI test file:
```bash
npx playwright test tests/login.spec.js
```

### For Database Tests (direct database access):

#### Run database tests only:
```bash
npm run test:db
```

#### Run database tests in headed mode:
```bash
npm run test:db:headed
```

**Note:** Database tests run independently and don't require the application servers to be running.

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

- `playwright.config.js` - Main Playwright configuration with webServer setup for UI tests
- `playwright-simple.config.js` - Simple configuration for manual server setup (UI tests)
- `playwright-db.config.js` - Database-specific configuration for database integration tests

## Test Coverage

The tests provide comprehensive coverage of both UI and database functionality:

### UI Test Coverage
✅ Login with valid/invalid credentials  
✅ Employee creation via form and dialog  
✅ Employee search by name, email, and position  
✅ Dark mode and light mode theme switching  
✅ Employee editing functionality  
✅ Employee deletion with confirmation

### Database Test Coverage
✅ Database schema integrity and structure  
✅ CRUD operations (Create, Read, Update, Delete)  
✅ Data persistence and recovery  
✅ Performance testing with bulk operations  
✅ Error handling and connection management  
✅ Security testing (SQL injection prevention)  
✅ Unicode and special character support  
✅ Concurrent operation handling  

## Notes

### UI Tests
- Tests use Material-UI specific selectors and roles for better reliability
- Each test suite has proper setup and teardown
- Tests include both positive and negative scenarios
- Real-time search functionality is tested
- Theme persistence across navigation is verified

### Database Tests
- Tests interact directly with the SQLite database file (`backend/db.sqlite`)
- Each test starts with a clean database state
- Tests cover performance benchmarks and logging
- Security testing includes SQL injection prevention
- Unicode and special character handling is verified
- Tests run independently without requiring application servers