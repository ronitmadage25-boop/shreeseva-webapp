import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin, Store, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 mt-12 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Address */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#FFC83D] rounded-lg flex items-center justify-center shadow">
                <ShoppingCart className="w-5 h-5 text-[#8F1028]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white font-black text-sm leading-tight tracking-wide">SHREE SEVA</p>
                <p className="text-[#FFC83D] text-[10px] font-bold tracking-wider">ENTERPRISES & READYMADE</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your trusted local kirana store in Pachora. Daily groceries, cold drinks, stationery & household essentials — ordered easily and fulfilled locally.
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#FFC83D]" />
              <span>Pachora, Jalgaon District, Maharashtra — 424201</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                ['Home', '/'],
                ['Shop by Category', '/categories'],
                ['Best Sellers', '/best-sellers'],
                ['Offers & Deals', '/offers'],
                ['New Arrivals', '/new-arrivals'],
                ['Track Order', '/track-order'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-gray-400 hover:text-[#FFC83D] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {[
                ['Kirana & Groceries', '/categories/kirana-groceries'],
                ['Cold Drinks & Beverages', '/categories/cold-drinks-beverages'],
                ['General Stationery', '/categories/general-stationery'],
                ['Personal Care', '/categories/personal-care'],
                ['Home Cleaning', '/categories/home-cleaning'],
                ['Snacks & Confectionery', '/categories/snacks-confectionery'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-gray-400 hover:text-[#FFC83D] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Information (No fabricated contacts) */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Store Counter</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Store className="w-4 h-4 text-[#FFC83D] shrink-0 mt-0.5" />
                <span>Single-owner local retail store serving residents across Pachora.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-[#FFC83D] shrink-0 mt-0.5" />
                <span>Open for store pickup and counter sales during local market retail hours.</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-gray-400 leading-relaxed">
              <span className="text-[#FFC83D] font-bold block mb-1">Local Business Note:</span>
              Verified contact numbers and WhatsApp direct ordering will be enabled upon official store launch.
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Shree Seva Enterprises & Readymade. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            {['Privacy Policy', 'Terms of Service', 'Store Policy'].map((item) => (
              <span key={item} className="hover:text-gray-300 transition-colors cursor-pointer">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
