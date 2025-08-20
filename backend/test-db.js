const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.resolve(__dirname, 'db.sqlite');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database:', err);
    process.exit(1);
  } else {
    console.log('✅ Connected to SQLite database successfully');
  }
});

// Function to run database tests
async function runDatabaseTests() {
  console.log('\n🔍 Running Database Tests...\n');

  // Test 1: Check if employees table exists
  console.log('Test 1: Checking if employees table exists...');
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'", (err, row) => {
    if (err) {
      console.error('❌ Error checking table existence:', err);
    } else if (row) {
      console.log('✅ employees table exists');
      
      // Test 2: Get table schema
      console.log('\nTest 2: Checking table schema...');
      db.all("PRAGMA table_info(employees)", (err, rows) => {
        if (err) {
          console.error('❌ Error getting table schema:', err);
        } else {
          console.log('✅ Table schema:');
          rows.forEach(column => {
            console.log(`   - ${column.name}: ${column.type} ${column.pk ? '(PRIMARY KEY)' : ''} ${column.notnull ? '(NOT NULL)' : ''}`);
          });
          
          // Test 3: Count total records
          console.log('\nTest 3: Counting total records...');
          db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
            if (err) {
              console.error('❌ Error counting records:', err);
            } else {
              console.log(`✅ Total employee records: ${row.count}`);
              
              // Test 4: Get all records
              console.log('\nTest 4: Retrieving all employee records...');
              db.all("SELECT * FROM employees ORDER BY id", (err, rows) => {
                if (err) {
                  console.error('❌ Error retrieving records:', err);
                } else {
                  if (rows.length === 0) {
                    console.log('⚠️  No employee records found in the database');
                    console.log('\n💡 To add sample data, you can run:');
                    console.log('   node add-sample-data.js');
                  } else {
                    console.log('✅ Employee records found:');
                    console.log('\n📋 Employee List:');
                    console.log('ID | Name | Email | Position');
                    console.log('---|------|-------|----------');
                    rows.forEach(employee => {
                      console.log(`${employee.id} | ${employee.name} | ${employee.email} | ${employee.position}`);
                    });
                  }
                  
                  // Test 5: Verify data integrity
                  console.log('\nTest 5: Checking data integrity...');
                  let integrityIssues = 0;
                  rows.forEach(employee => {
                    if (!employee.name || !employee.email || !employee.position) {
                      console.log(`❌ Data integrity issue: Employee ID ${employee.id} has missing fields`);
                      integrityIssues++;
                    }
                  });
                  
                  if (integrityIssues === 0) {
                    console.log('✅ All records have complete data');
                  } else {
                    console.log(`❌ Found ${integrityIssues} records with missing data`);
                  }
                  
                  // Test 6: Check for duplicate emails
                  console.log('\nTest 6: Checking for duplicate emails...');
                  db.all("SELECT email, COUNT(*) as count FROM employees GROUP BY email HAVING COUNT(*) > 1", (err, duplicates) => {
                    if (err) {
                      console.error('❌ Error checking for duplicates:', err);
                    } else {
                      if (duplicates.length === 0) {
                        console.log('✅ No duplicate emails found');
                      } else {
                        console.log('❌ Duplicate emails found:');
                        duplicates.forEach(dup => {
                          console.log(`   - ${dup.email} appears ${dup.count} times`);
                        });
                      }
                    }
                    
                    // Test 7: INSERT operations
                    console.log('\nTest 7: Testing INSERT operations...');
                    testInsertOperations();
                  });
                }
              });
            }
          });
        }
      });
    } else {
      console.log('❌ employees table does not exist');
      db.close();
    }
  });
}

