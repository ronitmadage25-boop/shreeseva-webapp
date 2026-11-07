import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import { InstallAppModal } from './InstallAppModal';

export function InstallBanner() {
  const { isInstalled, deferredPrompt, isIOS } = usePWA();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user dismissed today
    const dismissedAt = localStorage.getItem('shree_seva_pwa_dismissed');
    if (dismissedAt) {
      const diffHours = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
      if (diffHours < 24) {
        setIsDismissed(true);
      }
    }
  }, []);

  // Do not show if installed, dismissed within 24h, or not eligible
  if (isInstalled || isDismissed) {
    return null;
  }

  // Only show on mobile or when prompt available
  const canShow = Boolean(deferredPrompt || isIOS);
  if (!canShow) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('shree_seva_pwa_dismissed', Date.now().toString());
  };

  return (
    <>
      <div className="bg-[#8F1028] text-white px-4 py-2.5 border-b border-[#FFC83D]/20 shadow-xs flex items-center justify-between gap-3 text-xs relative z-40">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/icons/icon-192x192.png"
            alt="Shree Seva App"
            className="w-8 h-8 rounded-lg object-contain shrink-0 shadow-xs border border-white/20"
          />
          <div className="min-w-0">
            <p className="font-bold text-white truncate text-[11px] leading-tight">
              Install Shree Seva App
            </p>
            <p className="text-[#FFC83D] text-[10px] truncate leading-tight mt-0.5">
              1-Tap grocery ordering from your home screen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#FFC83D] hover:bg-[#ffbe1a] text-[#8F1028] font-black px-3 py-1.5 rounded-lg text-[11px] transition-transform active:scale-95 shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/60 hover:text-white p-1 rounded-md transition-colors"
            title="Not Now"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <InstallAppModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

