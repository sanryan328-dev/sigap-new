import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import {
  getPendingItems,
  markAsSyncing,
  removeItem,
  getPendingCount,
} from '../utils/dbLocal';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const refreshCount = useCallback(async () => {
    const c = await getPendingCount();
    setPendingCount(c);
  }, []);

  const syncNow = useCallback(async () => {
    if (!navigator.onLine) return;
    setSyncing(true);
    try {
      const items = await getPendingItems();
      for (const item of items) {
        if (!item.id) continue;
        await markAsSyncing(item.id);
        try {
          const { error } = await supabase
            .from(item.table_name as any)
            .insert(item.payload as any);
          if (error) throw error;
          await removeItem(item.id);
        } catch (err: any) {
          console.error(`Sync failed for ${item.table_name}:`, err);
        }
      }
      await refreshCount();
    } finally {
      setSyncing(false);
    }
  }, [refreshCount]);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  useEffect(() => {
    const onOnline = async () => {
      setIsOnline(true);
      await syncNow();
    };
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [syncNow]);

  return { isOnline, pendingCount, syncing, syncNow, refreshCount };
}
