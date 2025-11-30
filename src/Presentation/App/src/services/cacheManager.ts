/**
 * Cache Manager
 * Simple in-memory cache with TTL support
 */
export class CacheManager {
  private cache: Map<string, { value: any; expiresAt: number; tags: string[] }> = new Map();
  private readonly DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes
  private readonly PRODUCT_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly CART_TTL = 5 * 60 * 1000; // 5 minutes

  private static instance: CacheManager;

  private constructor() {
    // Automatic cleanup every 60 seconds
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Get value from cache with optional fetcher
   */
  async get<T>(
    key: string,
    fetcher?: () => Promise<T>,
    options?: { tag?: string; ttl?: number }
  ): Promise<T | null> {
    const cached = this.cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
    }

    if (!fetcher) {
      return null;
    }

    try {
      const value = await fetcher();
      const ttl = options?.ttl || this.DEFAULT_TTL;
      this.cache.set(key, {
        value,
        expiresAt: Date.now() + ttl,
        tags: options?.tag ? [options.tag] : [],
      });
      return value;
    } catch (error) {
      console.error(`Error fetching value for cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Invalidate by key
   */
  invalidateKey(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate by tag
   */
  invalidateByTag(tag: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }
}

export default CacheManager.getInstance();
