import { useSyncExternalStore } from 'react';

function getOnlineStatus() {
  return navigator.onLine;
}

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export default function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getOnlineStatus, () => true);
}
