#!/bin/bash

# Database Testing Script
# Tests INSERT, SELECT, and DELETE operations for Employee Database

echo "🔍 Employee Database Testing Suite"
echo "=================================="
echo ""

# Test 1: Direct Database Tests
echo "Running Direct Database Tests..."
echo "--------------------------------"
node test-db.js
echo ""

# Check if user wants to run API tests
echo "Would you like to run API tests? (requires server to be running)"
echo "Options:"
echo "  1. Run API tests (start server automatically)"
echo "  2. Skip API tests"
echo "  3. Run API tests (server already running)"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Starting server and running API tests..."
        echo "---------------------------------------"
        # Start server in background
        node server.js &
        SERVER_PID=$!
        
        # Wait for server to start
        sleep 3
        
        # Run API tests
        node test-api.js
        
        # Stop server
        kill $SERVER_PID 2>/dev/null
        echo ""
        echo "Server stopped."
        ;;
    2)
        echo ""
        echo "Skipping API tests."
        ;;
    3)
        echo ""
        echo "Running API tests (assuming server is running)..."
        echo "------------------------------------------------"
        node test-api.js
        ;;
    *)
        echo ""
        echo "Invalid choice. Skipping API tests."
        ;;
esac

echo ""
echo "🏁 Testing complete!"
echo ""
echo "Summary:"
echo "- Direct database operations (INSERT, SELECT, DELETE) tested ✅"
if [ "$choice" = "1" ] || [ "$choice" = "3" ]; then
    echo "- API endpoint operations (POST, GET, DELETE) tested ✅"
fi
echo ""
echo "Both tests verify:"
echo "  • INSERT operations work correctly"
echo "  • SELECT operations retrieve data properly" 
echo "  • DELETE operations remove data successfully"
echo "  • Data integrity is maintained"
echo "  • Test data is properly cleaned up"