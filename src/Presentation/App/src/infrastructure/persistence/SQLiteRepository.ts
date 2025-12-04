import * as SQLite from 'expo-sqlite';

/**
 * SQLite Database Service for offline storage
 * Handles local CRUD operations for products and cart items
 */
export class SQLiteRepository {
  private db: SQLite.SQLiteDatabase | null = null;
  private static instance: SQLiteRepository;

  private constructor() {}

  static getInstance(): SQLiteRepository {
    if (!SQLiteRepository.instance) {
      SQLiteRepository.instance = new SQLiteRepository();
    }
    return SQLiteRepository.instance;
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

      // Create indexes for performance optimization
      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_products_id ON products(id);
        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
        CREATE INDEX IF NOT EXISTS idx_products_synced_at ON products(synced_at);
        
        CREATE INDEX IF NOT EXISTS idx_cart_items_id ON cart_items(id);
        CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
        CREATE INDEX IF NOT EXISTS idx_cart_items_updated_at ON cart_items(updated_at);
        
        CREATE INDEX IF NOT EXISTS idx_offline_queue_status ON offline_queue(status);
        CREATE INDEX IF NOT EXISTS idx_offline_queue_entity_type ON offline_queue(entity_type);
        CREATE INDEX IF NOT EXISTS idx_offline_queue_created_at ON offline_queue(created_at);
      `);

      console.log('SQLite database initialized successfully with indexes');
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

export default SQLiteRepository.getInstance();
