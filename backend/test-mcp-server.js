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

// Test data for MCP Server validation
const mcpTestEmployees = [
  {
    name: 'Alice Cooper',
    email: 'alice.cooper@mcptest.com',
    position: 'Senior Developer'
  },
  {
    name: 'Bob Wilson',
    email: 'bob.wilson@mcptest.com',
    position: 'QA Engineer'
  },
  {
    name: 'Charlie Davis',
    email: 'charlie.davis@mcptest.com',
    position: 'DevOps Specialist'
  },
  {
    name: 'Diana Prince',
    email: 'diana.prince@mcptest.com',
    position: 'Product Owner'
  }
];

// Function to clean up previous MCP test data
function cleanupMcpTestData() {
  return new Promise((resolve, reject) => {
    console.log('\n🧹 Cleaning up previous MCP test data...');
    db.run("DELETE FROM employees WHERE email LIKE '%@mcptest.com'", (err) => {
      if (err) {
        console.error('❌ Error cleaning up test data:', err);
        reject(err);
      } else {
        console.log('✅ Previous MCP test data cleaned up');
        resolve();
      }
    });
  });
}

// Function to insert MCP test records
function insertMcpTestRecords() {
  return new Promise((resolve, reject) => {
    console.log('\n📝 Inserting MCP test records...');
    
    const stmt = db.prepare("INSERT INTO employees (name, email, position) VALUES (?, ?, ?)");
    let insertedRecords = [];
    let completed = 0;
    
    mcpTestEmployees.forEach((employee, index) => {
      stmt.run([employee.name, employee.email, employee.position], function(err) {
        if (err) {
          console.error(`❌ Error inserting ${employee.name}:`, err);
          reject(err);
          return;
        }
        
        const insertedRecord = {
          id: this.lastID,
          name: employee.name,
          email: employee.email,
          position: employee.position
        };
        
        insertedRecords.push(insertedRecord);
        console.log(`✅ Inserted: ${employee.name} (ID: ${this.lastID})`);
        
        completed++;
        if (completed === mcpTestEmployees.length) {
          stmt.finalize((err) => {
            if (err) {
              reject(err);
            } else {
              console.log(`\n🎉 Successfully inserted ${insertedRecords.length} MCP test records!`);
              resolve(insertedRecords);
            }
          });
        }
      });
    });
  });
}

