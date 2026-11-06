import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="md:hidden px-3 py-3">
      <div className="bg-[#FFC83D] rounded-2xl overflow-hidden relative">
        <div className="flex items-center gap-3 p-4 pr-32">
          <div>
            <p className="font-bold text-[#8F1028] text-sm leading-tight">Daily Groceries</p>
            <p className="font-black text-[#252525] text-base leading-tight">at Your Doorstep</p>
            <p className="text-xs text-gray-700 mt-1">Kirana | Cold Drinks | Stationery</p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 bg-[#8F1028] text-white text-xs font-semibold px-3 py-1.5 rounded-lg mt-2 hover:bg-[#690D20] transition-colors"
            >
              Shop Now <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        {/* Decorative product images */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md bg-white">
            <img
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md bg-white">
            <img
              src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=100&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

