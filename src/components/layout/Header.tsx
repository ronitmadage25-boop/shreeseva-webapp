import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingCart,
  MapPin,
  ChevronDown,
  User,
  Smartphone,
  Home,
  Grid3X3,
  Tag,
  Star,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { cn } from '../../utils';

const NAV_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Categories', href: '/categories', icon: Grid3X3 },
  { label: 'Offers', href: '/offers', icon: Tag },
  { label: 'New Arrivals', href: '/new-arrivals', icon: Sparkles },
  { label: 'Best Sellers', href: '/best-sellers', icon: Star },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const cartTotal = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wishlistTotal = useWishlistStore((s) => s.totalItems());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-[#8F1028] transition-shadow w-full',
        isScrolled && 'shadow-lg'
      )}
    >
      {/* ── DESKTOP TWO-ROW HEADER (>= 768px) ───────────────────────────── */}
      <div className="hidden md:block">
        {/* Main Row */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-4 py-3">
            {/* Business Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 bg-[#FFC83D] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-5 h-5 text-[#8F1028]" strokeWidth={2.6} />
              </div>
              <div>
                <p className="text-white font-black text-sm tracking-wide leading-tight">
                  SHREE SEVA
                </p>
                <p className="text-[#FFC83D] text-[10px] font-bold tracking-wider leading-tight">
                  ENTERPRISES & READYMADE
                </p>
              </div>
            </Link>

            {/* Location Selector */}
            <button
              type="button"
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors shrink-0 ml-1 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-semibold"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FFC83D]" />
              <span>Pachora, Maharashtra</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {/* Search Input Bar */}
            <form onSubmit={handleSearch} className="flex-1 mx-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for groceries, cold drinks, stationery and more..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#FFC83D] shadow-xs"
                />
              </div>
            </form>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Wishlist */}
              <button
                onClick={() => navigate('/wishlist')}
                className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistTotal > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#FFC83D] text-[#8F1028] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistTotal > 9 ? '9+' : wishlistTotal}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartTotal > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#FFC83D] text-[#8F1028] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                    {cartTotal > 9 ? '9+' : cartTotal}
                  </span>
                )}
              </button>

              {/* Account */}
              <button
                onClick={() => navigate('/account')}
                className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-colors border border-white/10"
              >
                <div className="w-6 h-6 bg-[#FFC83D] text-[#8F1028] rounded-full flex items-center justify-center font-bold text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold">Account</span>
              </button>

              {/* Download App Button */}
              <Link
                to="/download-app"
                className="flex items-center gap-1.5 border border-white/30 hover:border-white text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors hover:bg-white/10 shadow-2xs"
              >
                <Smartphone className="w-4 h-4 text-[#FFC83D]" />
                <span>Download App</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Row (Dark Maroon) */}
        <div className="bg-[#690D20] border-t border-black/10">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
            <nav className="flex items-center gap-1 py-1">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors',
                    href === '/' && 'bg-white/15 text-white'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ── MOBILE COMPACT HEADER (< 768px) ──────────────────────────────── */}
      <div className="md:hidden w-full">
        {/* Row 1: Logo & Quick Actions */}
        <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1.5 gap-2">
          {/* Branded Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-[#FFC83D] rounded-lg flex items-center justify-center shrink-0 shadow-xs">
              <ShoppingCart className="w-4 h-4 text-[#8F1028]" strokeWidth={2.6} />
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-xs leading-tight tracking-wide truncate">
                SHREE SEVA
              </p>
              <p className="text-[#FFC83D] text-[8px] font-bold tracking-wider leading-tight truncate">
                ENTERPRISES & READYMADE
              </p>
            </div>
          </Link>

          {/* Quick Icons: Wishlist & Cart */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistTotal > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFC83D] text-[#8F1028] text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {wishlistTotal}
                </span>
              )}
            </button>
            <button
              onClick={toggleCart}
              className="relative p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartTotal > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFC83D] text-[#8F1028] text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Compact Location */}
        <div className="px-3.5 pb-1.5 flex items-center justify-between text-xs text-white/90">
          <div className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#FFC83D] shrink-0" />
            <span className="text-[11px] font-semibold text-white/95">Pachora, Maharashtra</span>
            <ChevronDown className="w-3 h-3 text-[#FFC83D]" />
          </div>
          <span className="text-[10px] text-amber-200/90 font-medium">
            Kirana & Household
          </span>
        </div>

        {/* Row 3: Full-width Search Bar */}
        <div className="px-3.5 pb-2.5">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for groceries, cold drinks..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white text-xs text-gray-800 placeholder:text-gray-400 outline-none shadow-xs focus:ring-2 focus:ring-[#FFC83D]"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