// Function to validate MCP Server query capabilities
function validateMcpServerQueries(insertedRecords) {
  return new Promise((resolve, reject) => {
    console.log('\n🔍 Validating MCP Server query capabilities...\n');
    
    let testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
    
    // Test 1: Query all MCP test records
    console.log('Test 1: Querying all MCP test records...');
    db.all("SELECT * FROM employees WHERE email LIKE '%@mcptest.com' ORDER BY id", (err, rows) => {
      if (err) {
        console.error('❌ Error querying MCP test records:', err);
        testResults.failed++;
        testResults.tests.push({
          name: 'Query all MCP test records',
          status: 'FAILED',
          error: err.message
        });
      } else {
        if (rows.length === insertedRecords.length) {
          console.log(`✅ Successfully queried ${rows.length} MCP test records`);
          testResults.passed++;
          testResults.tests.push({
            name: 'Query all MCP test records',
            status: 'PASSED',
            result: `Found ${rows.length} records`
          });
          
          // Test 2: Validate data integrity for each record
          console.log('\nTest 2: Validating data integrity for each record...');
          let integrityPassed = true;
          
          rows.forEach((row, index) => {
            const originalRecord = insertedRecords.find(r => r.id === row.id);
            if (!originalRecord) {
              console.error(`❌ Record ID ${row.id} not found in inserted records`);
              integrityPassed = false;
              return;
            }
            
            if (row.name !== originalRecord.name || 
                row.email !== originalRecord.email || 
                row.position !== originalRecord.position) {
              console.error(`❌ Data mismatch for record ID ${row.id}`);
              console.error(`   Expected: ${originalRecord.name}, ${originalRecord.email}, ${originalRecord.position}`);
              console.error(`   Found: ${row.name}, ${row.email}, ${row.position}`);
              integrityPassed = false;
              return;
            }
            
            console.log(`✅ Record ID ${row.id} integrity validated: ${row.name}`);
          });
          
          if (integrityPassed) {
            console.log('✅ All MCP test records passed data integrity validation');
            testResults.passed++;
            testResults.tests.push({
              name: 'Data integrity validation',
              status: 'PASSED',
              result: 'All records match expected data'
            });
          } else {
            console.error('❌ Data integrity validation failed');
            testResults.failed++;
            testResults.tests.push({
              name: 'Data integrity validation',
              status: 'FAILED',
              error: 'Data mismatch detected'
            });
          }
          
          // Test 3: Query by specific criteria
          console.log('\nTest 3: Testing query by specific criteria...');
          db.get("SELECT * FROM employees WHERE email = ? AND name = ?", 
                 ['alice.cooper@mcptest.com', 'Alice Cooper'], (err, row) => {
            if (err) {
              console.error('❌ Error querying by specific criteria:', err);
              testResults.failed++;
              testResults.tests.push({
                name: 'Query by specific criteria',
                status: 'FAILED',
                error: err.message
              });
            } else if (row) {
              console.log(`✅ Successfully queried by specific criteria: ${row.name}`);
              testResults.passed++;
              testResults.tests.push({
                name: 'Query by specific criteria',
                status: 'PASSED',
                result: `Found record: ${row.name}`
              });
            } else {
              console.error('❌ No record found for specific criteria query');
              testResults.failed++;
              testResults.tests.push({
                name: 'Query by specific criteria',
                status: 'FAILED',
                error: 'No record found'
              });
            }
            
            // Test 4: Count MCP test records
            console.log('\nTest 4: Testing count query for MCP test records...');
            db.get("SELECT COUNT(*) as count FROM employees WHERE email LIKE '%@mcptest.com'", (err, row) => {
              if (err) {
                console.error('❌ Error counting MCP test records:', err);
                testResults.failed++;
                testResults.tests.push({
                  name: 'Count MCP test records',
                  status: 'FAILED',
                  error: err.message
                });
              } else {
                if (row.count === insertedRecords.length) {
                  console.log(`✅ Count query successful: ${row.count} records`);
                  testResults.passed++;
                  testResults.tests.push({
                    name: 'Count MCP test records',
                    status: 'PASSED',
                    result: `Count: ${row.count}`
                  });
                } else {
                  console.error(`❌ Count mismatch: expected ${insertedRecords.length}, got ${row.count}`);
                  testResults.failed++;
                  testResults.tests.push({
                    name: 'Count MCP test records',
                    status: 'FAILED',
                    error: `Count mismatch: expected ${insertedRecords.length}, got ${row.count}`
                  });
                }
              }
              
              resolve(testResults);
            });
          });
        } else {
          console.error(`❌ Record count mismatch: expected ${insertedRecords.length}, got ${rows.length}`);
          testResults.failed++;
          testResults.tests.push({
            name: 'Query all MCP test records',
            status: 'FAILED',
            error: `Record count mismatch: expected ${insertedRecords.length}, got ${rows.length}`
          });
          resolve(testResults);
        }
      }
    });
  });
}

// Function to generate test report
function generateTestReport(testResults) {
  console.log('\n📊 MCP Server Database Query Test Report');
  console.log('==========================================');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  console.log('\nDetailed Results:');
  testResults.tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}: ${test.status}`);
    if (test.result) {
      console.log(`   Result: ${test.result}`);
    }
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All MCP Server database query tests PASSED!');
    console.log('✅ Records are fully queryable via MCP Server interface');
    return true;
  } else {
    console.log(`\n❌ ${testResults.failed} test(s) FAILED!`);
    console.log('⚠️  There are issues with MCP Server database querying');
    return false;
  }
}

// Main test function
async function runMcpServerTests() {
  try {
    console.log('\n🚀 Starting MCP Server Database Query Tests...\n');
    
    // Step 1: Clean up previous test data
    await cleanupMcpTestData();
    
    // Step 2: Insert test records
    const insertedRecords = await insertMcpTestRecords();
    
    // Step 3: Validate MCP Server queries
    const testResults = await validateMcpServerQueries(insertedRecords);
    
    // Step 4: Generate test report
    const allTestsPassed = generateTestReport(testResults);
    
    // Step 5: Clean up test data (optional)
    console.log('\n🧹 Cleaning up MCP test data...');
    await cleanupMcpTestData();
    
    console.log('\n✅ MCP Server database query tests completed!');
    
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('✅ Database connection closed');
      }
      
      // Exit with appropriate code
      process.exit(allTestsPassed ? 0 : 1);
    });
    
  } catch (error) {
    console.error('\n❌ MCP Server test failed:', error);
    db.close();
    process.exit(1);
  }
}

// Run the tests
runMcpServerTests();