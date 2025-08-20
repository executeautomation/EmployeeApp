# Database Testing Documentation

This directory contains comprehensive tests to verify INSERT, SELECT, and DELETE operations for the Employee Database.

## Overview

The testing suite validates all three core database operations:
- **INSERT**: Adding new employee records
- **SELECT**: Retrieving and querying employee data  
- **DELETE**: Removing employee records

## Test Files

### 1. `test-db.js`
Direct database testing script that:
- Tests table existence and schema
- Performs INSERT operations with test data
- Verifies SELECT operations and data retrieval
- Tests DELETE operations and cleanup
- Validates data integrity throughout
- Uses isolated test data (`@dbtest.com` emails) to avoid affecting production data

### 2. `test-api.js`  
API endpoint testing script that:
- Tests server connectivity
- Validates POST /employees (INSERT)
- Validates GET /employees (SELECT)
- Validates DELETE /employees/:id (DELETE)
- Tests authentication endpoint
- Ensures proper HTTP status codes and responses

### 3. `run-tests.sh`
Convenience script that runs both database and API tests with options for:
- Running database tests only
- Running API tests with automatic server management
- Running API tests with existing server

## Running Tests

### Option 1: Individual Tests
```bash
# Run direct database tests
node test-db.js

# Run API tests (requires server running)
node server.js &  # Start server in background
node test-api.js
```

### Option 2: NPM Scripts
```bash
# Run database tests
npm run test:db

# Run API tests (server must be running separately)
npm run test:api

# Run all tests with interactive options
npm run test:all
```

### Option 3: Interactive Test Runner
```bash
# Run the interactive test script
./run-tests.sh
```

## Test Data

Both test scripts use isolated test data to ensure they don't interfere with existing records:
- Database tests use emails ending in `@dbtest.com`
- API tests use emails ending in `@company.com` with `apitest` prefix
- All test data is automatically cleaned up after tests complete

## Expected Output

Successful tests will show:
- ✅ All operations completed successfully
- Verification that INSERT, SELECT, DELETE all work correctly
- Confirmation that test data was properly cleaned up
- Summary of operations performed

## Troubleshooting

If tests fail:
1. Ensure SQLite database exists and is accessible
2. For API tests, verify server is running on port 4000
3. Check that no other processes are using the database
4. Verify npm dependencies are installed (`npm install`)

## Database Operations Verified

### INSERT Operations
- Adding new employee records with all required fields
- Proper auto-increment ID assignment
- Data validation and error handling

### SELECT Operations  
- Retrieving all employees
- Counting records
- Filtering and querying specific data
- Schema validation
- Data integrity checks

### DELETE Operations
- Removing specific employee records by ID
- Proper cleanup and verification
- Handling non-existent records
- Maintaining referential integrity