import { SQLiteDatabase } from './sqlite';
import { CartItem, Product } from '@/types';
import CacheManager from './cacheManager';
import UnifiedAnalyticsManager from './unifiedAnalytics';

/**
 * Local Storage Service for offline data persistence
 * Abstracts SQLite operations for products and cart items
 * Integrated with CacheManager and Unified Analytics
 */
export class LocalStorageService {
  private db: ReturnType<typeof SQLiteDatabase.getInstance>;
  private cacheManager = CacheManager;
  private analytics = UnifiedAnalyticsManager;

  constructor() {
    this.db = SQLiteDatabase.getInstance();
  }

  // ============= PRODUCTS =============

  /**
   * Get all cached products
   */
  async getProducts(): Promise<Product[]> {
    try {
      const result = await this.db.getDb().getAllAsync<Product>(
        'SELECT id, title, price, description, category, image, rating_rate as "rating.rate", rating_count as "rating.count" FROM products ORDER BY created_at DESC'
      );
      return result || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: number): Promise<Product | null> {
    try {
      const result = await this.db.getDb().getFirstAsync<Product>(
        'SELECT id, title, price, description, category, image, rating_rate as "rating.rate", rating_count as "rating.count" FROM products WHERE id = ?',
        [id]
      );
      return result || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  /**
   * Save products to local storage
   */
  async saveProducts(products: Product[]): Promise<void> {
    try {
      const db = this.db.getDb();

      for (const product of products) {
        await db.runAsync(
          `INSERT OR REPLACE INTO products (id, title, price, description, category, image, rating_rate, rating_count, synced_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.id,
            product.title,
            product.price,
            product.description,
            product.category,
            product.image,
            product.rating.rate,
            product.rating.count,
            new Date().toISOString(),
          ]
        );
      }

      console.log(`Saved ${products.length} products to local storage`);
    } catch (error) {
      console.error('Error saving products:', error);
      throw error;
    }
  }

  // ============= CART ITEMS =============

  /**
   * Get all cart items from local storage
   */
  async getCartItems(): Promise<CartItem[]> {
    try {
      const result = await this.db.getDb().getAllAsync<CartItem>(
        `SELECT c.id, c.product_id, c.quantity, p.title, p.price, p.description, p.category, p.image, p.rating_rate, p.rating_count
         FROM cart_items c
         JOIN products p ON c.product_id = p.id
         ORDER BY c.created_at DESC`
      );
      return result || [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  }

  /**
   * Add item to local cart
   */
  async addCartItem(cartItem: CartItem): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        `INSERT OR REPLACE INTO cart_items (id, product_id, quantity)
         VALUES (?, ?, ?)`,
        [cartItem.id, cartItem.id, cartItem.quantity || 1]
      );

      // Queue the operation for sync
      await this.queueOperation('add', 'cartItem', cartItem.id, cartItem);
      console.log(`Added item to cart: ${cartItem.title}`);
    } catch (error) {
      console.error('Error adding cart item:', error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(cartItem: CartItem): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        `UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [cartItem.quantity, cartItem.id]
      );

      // Queue the operation for sync
      await this.queueOperation('update', 'cartItem', cartItem.id, { quantity: cartItem.quantity });
      console.log(`Updated cart item quantity: ${cartItem.id}`);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  /**
   * Remove cart item by ID
   */
  async removeCartItem(id: number): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        'DELETE FROM cart_items WHERE id = ?',
        [id]
      );

      // Queue the operation for sync
      await this.queueOperation('delete', 'cartItem', id, {});
      console.log(`Removed cart item: ${id}`);
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  }

  /**
   * Clear all cart items
   */
  async clearCartItems(): Promise<void> {
    try {
      const cartItems = await this.getCartItems();
      
      await this.db.getDb().runAsync('DELETE FROM cart_items');

      // Queue clear operation
      await this.queueOperation('deleteAll', 'cartItem', 0, {});
      
      console.log('Cleared all cart items');
    } catch (error) {
      console.error('Error clearing cart items:', error);
      throw error;
    }
  }

  // ============= OFFLINE QUEUE =============

  /**
   * Queue an operation for later sync
   */
  async queueOperation(
    operationType: 'add' | 'update' | 'delete' | 'deleteAll',
    entityType: 'product' | 'cartItem',
    entityId: number,
    payload: any
  ): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        `INSERT INTO offline_queue (operation_type, entity_type, entity_id, payload, status)
         VALUES (?, ?, ?, ?, ?)`,
        [
          operationType,
          entityType,
          entityId,
          JSON.stringify(payload),
          'pending',
        ]
      );

      console.log(`Queued ${operationType} operation for ${entityType}`);
    } catch (error) {
      console.error('Error queueing operation:', error);
      throw error;
    }
  }

  /**
   * Get all pending operations from queue
   */
  async getPendingOperations(): Promise<OfflineOperation[]> {
    try {
      const result = await this.db.getDb().getAllAsync<OfflineOperation>(
        `SELECT id, operation_type, entity_type, entity_id, payload, retry_count
         FROM offline_queue
         WHERE status = 'pending'
         ORDER BY created_at ASC`
      );
      return result || [];
    } catch (error) {
      console.error('Error fetching pending operations:', error);
      return [];
    }
  }

  /**
   * Mark operation as synced
   */
  async markOperationAsSynced(operationId: number): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        `UPDATE offline_queue SET status = 'synced', synced_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [operationId]
      );
    } catch (error) {
      console.error('Error marking operation as synced:', error);
      throw error;
    }
  }

  /**
   * Increment retry count for operation
   */
  async incrementRetryCount(operationId: number): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        `UPDATE offline_queue SET retry_count = retry_count + 1 WHERE id = ?`,
        [operationId]
      );
    } catch (error) {
      console.error('Error incrementing retry count:', error);
      throw error;
    }
  }

  /**
   * Clear completed operations from queue
   */
  async clearSyncedOperations(): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        `DELETE FROM offline_queue WHERE status = 'synced'`
      );
      console.log('Cleared synced operations from queue');
    } catch (error) {
      console.error('Error clearing synced operations:', error);
      throw error;
    }
  }
}

export interface OfflineOperation {
  id: number;
  operation_type: 'add' | 'update' | 'delete' | 'deleteAll';
  entity_type: 'product' | 'cartItem';
  entity_id: number;
  payload: string;
  retry_count: number;
}

export default new LocalStorageService();
