import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react';

export function AccountPage() {
  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/orders', desc: 'Track & manage your orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', desc: 'Your saved products' },
    { icon: MapPin, label: 'Saved Addresses', href: '/account/addresses', desc: 'Manage delivery addresses' },
    { icon: Settings, label: 'Settings', href: '/account/settings', desc: 'App & notification settings' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="bg-[#8F1028] rounded-2xl p-5 text-white mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-9 h-9" />
        </div>
        <div>
          <p className="font-bold text-lg">Guest User</p>
          <p className="text-white/70 text-sm">Sign in to access all features</p>
          <Link
            to="/login"
            className="inline-block mt-2 bg-[#FFC83D] text-[#8F1028] text-xs font-bold px-3 py-1 rounded-full hover:bg-yellow-300 transition-colors"
          >
            Sign In / Register
          </Link>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {menuItems.map(({ icon: Icon, label, href, desc }) => (
          <Link
            key={href}
            to={href}
            className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 bg-[#8F1028]/10 rounded-xl flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-[#8F1028]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 mt-5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}

