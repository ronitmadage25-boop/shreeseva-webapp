import { Sparkles, RefreshCw } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export function PWAUpdateNotification() {
  const { isUpdateAvailable, updateApp } = usePWA();

  if (!isUpdateAvailable) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#8F1028] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-[#FFC83D]/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 max-w-sm w-[92%] sm:w-auto">
      <div className="w-8 h-8 rounded-xl bg-[#FFC83D] text-[#8F1028] flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold leading-tight">New App Version Ready</p>
        <p className="text-[10px] text-amber-200">Tap to refresh with latest features</p>
      </div>
      <button
        onClick={updateApp}
        className="bg-[#FFC83D] hover:bg-yellow-300 text-[#8F1028] text-xs font-black px-3 py-1.5 rounded-xl transition-colors shrink-0 flex items-center gap-1 shadow-xs"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Update</span>
      </button>
    </div>
  );
}

