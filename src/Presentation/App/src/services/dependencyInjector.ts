import { IProductRepository } from '../core/domain/ports/IProductRepository';
import { IAuthService } from '../core/domain/ports/IAuthService';
import { IAnalyticsService } from '../core/domain/ports/IAnalyticsService';
import { IOfflineQueueRepository } from '../core/domain/ports/IOfflineQueueRepository';

import { ProductAPIRepository } from '../infrastructure/persistence/ProductAPIRepository';
import { LocalStorageRepository } from '../infrastructure/persistence/LocalStorageRepository';
import { AnalyticsService } from '../infrastructure/services/AnalyticsService';
// import { AuthService } from '../infrastructure/services/AuthService'; // To be implemented or migrated

// Singleton instances
export const productRepository: IProductRepository = new ProductAPIRepository();
export const offlineRepository: IOfflineQueueRepository = new LocalStorageRepository();
export const analyticsService: IAnalyticsService = AnalyticsService.getInstance();
// export const authService: IAuthService = new AuthService(); // Placeholder

// Export a container object if needed
export const DIContainer = {
  productRepository,
  offlineRepository,
  analyticsService,
  // authService,
};
