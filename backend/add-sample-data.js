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

// Sample employee data
const sampleEmployees = [
  {
    name: 'John Doe',
    email: 'john.doe@company.com',
    position: 'Software Engineer'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    position: 'Product Manager'
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    position: 'UX Designer'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    position: 'Data Analyst'
  },
  {
    name: 'David Brown',
    email: 'david.brown@company.com',
    position: 'DevOps Engineer'
  }
];

// Function to add sample data
function addSampleData() {
  console.log('\n🌱 Adding sample employee data...\n');
  
  // Check if data already exists
  db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
    if (err) {
      console.error('❌ Error checking existing data:', err);
      db.close();
      return;
    }
    
    if (row.count > 0) {
      console.log(`⚠️  Database already contains ${row.count} employee records.`);
      console.log('Do you want to add more sample data anyway? (This script will add the sample data)');
    }
    
    // Insert sample data
    const stmt = db.prepare("INSERT INTO employees (name, email, position) VALUES (?, ?, ?)");
    
    let insertedCount = 0;
    sampleEmployees.forEach((employee, index) => {
      stmt.run([employee.name, employee.email, employee.position], function(err) {
        if (err) {
          console.error(`❌ Error inserting ${employee.name}:`, err);
        } else {
          console.log(`✅ Added: ${employee.name} (ID: ${this.lastID})`);
          insertedCount++;
        }
        
        // If this is the last employee, finalize
        if (index === sampleEmployees.length - 1) {
          stmt.finalize((err) => {
            if (err) {
              console.error('❌ Error finalizing statement:', err);
            } else {
              console.log(`\n🎉 Successfully added ${insertedCount} sample employees!`);
              
              // Verify the data was added
              db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
                if (err) {
                  console.error('❌ Error verifying data:', err);
                } else {
                  console.log(`📊 Total employees in database: ${row.count}`);
                }
                
                db.close((err) => {
                  if (err) {
                    console.error('Error closing database:', err);
                  } else {
                    console.log('✅ Database connection closed');
                  }
                });
              });
            }
          });
        }
      });
    });
  });
}

// Run the function
addSampleData();
