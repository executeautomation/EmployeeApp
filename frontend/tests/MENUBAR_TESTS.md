# MenuBar Hover Menu Tests

This document describes the comprehensive test suite for the MenuBar hover functionality.

## Test Files

### menubar-hover-menus.spec.js
The main comprehensive test suite covering all aspects of the MenuBar hover functionality:

- **Employee Menu Tests** (Logged In State)
  - Hover functionality
  - Menu open/close behavior  
  - Navigation functionality (Add Employee, Employee List)
  - Visual styling validation
  - Keyboard accessibility

- **Theme Menu Tests** (All States)
  - Hover functionality
  - All theme options validation
  - Theme switching functionality
  - Current theme highlighting
  - Visual styling validation

- **Edge Cases & Behavior**
  - Multiple rapid hovers
  - Menu closing when clicking elsewhere
  - Theme persistence across interactions
  - Page refresh behavior

- **State-Based Tests**
  - Logged in vs logged out visibility
  - Theme availability in both states
  - Theme persistence after login

- **Cross-Browser Compatibility**
  - Different pointer types
  - Multiple viewport sizes
  - Menu positioning validation

- **Performance & Animation**
  - Menu response times
  - Animation smoothness
  - Memory leak prevention

### menubar-hover-basic.spec.js
Basic validation tests for core functionality - useful for quick verification.

### menubar-hover-simple.spec.js
Minimal tests for infrastructure validation.

## Running the Tests

### Run All MenuBar Tests
```bash
# Using the dedicated MenuBar configuration
npx playwright test --config=playwright-menubar.config.js

# Or using the main configuration with pattern matching
npx playwright test menubar-*.spec.js
```

### Run Specific Test Suites
```bash
# Run comprehensive tests
npx playwright test menubar-hover-menus.spec.js

# Run basic tests only
npx playwright test menubar-hover-basic.spec.js

# Run simple validation tests
npx playwright test menubar-hover-simple.spec.js
```

### Run Specific Test Categories
```bash
# Employee menu tests only
npx playwright test menubar-hover-menus.spec.js --grep "Employee Menu"

# Theme menu tests only
npx playwright test menubar-hover-menus.spec.js --grep "Theme Menu"

# Edge case tests only
npx playwright test menubar-hover-menus.spec.js --grep "Edge Cases"

# Cross-browser tests only
npx playwright test menubar-hover-menus.spec.js --grep "Cross-Browser"
```

### Run Individual Tests
```bash
# Test employee menu hover
npx playwright test --grep "employee menu appears on hover"

# Test theme switching
npx playwright test --grep "theme changes are applied"

# Test navigation functionality
npx playwright test --grep "add employee menu item navigates"
```

## Test Data Attributes

The tests rely on these data-testid attributes in the MenuBar component:

### Employee Menu
- `employee-menu-button` - Main Employees button
- `employee-menu` - Dropdown menu container  
- `add-employee-menu-item` - Add Employee menu item
- `employee-list-menu-item` - Employee List menu item

### Theme Menu
- `theme-menu-button` - Main Theme button
- `theme-menu` - Theme dropdown menu container
- `theme-{themeKey}-menu-item` - Individual theme items:
  - `theme-light-menu-item`
  - `theme-dark-menu-item`
  - `theme-blue-menu-item`
  - `theme-green-menu-item`
  - `theme-purple-menu-item`
  - `theme-orange-menu-item`

## Prerequisites

1. **Frontend Server**: Must be running on http://localhost:5173
2. **Backend Server**: Must be running on http://localhost:4000
3. **Valid Test User**: admin/password credentials should work
4. **Theme System**: All 6 themes (light, dark, blue, green, purple, orange) should be available

## Test Coverage

The test suite provides comprehensive coverage of:

✅ **Hover Functionality**
- Menu appearance on hover
- Menu disappearance when mouse leaves
- Menu persistence when hovering over items

✅ **Navigation**  
- Add Employee navigation to /form
- Employee List navigation to /list
- Menu closing after navigation

✅ **Theme System**
- All 6 theme options available
- Theme switching functionality
- Theme persistence across pages
- Current theme highlighting

✅ **State Management**
- Logged in vs logged out behavior
- Menu visibility based on authentication
- Theme availability in all states

✅ **User Experience**
- Visual feedback and styling
- Keyboard accessibility
- Cross-browser compatibility
- Performance and responsiveness

✅ **Edge Cases**
- Rapid menu interactions
- Page refresh behavior
- Multiple simultaneous hovers
- Error recovery

## Debugging Tests

### View Test Report
```bash
npx playwright show-report
```

### Run Tests in Headed Mode
```bash
npx playwright test menubar-hover-menus.spec.js --headed
```

### Debug Specific Test
```bash
npx playwright test --debug --grep "employee menu appears on hover"
```

### Generate Trace Files
```bash
npx playwright test menubar-hover-menus.spec.js --trace on
```

## Configuration

The tests use the `playwright-menubar.config.js` configuration which:
- Sets appropriate timeouts for hover interactions
- Configures servers to start automatically
- Enables tracing and screenshots on failure
- Uses Chrome browser for consistency
- Sets slower action timeout for reliable hover testing

## Maintenance

When updating the MenuBar component:

1. Ensure all data-testid attributes remain consistent
2. Run the basic tests first to verify core functionality
3. Run the comprehensive suite to validate all scenarios
4. Update test data if new themes or menu items are added
5. Verify tests pass in both logged in and logged out states