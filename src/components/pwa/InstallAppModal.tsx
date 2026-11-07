import { X, Download, Check, Share, PlusSquare } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallAppModal({ isOpen, onClose }: InstallAppModalProps) {
  const { isInstalled, isIOS, deferredPrompt, promptInstall } = usePWA();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-3xl z-50 shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header with App Branding */}
        <div className="bg-[#8F1028] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFC83D] p-1.5 shadow-md shrink-0 flex items-center justify-center border-2 border-white/20">
              <img
                src="/icons/icon.svg"
                alt="Shree Seva App Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#FFC83D] uppercase tracking-wider block">
                Official Web App
              </span>
              <h2 className="text-lg font-black text-white leading-tight">
                Shree Seva Enterprises
              </h2>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Fast, local grocery shopping in Pachora
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isInstalled ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-black text-gray-800 text-base mb-1">
                App Already Installed!
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Shree Seva is already installed on your device. You can open it anytime directly from your home screen or apps menu.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[#8F1028] text-white py-3 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          ) : isIOS ? (
            /* iOS Safari Instructions */
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-3">
                How to install on iPhone & iPad:
              </h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl text-xs text-gray-700 mb-5 border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    1
                  </div>
                  <p>
                    Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-blue-600" /> in Safari's bottom toolbar.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    2
                  </div>
                  <p>
                    Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-gray-700" />.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    3
                  </div>
                  <p>
                    Tap <strong>Add</strong> in the top right corner. The Shree Seva app icon will appear on your home screen!
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-[#8F1028] text-white py-3 rounded-xl font-bold text-xs"
              >
                Got It
              </button>
            </div>
          ) : (
            /* Android / Desktop Chrome / Edge Install */
            <div>
              <div className="space-y-2.5 mb-5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>1-Tap ordering from your home screen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Works faster and uses less mobile data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>No Play Store or App Store login required</span>
                </div>
              </div>

              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 bg-[#8F1028] hover:bg-[#690D20] text-white py-3.5 rounded-2xl font-black text-xs transition-colors shadow-md active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#FFC83D]" />
                  <span>Install Shree Seva App</span>
                </button>
              ) : (
                <div className="bg-amber-50 border border-amber-200/60 p-3.5 rounded-2xl text-xs text-amber-900 mb-3">
                  <p className="font-semibold mb-1">To install manually:</p>
                  <p>
                    Click the <strong>Install</strong> or <strong>Add to Home Screen</strong> icon in your browser's address bar.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
