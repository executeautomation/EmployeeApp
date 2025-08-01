# Database Integration Tests

This file contains comprehensive database integration tests for the Employee Manager application's SQLite database (`backend/db.sqlite`).

## Overview

The database tests directly interact with the SQLite database to verify:
- Database schema integrity
- CRUD operations (Create, Read, Update, Delete)
- Data persistence and recovery
- Performance under load
- Error handling and edge cases
- Data validation and security

## Test Categories

### 1. Database Schema Tests
- **Table Structure**: Verifies the `employees` table has correct columns and types
- **Primary Key**: Ensures ID column is properly configured as auto-increment primary key
- **Constraints**: Validates NOT NULL constraints on required fields
- **Initial State**: Confirms database starts in clean state

### 2. CRUD Operations Tests
- **Create**: Tests employee insertion with auto-generated IDs
- **Read**: Verifies data retrieval by ID and bulk operations
- **Update**: Tests employee updates and handles non-existent records
- **Delete**: Tests employee deletion and handles non-existent records

### 3. Data Persistence Tests
- **Connection Recovery**: Tests data persistence across database reconnections
- **Concurrent Operations**: Verifies data integrity during simultaneous operations
- **Transaction Integrity**: Ensures database maintains consistency

### 4. Data Validation Tests
- **Special Characters**: Tests handling of quotes, symbols, and special characters
- **Unicode Support**: Verifies international character support
- **Long Strings**: Tests handling of maximum length data
- **Edge Cases**: Empty strings, null handling, boundary conditions

### 5. Performance and Scalability Tests
- **Bulk Operations**: Tests insertion and retrieval of large datasets (100+ records)
- **Search Performance**: Measures query performance on filtered data
- **Memory Usage**: Monitors resource usage during operations

### 6. Error Handling Tests
- **Connection Errors**: Tests graceful handling of database connection issues
- **SQL Injection**: Verifies protection against malicious input
- **Invalid Operations**: Tests error handling for malformed queries

## Database Helper Class

The tests use a `DatabaseHelper` class that provides:
- Connection management
- Promise-based database operations
- Data cleanup utilities
- Performance monitoring
- Error handling

## Key Features

### Isolated Test Environment
- Each test starts with a clean database state
- Automatic cleanup after each test
- No interference between test cases

### Comprehensive Coverage
- Tests all CRUD operations
- Covers edge cases and error conditions
- Validates data integrity and persistence
- Tests performance under load

### Real Database Testing
- Uses actual SQLite database file (`backend/db.sqlite`)
- Tests real-world scenarios
- Validates production-like conditions

## Running Database Tests

```bash
# Run only database tests
npm run test:db

# Run database tests with browser (for debugging)
npm run test:db:headed

# Run all tests including database tests
npm test
```

## Test Data

The tests use realistic employee data:
- Names with special characters and unicode
- Email addresses with various formats
- Position titles with different lengths
- Edge cases for validation testing

## Security Testing

The database tests include security validations:
- SQL injection attempt prevention
- Parameter sanitization verification
- Input validation testing
- Error message analysis

## Performance Benchmarks

The tests measure and log performance metrics:
- Bulk insert operations (100 records)
- Data retrieval operations
- Search and filter operations
- Connection establishment time

## Integration with UI Tests

These database tests complement the existing UI tests by:
- Verifying backend data persistence
- Testing database operations directly
- Validating data integrity end-to-end
- Providing database-level debugging capabilities

## Troubleshooting

### Common Issues

1. **Database Locked**: Ensure backend server is not running during tests
2. **Permission Errors**: Check file permissions on `backend/db.sqlite`
3. **Connection Errors**: Verify database file exists and is accessible
4. **SQLite Version**: Ensure compatible SQLite3 version is installed

### Debug Mode

Run tests with `--headed` flag to see detailed error information and enable debugging mode.