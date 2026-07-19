import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import useOnlineStatus from '../hooks/useOnlineStatus';

interface OnlineStatusProps {
  pendingCount?: number;
  onSyncNow?: () => void;
  syncing?: boolean;
}

export default function OnlineStatus({ pendingCount = 0, onSyncNow, syncing = false }: OnlineStatusProps) {
  const online = useOnlineStatus();

  if (online && pendingCount === 0) {
    return (
      <span className="badge badge-soft badge-success badge-xs gap-1">
        <Wifi className="size-2.5" />
        Online
      </span>
    );
  }

  if (online && pendingCount > 0) {
    return (
      <span className="badge badge-soft badge-warning badge-xs gap-1">
        <RefreshCw className={`size-2.5 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Menyinkronkan...' : `${pendingCount} antrean`}
      </span>
    );
  }

  return (
    <span className="badge badge-soft badge-error badge-xs gap-1">
      <WifiOff className="size-2.5" />
      Offline (Data Disimpan Lokal)
    </span>
  );
}
