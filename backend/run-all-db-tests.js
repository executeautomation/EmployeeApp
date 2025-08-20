const { exec } = require('child_process');
const path = require('path');

console.log('🔍 Running comprehensive database tests...\n');

// Function to run a command and return a promise
function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`📝 ${description}...`);
    console.log(`   Command: ${command}\n`);
    
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ ${description} failed:`);
        console.error(error.message);
        if (stderr) console.error(stderr);
        reject(error);
        return;
      }
      
      console.log(stdout);
      if (stderr) {
        console.warn('Warnings:', stderr);
      }
      
      console.log(`✅ ${description} completed successfully\n`);
      console.log('='.repeat(80) + '\n');
      resolve();
    });
  });
}

// Main test runner
async function runAllTests() {
  try {
    console.log('🚀 Starting comprehensive database test suite...\n');
    console.log('='.repeat(80) + '\n');
    
    // Test 1: Basic database structure and existing data
    await runCommand('node test-db.js', 'Basic database structure and data validation');
    
    // Test 2: MCP Server query capabilities
    await runCommand('node test-mcp-server.js', 'MCP Server database query validation');
    
    // Test 3: Add more sample data if needed
    await runCommand('node add-sample-data.js', 'Adding additional sample data');
    
    // Test 4: Final database state validation
    await runCommand('node test-db.js', 'Final database state validation');
    
    console.log('🎉 All database tests completed successfully!');
    console.log('✅ Database is fully functional and MCP Server compatible');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    console.error('💡 Please check the individual test outputs above for details');
    process.exit(1);
  }
}

// Run the test suite
runAllTests();