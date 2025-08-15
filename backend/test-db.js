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
                    
                    // Close database connection
                    db.close((err) => {
                      if (err) {
                        console.error('Error closing database:', err);
                      } else {
                        console.log('\n✅ Database connection closed');
                        console.log('\n🏁 Database tests completed!');
                      }
                    });
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

// Run the tests
runDatabaseTests();
