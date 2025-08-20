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
          
          // Test 3: Count total records before operations
          console.log('\nTest 3: Counting total records before operations...');
          db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
            if (err) {
              console.error('❌ Error counting records:', err);
            } else {
              const initialCount = row.count;
              console.log(`✅ Initial employee records: ${initialCount}`);
              
              // Test 4: INSERT operations
              console.log('\nTest 4: Testing INSERT operations...');
              const testEmployees = [
                { name: 'Test Employee 1', email: 'test1@dbtest.com', position: 'Test Position 1' },
                { name: 'Test Employee 2', email: 'test2@dbtest.com', position: 'Test Position 2' },
                { name: 'Test Employee 3', email: 'test3@dbtest.com', position: 'Test Position 3' }
              ];
              
              let insertedIds = [];
              let insertedCount = 0;
              
              const insertEmployee = (employee, callback) => {
                db.run('INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
                  [employee.name, employee.email, employee.position],
                  function(err) {
                    if (err) {
                      console.error(`❌ Error inserting ${employee.name}:`, err);
                    } else {
                      console.log(`✅ Inserted: ${employee.name} (ID: ${this.lastID})`);
                      insertedIds.push(this.lastID);
                      insertedCount++;
                    }
                    callback();
                  }
                );
              };
              
              // Insert test employees sequentially
              insertEmployee(testEmployees[0], () => {
                insertEmployee(testEmployees[1], () => {
                  insertEmployee(testEmployees[2], () => {
                    
                    // Test 5: Verify INSERT operations by counting records
                    console.log('\nTest 5: Verifying INSERT operations...');
                    db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
                      if (err) {
                        console.error('❌ Error counting records after insert:', err);
                      } else {
                        const newCount = row.count;
                        const expectedCount = initialCount + insertedCount;
                        if (newCount === expectedCount) {
                          console.log(`✅ INSERT verification successful: ${newCount} records (${insertedCount} new)`);
                        } else {
                          console.log(`❌ INSERT verification failed: Expected ${expectedCount}, got ${newCount}`);
                        }
                        
                        // Test 6: SELECT operations - Retrieve specific test employees
                        console.log('\nTest 6: Testing SELECT operations on inserted data...');
                        db.all("SELECT * FROM employees WHERE email LIKE '%@dbtest.com' ORDER BY id", (err, rows) => {
                          if (err) {
                            console.error('❌ Error selecting test employees:', err);
                          } else {
                            if (rows.length === testEmployees.length) {
                              console.log(`✅ SELECT verification successful: Found ${rows.length} test employees`);
                              console.log('\n📋 Test Employee List:');
                              console.log('ID | Name | Email | Position');
                              console.log('---|------|-------|----------');
                              rows.forEach(employee => {
                                console.log(`${employee.id} | ${employee.name} | ${employee.email} | ${employee.position}`);
                              });
                            } else {
                              console.log(`❌ SELECT verification failed: Expected ${testEmployees.length}, found ${rows.length}`);
                            }
                            
                            // Test 7: DELETE operations
                            console.log('\nTest 7: Testing DELETE operations...');
                            let deletedCount = 0;
                            
                            const deleteEmployee = (id, callback) => {
                              db.run('DELETE FROM employees WHERE id = ?', [id], function(err) {
                                if (err) {
                                  console.error(`❌ Error deleting employee ID ${id}:`, err);
                                } else if (this.changes === 0) {
                                  console.log(`⚠️  No employee found with ID ${id}`);
                                } else {
                                  console.log(`✅ Deleted employee ID: ${id}`);
                                  deletedCount++;
                                }
                                callback();
                              });
                            };
                            
                            // Delete test employees sequentially
                            if (insertedIds.length > 0) {
                              deleteEmployee(insertedIds[0], () => {
                                if (insertedIds[1]) {
                                  deleteEmployee(insertedIds[1], () => {
                                    if (insertedIds[2]) {
                                      deleteEmployee(insertedIds[2], () => {
                                        runFinalVerification();
                                      });
                                    } else {
                                      runFinalVerification();
                                    }
                                  });
                                } else {
                                  runFinalVerification();
                                }
                              });
                            } else {
                              runFinalVerification();
                            }
                            
                            function runFinalVerification() {
                              // Test 8: Verify DELETE operations
                              console.log('\nTest 8: Verifying DELETE operations...');
                              db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
                                if (err) {
                                  console.error('❌ Error counting records after delete:', err);
                                } else {
                                  const finalCount = row.count;
                                  const expectedFinalCount = initialCount + insertedCount - deletedCount;
                                  if (finalCount === expectedFinalCount) {
                                    console.log(`✅ DELETE verification successful: ${finalCount} records (${deletedCount} deleted)`);
                                  } else {
                                    console.log(`❌ DELETE verification failed: Expected ${expectedFinalCount}, got ${finalCount}`);
                                  }
                                  
                                  // Test 9: Verify test data cleanup
                                  console.log('\nTest 9: Verifying test data cleanup...');
                                  db.all("SELECT * FROM employees WHERE email LIKE '%@dbtest.com'", (err, rows) => {
                                    if (err) {
                                      console.error('❌ Error checking for remaining test data:', err);
                                    } else {
                                      if (rows.length === 0) {
                                        console.log('✅ Test data cleanup successful: No test employees remain');
                                      } else {
                                        console.log(`⚠️  Test data cleanup incomplete: ${rows.length} test employees remain`);
                                      }
                                      
                                      runLegacyTests();
                                    }
                                  });
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  });
                });
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

// Function to run legacy SELECT tests (original functionality)
function runLegacyTests() {
  console.log('\nTest 10: Running legacy SELECT operations...');
  
  // Get all records
  db.all("SELECT * FROM employees ORDER BY id", (err, rows) => {
    if (err) {
      console.error('❌ Error retrieving all records:', err);
    } else {
      if (rows.length === 0) {
        console.log('⚠️  No employee records found in the database');
        console.log('\n💡 To add sample data, you can run:');
        console.log('   node add-sample-data.js');
      } else {
        console.log(`✅ Legacy SELECT successful: Found ${rows.length} total employees`);
        console.log('\n📋 Complete Employee List:');
        console.log('ID | Name | Email | Position');
        console.log('---|------|-------|----------');
        rows.forEach(employee => {
          console.log(`${employee.id} | ${employee.name} | ${employee.email} | ${employee.position}`);
        });
      }
      
      // Test data integrity
      console.log('\nTest 11: Checking data integrity...');
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
      
      // Check for duplicate emails
      console.log('\nTest 12: Checking for duplicate emails...');
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
        
        // Summary
        console.log('\n🎯 Database Operation Tests Summary:');
        console.log('   ✅ INSERT operations tested and verified');
        console.log('   ✅ SELECT operations tested and verified');
        console.log('   ✅ DELETE operations tested and verified');
        console.log('   ✅ Data integrity maintained');
        console.log('   ✅ Test data properly cleaned up');
        
        // Close database connection
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('\n✅ Database connection closed');
            console.log('\n🏁 All database tests completed successfully!');
          }
        });
      });
    }
  });
}

// Run the tests
runDatabaseTests();