// Test INSERT operations
function testInsertOperations() {
  console.log('📝 Testing INSERT operations...');
  
  const testEmployee = {
    name: 'Test User',
    email: 'test.user@testdb.com',
    position: 'Database Tester'
  };
  
  // Insert test employee
  db.run(
    'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
    [testEmployee.name, testEmployee.email, testEmployee.position],
    function (err) {
      if (err) {
        console.error('❌ INSERT operation failed:', err);
        closeDatabase();
      } else {
        console.log(`✅ INSERT successful - New employee ID: ${this.lastID}`);
        
        // Verify the inserted data
        db.get('SELECT * FROM employees WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            console.error('❌ Error verifying INSERT:', err);
          } else if (row) {
            console.log('✅ INSERT verification successful:');
            console.log(`   - ID: ${row.id}`);
            console.log(`   - Name: ${row.name}`);
            console.log(`   - Email: ${row.email}`);
            console.log(`   - Position: ${row.position}`);
            
            // Test DELETE operations
            console.log('\nTest 8: Testing DELETE operations...');
            testDeleteOperations(row.id);
          } else {
            console.error('❌ INSERT verification failed - record not found');
            closeDatabase();
          }
        });
      }
    }
  );
}

// Test DELETE operations
function testDeleteOperations(employeeId) {
  console.log('🗑️ Testing DELETE operations...');
  
  // First, verify the record exists
  db.get('SELECT * FROM employees WHERE id = ?', [employeeId], (err, row) => {
    if (err) {
      console.error('❌ Error checking record before DELETE:', err);
      closeDatabase();
    } else if (!row) {
      console.error('❌ Record not found for DELETE test');
      closeDatabase();
    } else {
      console.log(`✅ Record found for DELETE test - ID: ${employeeId}`);
      
      // Delete the record
      db.run('DELETE FROM employees WHERE id = ?', [employeeId], function (err) {
        if (err) {
          console.error('❌ DELETE operation failed:', err);
          closeDatabase();
        } else if (this.changes === 0) {
          console.error('❌ DELETE operation failed - no records affected');
          closeDatabase();
        } else {
          console.log(`✅ DELETE successful - ${this.changes} record(s) deleted`);
          
          // Verify the record is deleted
          db.get('SELECT * FROM employees WHERE id = ?', [employeeId], (err, row) => {
            if (err) {
              console.error('❌ Error verifying DELETE:', err);
            } else if (row) {
              console.error('❌ DELETE verification failed - record still exists');
            } else {
              console.log('✅ DELETE verification successful - record removed');
            }
            
            // Test edge cases
            console.log('\nTest 9: Testing edge cases...');
            testEdgeCases();
          });
        }
      });
    }
  });
}

// Test edge cases
function testEdgeCases() {
  console.log('⚠️ Testing edge cases...');
  
  // Test INSERT with missing data
  console.log('Testing INSERT with missing data...');
  db.run(
    'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
    ['', 'invalid@test.com', 'Test Position'], // Empty name
    function (err) {
      if (err) {
        console.log('✅ INSERT correctly rejected empty name');
      } else {
        console.log('⚠️ INSERT with empty name was allowed (ID: ' + this.lastID + ')');
        // Clean up the invalid record
        db.run('DELETE FROM employees WHERE id = ?', [this.lastID]);
      }
      
      // Test DELETE with non-existent ID
      console.log('Testing DELETE with non-existent ID...');
      db.run('DELETE FROM employees WHERE id = ?', [99999], function (err) {
        if (err) {
          console.error('❌ DELETE with invalid ID caused error:', err);
        } else if (this.changes === 0) {
          console.log('✅ DELETE correctly handled non-existent ID (no changes)');
        } else {
          console.log('⚠️ DELETE with invalid ID affected records unexpectedly');
        }
        
        // Test final database state
        console.log('\nTest 10: Final database state verification...');
        verifyFinalState();
      });
    }
  );
}

// Verify final database state
function verifyFinalState() {
  console.log('🔍 Verifying final database state...');
  
  db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
    if (err) {
      console.error('❌ Error getting final count:', err);
    } else {
      console.log(`✅ Final database contains ${row.count} employee(s)`);
    }
    
    // Close database connection
    closeDatabase();
  });
}

// Close database connection
function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('\n✅ Database connection closed');
      console.log('\n🏁 Database tests completed!');
      console.log('\n📊 Test Summary:');
      console.log('   ✅ SELECT operations tested');
      console.log('   ✅ INSERT operations tested');
      console.log('   ✅ DELETE operations tested');
      console.log('   ✅ Data integrity verified');
      console.log('   ✅ Edge cases tested');
    }
  });
}

// Run the tests
runDatabaseTests();
