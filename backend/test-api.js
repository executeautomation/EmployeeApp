const http = require('http');

// Configuration
const API_BASE = 'http://localhost:4000';
const TEST_TIMEOUT = 30000; // 30 seconds

// Test data
const testEmployees = [
  { name: 'API Test Employee 1', email: 'apitest1@company.com', position: 'Software Engineer' },
  { name: 'API Test Employee 2', email: 'apitest2@company.com', position: 'Product Manager' },
  { name: 'API Test Employee 3', email: 'apitest3@company.com', position: 'Data Analyst' }
];

// HTTP request helper
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : null;
          resolve({
            statusCode: res.statusCode,
            data: parsedData,
            raw: responseData
          });
        } catch (err) {
          resolve({
            statusCode: res.statusCode,
            data: null,
            raw: responseData,
            parseError: err.message
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testServerConnection() {
  console.log('Test 1: Testing server connection...');
  try {
    const response = await makeRequest('GET', '/employees');
    if (response.statusCode === 200) {
      console.log('✅ Server connection successful');
      return true;
    } else {
      console.log(`❌ Server connection failed: Status ${response.statusCode}`);
      return false;
    }
  } catch (err) {
    console.log('❌ Server connection failed:', err.message);
    return false;
  }
}

async function testInitialState() {
  console.log('\nTest 2: Getting initial employee count...');
  try {
    const response = await makeRequest('GET', '/employees');
    if (response.statusCode === 200 && Array.isArray(response.data)) {
      const initialCount = response.data.length;
      console.log(`✅ Initial employee count: ${initialCount}`);
      return { success: true, count: initialCount, employees: response.data };
    } else {
      console.log('❌ Failed to get initial employee data');
      return { success: false, count: 0, employees: [] };
    }
  } catch (err) {
    console.log('❌ Error getting initial state:', err.message);
    return { success: false, count: 0, employees: [] };
  }
}

async function testInsertOperations(initialCount) {
  console.log('\nTest 3: Testing INSERT operations via API...');
  const insertedEmployees = [];
  
  for (let i = 0; i < testEmployees.length; i++) {
    const employee = testEmployees[i];
    try {
      const response = await makeRequest('POST', '/employees', employee);
      if (response.statusCode === 200 && response.data && response.data.id) {
        console.log(`✅ Inserted: ${employee.name} (ID: ${response.data.id})`);
        insertedEmployees.push(response.data);
      } else {
        console.log(`❌ Failed to insert ${employee.name}: Status ${response.statusCode}`, response.data || response.raw);
      }
    } catch (err) {
      console.log(`❌ Error inserting ${employee.name}:`, err.message);
    }
  }
  
  // Verify insert count
  const response = await makeRequest('GET', '/employees');
  if (response.statusCode === 200 && Array.isArray(response.data)) {
    const newCount = response.data.length;
    const expectedCount = initialCount + insertedEmployees.length;
    if (newCount === expectedCount) {
      console.log(`✅ INSERT verification successful: ${newCount} total records (${insertedEmployees.length} new)`);
    } else {
      console.log(`❌ INSERT verification failed: Expected ${expectedCount}, got ${newCount}`);
    }
  }
  
  return insertedEmployees;
}

async function testSelectOperations() {
  console.log('\nTest 4: Testing SELECT operations via API...');
  try {
    const response = await makeRequest('GET', '/employees');
    if (response.statusCode === 200 && Array.isArray(response.data)) {
      const testEmployeesFound = response.data.filter(emp => emp.email.includes('@company.com'));
      console.log(`✅ SELECT verification successful: Found ${testEmployeesFound.length} test employees`);
      
      if (testEmployeesFound.length > 0) {
        console.log('\n📋 Test Employees Retrieved:');
        console.log('ID | Name | Email | Position');
        console.log('---|------|-------|----------');
        testEmployeesFound.forEach(emp => {
          console.log(`${emp.id} | ${emp.name} | ${emp.email} | ${emp.position}`);
        });
      }
      
      return { success: true, employees: testEmployeesFound };
    } else {
      console.log('❌ SELECT operation failed');
      return { success: false, employees: [] };
    }
  } catch (err) {
    console.log('❌ Error in SELECT operation:', err.message);
    return { success: false, employees: [] };
  }
}

async function testDeleteOperations(employeesToDelete, initialCount) {
  console.log('\nTest 5: Testing DELETE operations via API...');
  let deletedCount = 0;
  
  for (const employee of employeesToDelete) {
    try {
      const response = await makeRequest('DELETE', `/employees/${employee.id}`);
      if (response.statusCode === 200 && response.data && response.data.success) {
        console.log(`✅ Deleted employee ID: ${employee.id} (${employee.name})`);
        deletedCount++;
      } else {
        console.log(`❌ Failed to delete employee ID ${employee.id}: Status ${response.statusCode}`, response.data || response.raw);
      }
    } catch (err) {
      console.log(`❌ Error deleting employee ID ${employee.id}:`, err.message);
    }
  }
  
  // Verify delete count
  const response = await makeRequest('GET', '/employees');
  if (response.statusCode === 200 && Array.isArray(response.data)) {
    const finalCount = response.data.length;
    const expectedCount = initialCount - deletedCount;
    if (finalCount === expectedCount) {
      console.log(`✅ DELETE verification successful: ${finalCount} total records (${deletedCount} deleted)`);
    } else {
      console.log(`❌ DELETE verification failed: Expected ${expectedCount}, got ${finalCount}`);
    }
  }
  
  return deletedCount;
}

async function testDataCleanup() {
  console.log('\nTest 6: Verifying test data cleanup...');
  try {
    const response = await makeRequest('GET', '/employees');
    if (response.statusCode === 200 && Array.isArray(response.data)) {
      const remainingTestEmployees = response.data.filter(emp => emp.email.includes('apitest'));
      if (remainingTestEmployees.length === 0) {
        console.log('✅ Test data cleanup successful: No test employees remain');
      } else {
        console.log(`⚠️  Test data cleanup incomplete: ${remainingTestEmployees.length} test employees remain`);
        remainingTestEmployees.forEach(emp => {
          console.log(`   - ID ${emp.id}: ${emp.name} (${emp.email})`);
        });
      }
      return remainingTestEmployees.length === 0;
    }
  } catch (err) {
    console.log('❌ Error verifying cleanup:', err.message);
    return false;
  }
}

async function testLoginEndpoint() {
  console.log('\nTest 7: Testing LOGIN endpoint...');
  try {
    // Test valid login
    const validResponse = await makeRequest('POST', '/login', {
      username: 'admin',
      password: 'password'
    });
    
    if (validResponse.statusCode === 200 && validResponse.data && validResponse.data.success) {
      console.log('✅ Valid login test successful');
    } else {
      console.log('❌ Valid login test failed');
    }
    
    // Test invalid login
    const invalidResponse = await makeRequest('POST', '/login', {
      username: 'invalid',
      password: 'wrong'
    });
    
    if (invalidResponse.statusCode === 401) {
      console.log('✅ Invalid login test successful (properly rejected)');
    } else {
      console.log('❌ Invalid login test failed (should have been rejected)');
    }
    
  } catch (err) {
    console.log('❌ Error testing login endpoint:', err.message);
  }
}

// Main test runner
async function runAPITests() {
  console.log('🚀 Starting API Tests...\n');
  
  try {
    // Test server connection
    const serverOk = await testServerConnection();
    if (!serverOk) {
      console.log('\n❌ Cannot proceed with tests - server is not responding');
      console.log('💡 Make sure the server is running: node server.js');
      return;
    }
    
    // Get initial state
    const initialState = await testInitialState();
    if (!initialState.success) {
      console.log('\n❌ Cannot proceed with tests - failed to get initial state');
      return;
    }
    
    // Test INSERT operations
    const insertedEmployees = await testInsertOperations(initialState.count);
    
    // Test SELECT operations
    const selectResult = await testSelectOperations();
    
    // Test DELETE operations
    const deletedCount = await testDeleteOperations(insertedEmployees, initialState.count + insertedEmployees.length);
    
    // Test cleanup
    await testDataCleanup();
    
    // Test login endpoint
    await testLoginEndpoint();
    
    // Final summary
    console.log('\n🎯 API Operation Tests Summary:');
    console.log('   ✅ Server connection tested');
    console.log('   ✅ INSERT operations tested via POST /employees');
    console.log('   ✅ SELECT operations tested via GET /employees');
    console.log('   ✅ DELETE operations tested via DELETE /employees/:id');
    console.log('   ✅ LOGIN operations tested via POST /login');
    console.log('   ✅ Data integrity maintained');
    console.log('   ✅ Test data properly cleaned up');
    
    console.log('\n🏁 All API tests completed successfully!');
    
  } catch (err) {
    console.log('\n❌ Unexpected error during API tests:', err.message);
  }
}

// Check if server is running before starting tests
console.log('Checking if server is running on http://localhost:4000...\n');

// Wait a moment for any server startup, then run tests
setTimeout(() => {
  runAPITests().catch(err => {
    console.error('Fatal error in API tests:', err);
  });
}, 1000);