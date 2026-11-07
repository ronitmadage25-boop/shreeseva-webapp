import { WifiOff } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export function OfflineBanner() {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="bg-amber-800 text-white px-4 py-1.5 text-center text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50">
      <WifiOff className="w-3.5 h-3.5 text-amber-300" />
      <span>You are browsing offline. Showing cached catalog. Connect to the internet to place orders.</span>
    </div>
  );
}

