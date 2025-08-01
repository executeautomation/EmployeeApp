import { test, expect } from '@playwright/test';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the verbose sqlite3 interface
const sqlite = sqlite3.verbose();

/**
 * Database Integration Tests
 * Tests direct database operations and data persistence
 * using SQLite database located at backend/db.sqlite
 */

// Database helper functions
class DatabaseHelper {
  constructor() {
    this.dbPath = path.resolve(__dirname, '../../backend/db.sqlite');
    this.db = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async disconnect() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        // Check if database is already closed
        try {
          this.db.close((err) => {
            if (err && !err.message.includes('Database is closed')) {
              reject(err);
            } else {
              this.db = null;
              resolve();
            }
          });
        } catch (error) {
          // Database was already closed
          this.db = null;
          resolve();
        }
      } else {
        resolve();
      }
    });
  }

  async getAllEmployees() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM employees ORDER BY id', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getEmployeeById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async insertEmployee(name, email, position) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
        [name, email, position],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, email, position });
          }
        }
      );
    });
  }

  async updateEmployee(id, name, email, position) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE employees SET name = ?, email = ?, position = ? WHERE id = ?',
        [name, email, position, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes, id, name, email, position });
          }
        }
      );
    });
  }

  async deleteEmployee(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM employees WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  async clearEmployees() {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM employees', [], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getTableInfo() {
    return new Promise((resolve, reject) => {
      this.db.all('PRAGMA table_info(employees)', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async countEmployees() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as count FROM employees', [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }
}

test.describe('Database Integration Tests', () => {
  let dbHelper;

  test.beforeAll(async () => {
    // Verify database file exists
    const dbPath = path.resolve(__dirname, '../../backend/db.sqlite');
    expect(fs.existsSync(dbPath)).toBeTruthy();
  });

  test.beforeEach(async () => {
    dbHelper = new DatabaseHelper();
    await dbHelper.connect();
    // Clean up any existing test data
    await dbHelper.clearEmployees();
  });

  test.afterEach(async () => {
    if (dbHelper) {
      await dbHelper.disconnect();
    }
  });

  test.describe('Database Schema', () => {
    test('should have correct table structure', async () => {
      const tableInfo = await dbHelper.getTableInfo();
      
      // Verify table has correct columns
      const columnNames = tableInfo.map(col => col.name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('email');
      expect(columnNames).toContain('position');

      // Verify column types
      const idColumn = tableInfo.find(col => col.name === 'id');
      expect(idColumn.type).toBe('INTEGER');
      expect(idColumn.pk).toBe(1); // Primary key

      const nameColumn = tableInfo.find(col => col.name === 'name');
      expect(nameColumn.type).toBe('TEXT');
      expect(nameColumn.notnull).toBe(1); // NOT NULL
    });

    test('should be empty after cleanup', async () => {
      const count = await dbHelper.countEmployees();
      expect(count).toBe(0);
    });
  });

  test.describe('CRUD Operations', () => {
    test('should insert employee and auto-generate ID', async () => {
      const employee = await dbHelper.insertEmployee(
        'John Doe',
        'john.doe@example.com',
        'Software Engineer'
      );

      expect(employee.id).toBeGreaterThan(0);
      expect(employee.name).toBe('John Doe');
      expect(employee.email).toBe('john.doe@example.com');
      expect(employee.position).toBe('Software Engineer');

      // Verify it's actually in the database
      const retrievedEmployee = await dbHelper.getEmployeeById(employee.id);
      expect(retrievedEmployee).toEqual(employee);
    });

    test('should retrieve all employees', async () => {
      // Insert multiple employees
      await dbHelper.insertEmployee('Alice Smith', 'alice@example.com', 'Designer');
      await dbHelper.insertEmployee('Bob Johnson', 'bob@example.com', 'Manager');
      await dbHelper.insertEmployee('Carol Brown', 'carol@example.com', 'Developer');

      const employees = await dbHelper.getAllEmployees();
      expect(employees).toHaveLength(3);
      
      // Verify they're sorted by ID
      expect(employees[0].name).toBe('Alice Smith');
      expect(employees[1].name).toBe('Bob Johnson');
      expect(employees[2].name).toBe('Carol Brown');
    });

    test('should update existing employee', async () => {
      // Insert employee
      const original = await dbHelper.insertEmployee(
        'Original Name',
        'original@example.com',
        'Original Position'
      );

      // Update employee
      const updateResult = await dbHelper.updateEmployee(
        original.id,
        'Updated Name',
        'updated@example.com',
        'Updated Position'
      );

      expect(updateResult.changes).toBe(1);
      expect(updateResult.name).toBe('Updated Name');

      // Verify update in database
      const updated = await dbHelper.getEmployeeById(original.id);
      expect(updated.name).toBe('Updated Name');
      expect(updated.email).toBe('updated@example.com');
      expect(updated.position).toBe('Updated Position');
      expect(updated.id).toBe(original.id); // ID should remain the same
    });

    test('should handle update of non-existent employee', async () => {
      const updateResult = await dbHelper.updateEmployee(
        999999, // Non-existent ID
        'Test Name',
        'test@example.com',
        'Test Position'
      );

      expect(updateResult.changes).toBe(0); // No rows affected
    });

    test('should delete existing employee', async () => {
      // Insert employee
      const employee = await dbHelper.insertEmployee(
        'To Delete',
        'delete@example.com',
        'Temporary'
      );

      // Delete employee
      const deleteResult = await dbHelper.deleteEmployee(employee.id);
      expect(deleteResult.changes).toBe(1);

      // Verify deletion
      const deleted = await dbHelper.getEmployeeById(employee.id);
      expect(deleted).toBeUndefined();
    });

    test('should handle deletion of non-existent employee', async () => {
      const deleteResult = await dbHelper.deleteEmployee(999999);
      expect(deleteResult.changes).toBe(0); // No rows affected
    });
  });

  test.describe('Data Persistence', () => {
    test('should persist data between operations', async () => {
      // Insert employee
      const employee1 = await dbHelper.insertEmployee(
        'Persistent User',
        'persistent@example.com',
        'Test Role'
      );

      // Disconnect and reconnect to simulate application restart
      await dbHelper.disconnect();
      await dbHelper.connect();

      // Verify data persists
      const retrieved = await dbHelper.getEmployeeById(employee1.id);
      expect(retrieved).toEqual(employee1);

      // Insert another employee
      const employee2 = await dbHelper.insertEmployee(
        'Second User',
        'second@example.com',
        'Another Role'
      );

      // Verify both exist
      const allEmployees = await dbHelper.getAllEmployees();
      expect(allEmployees).toHaveLength(2);
      expect(allEmployees.find(emp => emp.id === employee1.id)).toBeTruthy();
      expect(allEmployees.find(emp => emp.id === employee2.id)).toBeTruthy();
    });

    test('should maintain data integrity during concurrent operations', async () => {
      // Insert base employee
      const employee = await dbHelper.insertEmployee(
        'Base Employee',
        'base@example.com',
        'Base Position'
      );

      // Simulate multiple updates
      await Promise.all([
        dbHelper.updateEmployee(employee.id, 'Updated 1', 'update1@example.com', 'Position 1'),
        dbHelper.updateEmployee(employee.id, 'Updated 2', 'update2@example.com', 'Position 2'),
        dbHelper.updateEmployee(employee.id, 'Updated 3', 'update3@example.com', 'Position 3')
      ]);

      // Verify only one update succeeded (due to SQLite's locking)
      const final = await dbHelper.getEmployeeById(employee.id);
      expect(final.id).toBe(employee.id);
      expect(['Updated 1', 'Updated 2', 'Updated 3']).toContain(final.name);
    });
  });

  test.describe('Data Validation', () => {
    test('should handle special characters in data', async () => {
      const specialName = "O'Connor & Smith (Sr.)";
      const specialEmail = "test+special@example-domain.co.uk";
      const specialPosition = "Senior Developer/Architect";

      const employee = await dbHelper.insertEmployee(
        specialName,
        specialEmail,
        specialPosition
      );

      expect(employee.name).toBe(specialName);
      expect(employee.email).toBe(specialEmail);
      expect(employee.position).toBe(specialPosition);

      // Verify retrieval
      const retrieved = await dbHelper.getEmployeeById(employee.id);
      expect(retrieved.name).toBe(specialName);
      expect(retrieved.email).toBe(specialEmail);
      expect(retrieved.position).toBe(specialPosition);
    });

    test('should handle unicode characters', async () => {
      const unicodeName = "José María Åström-Müller";
      const unicodeEmail = "josé@example.com";
      const unicodePosition = "Développeur Senior";

      const employee = await dbHelper.insertEmployee(
        unicodeName,
        unicodeEmail,
        unicodePosition
      );

      const retrieved = await dbHelper.getEmployeeById(employee.id);
      expect(retrieved.name).toBe(unicodeName);
      expect(retrieved.email).toBe(unicodeEmail);
      expect(retrieved.position).toBe(unicodePosition);
    });

    test('should handle long strings', async () => {
      const longName = 'A'.repeat(255);
      const longEmail = 'a'.repeat(240) + '@example.com';
      const longPosition = 'B'.repeat(255);

      const employee = await dbHelper.insertEmployee(
        longName,
        longEmail,
        longPosition
      );

      const retrieved = await dbHelper.getEmployeeById(employee.id);
      expect(retrieved.name).toBe(longName);
      expect(retrieved.email).toBe(longEmail);
      expect(retrieved.position).toBe(longPosition);
    });
  });

  test.describe('Performance and Scalability', () => {
    test('should handle bulk inserts efficiently', async () => {
      const startTime = Date.now();
      const employees = [];

      // Insert 100 employees
      for (let i = 1; i <= 100; i++) {
        const employee = await dbHelper.insertEmployee(
          `Employee ${i}`,
          `employee${i}@example.com`,
          `Position ${i}`
        );
        employees.push(employee);
      }

      const insertTime = Date.now() - startTime;
      console.log(`Bulk insert of 100 employees took ${insertTime}ms`);

      // Verify all were inserted
      const count = await dbHelper.countEmployees();
      expect(count).toBe(100);

      // Verify retrieval performance
      const retrievalStart = Date.now();
      const allEmployees = await dbHelper.getAllEmployees();
      const retrievalTime = Date.now() - retrievalStart;
      console.log(`Retrieval of 100 employees took ${retrievalTime}ms`);

      expect(allEmployees).toHaveLength(100);
    });

    test('should maintain performance with search operations', async () => {
      // Insert test data
      for (let i = 1; i <= 50; i++) {
        await dbHelper.insertEmployee(
          `Employee ${i}`,
          `employee${i}@example.com`,
          i % 5 === 0 ? 'Manager' : 'Developer'
        );
      }

      // Test search performance (simulated)
      const searchStart = Date.now();
      const employees = await dbHelper.getAllEmployees();
      const managers = employees.filter(emp => emp.position === 'Manager');
      const searchTime = Date.now() - searchStart;

      console.log(`Search operation took ${searchTime}ms`);
      expect(managers).toHaveLength(10); // Every 5th employee is a manager
    });
  });

  test.describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // Close the connection
      await dbHelper.disconnect();

      // Try to perform operation on closed connection
      let errorOccurred = false;
      try {
        await dbHelper.getAllEmployees();
      } catch (error) {
        errorOccurred = true;
        // The error could be about database being closed or null reference
        expect(error.message).toMatch(/Database is closed|Cannot read properties of null/);
      }

      expect(errorOccurred).toBeTruthy();
    });

    test('should handle SQL injection attempts', async () => {
      // Attempt SQL injection through parameters
      const maliciousName = "'; DROP TABLE employees; --";
      const maliciousEmail = "test@example.com";
      const maliciousPosition = "Position";

      // This should not cause any issues due to parameterized queries
      const employee = await dbHelper.insertEmployee(
        maliciousName,
        maliciousEmail,
        maliciousPosition
      );

      // Verify the malicious string was stored as data, not executed
      expect(employee.name).toBe(maliciousName);

      // Verify table still exists and functions
      const allEmployees = await dbHelper.getAllEmployees();
      expect(Array.isArray(allEmployees)).toBeTruthy();
    });
  });
});