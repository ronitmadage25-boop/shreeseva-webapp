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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-bottom md:hidden">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map(({ label, href, icon: Icon, isCart }) => {
          const isActive = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2 px-3 relative min-w-0',
                isActive ? 'text-[#8F1028]' : 'text-gray-500'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5',
                    isActive ? 'text-[#8F1028]' : 'text-gray-500'
                  )}
                />
                {isCart && cartTotal > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#8F1028] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartTotal > 9 ? '9+' : cartTotal}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px] font-medium', isActive ? 'text-[#8F1028]' : 'text-gray-500')}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#8F1028] rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

