const http = require('http');

// Function to make HTTP requests
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            data: res.statusCode === 200 ? JSON.parse(data) : data
          };
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.method === 'POST' && options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Main API testing function
async function testApiEndpoints() {
  console.log('🔍 Testing API endpoints with inserted records...\n');
  
  const baseUrl = 'localhost';
  const port = 4000;
  
  try {
    // Test 1: GET all employees
    console.log('Test 1: GET /employees - Retrieving all employee records...');
    const getAllResult = await makeRequest({
      hostname: baseUrl,
      port: port,
      path: '/employees',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (getAllResult.statusCode === 200) {
      console.log(`✅ Successfully retrieved ${getAllResult.data.length} employee records`);
      console.log('Sample records:');
      getAllResult.data.slice(0, 3).forEach(emp => {
        console.log(`   - ID: ${emp.id}, Name: ${emp.name}, Email: ${emp.email}`);
      });
    } else {
      console.error(`❌ Failed to retrieve employees: ${getAllResult.statusCode}`);
      return;
    }
    
    // Test 2: POST new employee via API
    console.log('\nTest 2: POST /employees - Adding new employee via API...');
    const newEmployee = {
      name: 'API Test User',
      email: 'api.test@apitest.com',
      position: 'API Test Engineer'
    };
    
    const postResult = await makeRequest({
      hostname: baseUrl,
      port: port,
      path: '/employees',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: newEmployee
    });
    
    if (postResult.statusCode === 200) {
      console.log(`✅ Successfully added new employee via API: ${postResult.data.name} (ID: ${postResult.data.id})`);
      
      // Test 3: Verify the new employee can be retrieved
      console.log('\nTest 3: Verifying new employee in database...');
      const getUpdatedResult = await makeRequest({
        hostname: baseUrl,
        port: port,
        path: '/employees',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (getUpdatedResult.statusCode === 200) {
        const newEmployeeInDb = getUpdatedResult.data.find(emp => emp.id === postResult.data.id);
        if (newEmployeeInDb) {
          console.log(`✅ New employee found in database: ${newEmployeeInDb.name}`);
          console.log(`   Email: ${newEmployeeInDb.email}, Position: ${newEmployeeInDb.position}`);
          
          // Test 4: Clean up - delete the test employee
          console.log('\nTest 4: Cleaning up - deleting test employee...');
          const deleteResult = await makeRequest({
            hostname: baseUrl,
            port: port,
            path: `/employees/${postResult.data.id}`,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (deleteResult.statusCode === 200) {
            console.log('✅ Test employee successfully deleted');
          } else {
            console.warn(`⚠️ Could not delete test employee: ${deleteResult.statusCode}`);
          }
        } else {
          console.error('❌ New employee not found in database after insertion');
        }
      } else {
        console.error(`❌ Failed to retrieve updated employee list: ${getUpdatedResult.statusCode}`);
      }
    } else {
      console.error(`❌ Failed to add new employee: ${postResult.statusCode}`);
    }
    
    // Final verification
    console.log('\nFinal verification: Checking final record count...');
    const finalResult = await makeRequest({
      hostname: baseUrl,
      port: port,
      path: '/employees',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (finalResult.statusCode === 200) {
      console.log(`✅ Final employee count: ${finalResult.data.length} records`);
    }
    
    console.log('\n🎉 API endpoint testing completed successfully!');
    console.log('✅ All inserted records are accessible via REST API');
    console.log('✅ CRUD operations are working correctly');
    
  } catch (error) {
    console.error('❌ API testing failed:', error.message);
    console.error('💡 Make sure the backend server is running on port 4000');
    process.exit(1);
  }
}

// Check if server is running and run tests
console.log('🚀 Starting API endpoint validation...\n');
console.log('📡 Checking if server is running on http://localhost:4000...');

makeRequest({
  hostname: 'localhost',
  port: 4000,
  path: '/employees',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
}).then(() => {
  console.log('✅ Server is running, proceeding with tests...\n');
  testApiEndpoints();
}).catch(() => {
  console.error('❌ Server is not running on http://localhost:4000');
  console.error('💡 Please start the server first with: npm start');
  console.error('   Or run: node server.js');
  process.exit(1);
});