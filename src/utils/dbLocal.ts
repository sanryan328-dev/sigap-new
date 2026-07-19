import Dexie, { type Table } from 'dexie';

export interface OfflineItem {
  id?: number;
  user_id: string;
  table_name: string;
  payload: Record<string, unknown>;
  status_sync: 'pending' | 'syncing' | 'failed';
  error_message?: string;
  created_at: string;
}

class LocalDB extends Dexie {
  offline_queue!: Table<OfflineItem, number>;

  constructor() {
    super('SigapOfflineDB');
    this.version(1).stores({
      offline_queue: '++id, user_id, status_sync, created_at',
    });
  }
}

const db = new LocalDB();

export async function addToOfflineQueue(
  user_id: string,
  table_name: string,
  payload: Record<string, unknown>,
) {
  return db.offline_queue.add({
    user_id,
    table_name,
    payload,
    status_sync: 'pending',
    created_at: new Date().toISOString(),
  });
}

export async function getPendingItems(): Promise<OfflineItem[]> {
  return db.offline_queue.where('status_sync').equals('pending').toArray();
}

export async function markAsSyncing(id: number) {
  return db.offline_queue.update(id, { status_sync: 'syncing' });
}

export async function markAsFailed(id: number, error: string) {
  return db.offline_queue.update(id, { status_sync: 'failed', error_message: error });
}

export async function removeItem(id: number) {
  return db.offline_queue.delete(id);
}

export async function getPendingCount(): Promise<number> {
  return db.offline_queue.where('status_sync').equals('pending').count();
}

export async function clearAllSynced() {
  return db.offline_queue.where('status_sync').equals('syncing').delete();
}

export default db;
