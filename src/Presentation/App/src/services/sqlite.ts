import * as SQLite from 'expo-sqlite';
import { CartItem, Product } from '@/types';

/**
 * SQLite Database Service for offline storage
 * Handles local CRUD operations for products and cart items
 */
export class SQLiteDatabase {
  private db: SQLite.SQLiteDatabase | null = null;
  private static instance: SQLiteDatabase;

  private constructor() {}

  static getInstance(): SQLiteDatabase {
    if (!SQLiteDatabase.instance) {
      SQLiteDatabase.instance = new SQLiteDatabase();
    }
    return SQLiteDatabase.instance;
  }

  /**
   * Initialize database and create tables if they don't exist
   */
  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('shopping_app.db');

      // Create Products table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          price REAL NOT NULL,
          description TEXT,
          category TEXT,
          image TEXT,
          rating_rate REAL,
          rating_count INTEGER,
          synced_at TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create Cart Items table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS cart_items (
          id INTEGER PRIMARY KEY,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          synced_at TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id)
        );
      `);

      // Create Offline Operations Queue table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS offline_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          operation_type TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          entity_id INTEGER,
          payload TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          retry_count INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          synced_at TEXT
        );
      `);

      console.log('SQLite database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Get database instance
   */
  getDb(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Clear all data from tables (for testing or logout)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.execAsync(`
        DELETE FROM cart_items;
        DELETE FROM products;
        DELETE FROM offline_queue;
      `);
      console.log('All data cleared from database');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export default SQLiteDatabase.getInstance();
