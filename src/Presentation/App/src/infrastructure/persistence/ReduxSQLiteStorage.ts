import sqliteRepository from './SQLiteRepository';

/**
 * Redux Persist Storage Adapter for SQLite
 * Implements the redux-persist storage interface using SQLite
 */
const ReduxSQLiteStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await sqliteRepository.getItem(key);
    } catch (error) {
      console.error(`ReduxSQLiteStorage: Error getting item ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await sqliteRepository.setItem(key, value);
    } catch (error) {
      console.error(`ReduxSQLiteStorage: Error setting item ${key}:`, error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await sqliteRepository.removeItem(key);
    } catch (error) {
      console.error(`ReduxSQLiteStorage: Error removing item ${key}:`, error);
      throw error;
    }
  },
};

export default ReduxSQLiteStorage;
