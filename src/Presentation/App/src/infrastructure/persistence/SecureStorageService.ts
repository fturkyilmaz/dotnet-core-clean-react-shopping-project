import * as SecureStore from 'expo-secure-store';

export interface StorageOptions {
  keychainService?: string;
  requireAuthentication?: boolean;
}

class SecureStorageService {
  private static _instance: SecureStorageService;

  private constructor() {}

  public static get instance(): SecureStorageService {
    if (!SecureStorageService._instance) {
      SecureStorageService._instance = new SecureStorageService();
    }
    return SecureStorageService._instance;
  }

  async setItem(key: string, value: string, options?: StorageOptions): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value, options);
    } catch (error) {
      console.warn(`[SecureStorageService] Failed to set item: ${key}`, error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStorageService] Failed to get item: ${key}`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStorageService] Failed to remove item: ${key}`, error);
      throw error;
    }
  }

  async containsKey(key: string): Promise<boolean> {
    const value = await this.getItem(key);
    return value !== null;
  }
}

export const secureStorage = SecureStorageService.instance;
