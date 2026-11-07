import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingCart, Package, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { cn } from '../../utils';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Categories', href: '/categories', icon: Grid3X3 },
  { label: 'Cart', href: '/cart', icon: ShoppingCart, isCart: true },
  { label: 'Orders', href: '/orders', icon: Package },
  { label: 'Account', href: '/account', icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const cartTotal = useCartStore((s) => s.totalItems());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 safe-bottom md:hidden shadow-lg">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon, isCart }) => {
          const isActive =
            href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 relative min-w-0 transition-colors',
                isActive ? 'text-[#8F1028]' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive ? 'text-[#8F1028] scale-110' : 'text-gray-500'
                  )}
                  strokeWidth={isActive ? 2.4 : 1.9}
                />
                {isCart && cartTotal > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-[#8F1028] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                    {cartTotal > 9 ? '9+' : cartTotal}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-bold mt-0.5 tracking-tight transition-colors',
                  isActive ? 'text-[#8F1028]' : 'text-gray-500'
                )}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#8F1028] rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
