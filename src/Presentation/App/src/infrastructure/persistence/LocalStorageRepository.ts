import { SQLiteRepository } from './SQLiteRepository';
import { Product } from '../../core/domain/entities/Product';
import { CartItem } from '@/types';
import { IOfflineQueueRepository } from '../../core/domain/ports/IOfflineQueueRepository';

// Temporary type definition until we fix imports
export interface OfflineOperation {
  id: number;
  operation_type: 'add' | 'update' | 'delete' | 'deleteAll';
  entity_type: 'product' | 'cartItem';
  entity_id: number;
  payload: string;
  retry_count: number;
}

/**
 * Local Storage Repository
 * Implements offline data persistence using SQLite
 */
export class LocalStorageRepository implements IOfflineQueueRepository {
  private db: ReturnType<typeof SQLiteRepository.getInstance>;

  constructor() {
    this.db = SQLiteRepository.getInstance();
  }

  // ============= PRODUCTS =============

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

  // Note: CartItem interface might need adjustment to match DB schema vs Domain Entity
  async getCartItems(): Promise<any[]> {
    try {
      const result = await this.db.getDb().getAllAsync<any>(
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

  async addCartItem(cartItem: any): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        `INSERT OR REPLACE INTO cart_items (id, product_id, quantity)
         VALUES (?, ?, ?)`,
        [cartItem.id, cartItem.id, cartItem.quantity || 1]
      );

      await this.addToQueue('add', { entityType: 'cartItem', entityId: cartItem.id, payload: cartItem });
      console.log(`Added item to cart: ${cartItem.title}`);
    } catch (error) {
      console.error('Error adding cart item:', error);
      throw error;
    }
  }

  async updateCartItem(cartItem: any): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        `UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [cartItem.quantity, cartItem.id]
      );

      await this.addToQueue('update', { entityType: 'cartItem', entityId: cartItem.id, payload: { quantity: cartItem.quantity } });
      console.log(`Updated cart item quantity: ${cartItem.id}`);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  async removeCartItem(id: number): Promise<void> {
    try {
      await this.db.getDb().runAsync(
        'DELETE FROM cart_items WHERE id = ?',
        [id]
      );

      await this.addToQueue('delete', { entityType: 'cartItem', entityId: id, payload: {} });
      console.log(`Removed cart item: ${id}`);
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  }

  async clearCartItems(): Promise<void> {
    try {
      await this.db.getDb().runAsync('DELETE FROM cart_items');
      await this.addToQueue('deleteAll', { entityType: 'cartItem', entityId: 0, payload: {} });
      console.log('Cleared all cart items');
    } catch (error) {
      console.error('Error clearing cart items:', error);
      throw error;
    }
  }

  // ============= OFFLINE QUEUE IMPLEMENTATION =============

  async addToQueue(action: string, payload: any): Promise<void> {
    // Mapping generic action to specific DB fields
    // This is a simplification. In a real app, we might need more specific arguments or parsing.
    // Assuming payload contains entityType, entityId, and actual payload data.
    
    // For now, let's adapt the interface to match the DB schema logic from the original file
    // The original file had: queueOperation(operationType, entityType, entityId, payload)
    
    // We will parse the 'payload' argument to extract these if possible, or change the interface.
    // Since I defined IOfflineQueueRepository with (action, payload), I'll stick to that but maybe payload needs to be structured.
    
    const { entityType, entityId, payload: actualPayload } = payload;
    const operationType = action;

    try {
      await this.db.getDb().runAsync(
        `INSERT INTO offline_queue (operation_type, entity_type, entity_id, payload, status)
         VALUES (?, ?, ?, ?, ?)`,
        [
          operationType,
          entityType,
          entityId,
          JSON.stringify(actualPayload),
          'pending',
        ]
      );
      console.log(`Queued ${operationType} operation for ${entityType}`);
    } catch (error) {
      console.error('Error queueing operation:', error);
      throw error;
    }
  }

  async getQueue(): Promise<any[]> {
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

  async removeFromQueue(id: string): Promise<void> {
     // In this context, removing might mean marking as synced
     await this.markOperationAsSynced(Number(id));
  }

  async clearQueue(): Promise<void> {
      // Clear synced operations
      try {
        await this.db.getDb().runAsync(
          `DELETE FROM offline_queue WHERE status = 'synced'`
        );
      } catch (error) {
        console.error('Error clearing synced operations:', error);
        throw error;
      }
  }

  // Helper methods
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
}

export default new LocalStorageRepository();
