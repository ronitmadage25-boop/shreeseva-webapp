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
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        'sticky top-0 z-50 bg-[#8F1028] transition-shadow',
        isScrolled && 'shadow-lg'
      )}
    >
      {/* ── Desktop Top Bar ─────────────────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-4 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-[#FFC83D] rounded-lg flex items-center justify-center shadow">
                <ShoppingCart className="w-5 h-5 text-[#8F1028]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight tracking-wide">
                  SHREE SEVA
                </p>
                <p className="text-[#FFC83D] text-[10px] leading-tight font-medium tracking-wide">
                  ENTERPRISES & READYMADE
                </p>
              </div>
            </Link>

            {/* Location */}
            <button className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors shrink-0 ml-1">
              <MapPin className="w-4 h-4 text-[#FFC83D]" />
              <span className="text-sm font-medium">Pachora, Maharashtra</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 mx-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for groceries, cold drinks, stationery and more..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#FFC83D]"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/wishlist')}
                className="relative flex items-center gap-1 text-white/90 hover:text-white transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistTotal > 0 && (
                  <span className="absolute -top-2 -right-2 w-4.5 h-4.5 bg-[#FFC83D] text-[#8F1028] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistTotal > 9 ? '9+' : wishlistTotal}
                  </span>
                )}
              </button>

              <button
                onClick={toggleCart}
                className="relative flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartTotal > 0 && (
                  <span className="absolute -top-2 -right-2 w-4.5 h-4.5 bg-[#FFC83D] text-[#8F1028] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartTotal > 9 ? '9+' : cartTotal}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/account')}
                className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Hi, Guest</span>
              </button>

              <Link
                to="/download-app"
                className="flex items-center gap-1.5 border border-white/40 hover:border-white text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
              >
                <Smartphone className="w-4 h-4" />
                Download App
              </Link>
            </div>
          </div>
        </div>

        {/* Nav Bar */}
        <div className="bg-[#690D20]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors',
                    href === '/' && 'bg-white/15 text-white'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ── Mobile Header ────────────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-1"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-1">
            <div className="w-7 h-7 bg-[#FFC83D] rounded-md flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-[#8F1028]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white font-bold text-xs leading-tight">SHREE SEVA</p>
              <p className="text-[#FFC83D] text-[9px] leading-tight">ENTERPRISES & READYMADE</p>
            </div>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button className="text-white relative" onClick={() => navigate('/wishlist')}>
              <Heart className="w-5 h-5" />
              {wishlistTotal > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FFC83D] text-[#8F1028] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistTotal}
                </span>
              )}
            </button>
            <button className="text-white relative" onClick={toggleCart}>
              <ShoppingCart className="w-5 h-5" />
              {cartTotal > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FFC83D] text-[#8F1028] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Location + Search */}
        <div className="px-3 pb-2.5 space-y-2">
          <button className="flex items-center gap-1 text-white/90 text-sm">
            <MapPin className="w-3.5 h-3.5 text-[#FFC83D]" />
            <span className="font-medium">Pachora, Maharashtra</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groceries, cold drinks..."
                className="w-full pl-8 pr-4 py-2 rounded-lg bg-white text-sm placeholder:text-gray-400 outline-none"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="bg-[#690D20] border-t border-white/10">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10 transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

