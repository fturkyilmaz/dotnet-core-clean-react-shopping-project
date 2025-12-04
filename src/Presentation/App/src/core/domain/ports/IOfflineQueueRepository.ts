export interface IOfflineQueueRepository {
  addToQueue(action: string, payload: any): Promise<void>;
  getQueue(): Promise<any[]>;
  removeFromQueue(id: string): Promise<void>;
  clearQueue(): Promise<void>;
}
