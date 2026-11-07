import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, MapPin, Store, HelpCircle, ChevronRight, Sparkles, Download } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { usePWA } from '../../hooks/usePWA';
import { InstallAppModal } from '../../components/pwa/InstallAppModal';

export function AccountPage() {
  const wishlistCount = useWishlistStore((s) => s.totalItems());
  const { isInstalled, isIOS } = usePWA();
  const [showInstallModal, setShowInstallModal] = useState(false);

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/orders', desc: 'Track current order & view past grocery purchases' },
    { icon: Heart, label: 'Saved Wishlist', href: '/wishlist', desc: `${wishlistCount} items saved for re-ordering` },
    { icon: MapPin, label: 'Delivery Address', href: '/checkout', desc: 'Station Road, Pachora, Maharashtra 424201' },
    { icon: Store, label: 'Store Information', href: '/', desc: 'Shree Seva Enterprises & Readymade, Pachora' },
    { icon: HelpCircle, label: 'Customer Support', href: '/', desc: 'Counter assistance & local home delivery queries' },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Profile Card Matching Reference User */}
      <div className="bg-[#8F1028] rounded-3xl p-6 text-white mb-6 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-[#FFC83D] text-[#8F1028] rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-xl text-white">Ronit Madage</h1>
              <span className="bg-[#FFC83D] text-[#8F1028] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Customer
              </span>
            </div>
            <p className="text-white/80 text-xs mt-0.5">+91 98765 43210 • Pachora, Maharashtra</p>
            <p className="text-[11px] text-amber-200/90 mt-1 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-[#FFC83D]" /> Pachora Local Retail Account
            </p>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs divide-y divide-gray-50 overflow-hidden mb-6">
        {!isInstalled && (
          <button
            type="button"
            onClick={() => setShowInstallModal(true)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-amber-50/50 transition-colors group text-left bg-gradient-to-r from-amber-50/30 to-transparent"
          >
            <div className="w-10 h-10 bg-[#FFC83D] text-[#8F1028] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-[#8F1028] leading-snug">Install Shree Seva App</p>
                <span className="text-[10px] font-extrabold bg-[#8F1028] text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                  {isIOS ? 'iOS / Safari' : 'Fast & Free'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">Add to Home Screen for fast 1-tap grocery ordering</p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-500 group-hover:text-[#8F1028] transition-colors shrink-0" />
          </button>
        )}
        {menuItems.map(({ icon: Icon, label, href, desc }) => (
          <Link
            key={label}
            to={href}
            className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors group"
          >
            <div className="w-10 h-10 bg-[#FFF0F3] text-[#8F1028] group-hover:bg-[#8F1028] group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-800 leading-snug">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#8F1028] transition-colors" />
          </Link>
        ))}
      </div>

      {/* Store Counter Notice */}
      <div className="bg-[#FFF9EF] border border-[#FFC83D]/40 rounded-2xl p-4 text-xs text-amber-900 text-center">
        <p className="font-bold">Shree Seva Enterprises & Readymade</p>
        <p className="text-[11px] text-gray-600 mt-0.5">
          Local Retail Shop • Pachora, Dist. Jalgaon, Maharashtra 424201
        </p>
      </div>

      {/* Install PWA Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
