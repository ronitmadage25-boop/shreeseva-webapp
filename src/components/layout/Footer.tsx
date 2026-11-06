import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#FFC83D] rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-[#8F1028]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">SHREE SEVA</p>
                <p className="text-[#FFC83D] text-[10px]">ENTERPRISES & READYMADE</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your trusted local kirana store online. Daily groceries, cold drinks, stationery &
              more — delivered to your doorstep.
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#FFC83D]" />
              <span>Pachora, Jalgaon District, Maharashtra — 424201</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
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
            <h3 className="text-white font-semibold mb-4">Categories</h3>
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

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-[#FFC83D] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-[#FFC83D] shrink-0" />
                <span>contact@shreeseva.in</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              {/* Social icons */}
              {(['📸', '📘', '🐦'] as const).map((emoji, i) => (
                <button
                  key={i}
                  className="w-8 h-8 bg-white/10 hover:bg-[#FFC83D] rounded-full flex items-center justify-center transition-colors text-sm"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Shree Seva Enterprises & Readymade. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((item) => (
              <Link
                key={item}
                to="#"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
