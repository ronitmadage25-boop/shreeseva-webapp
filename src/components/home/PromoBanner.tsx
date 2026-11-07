import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getGroceryFallbackImage } from '../../utils';

export function PromoBanner() {
  return (
    <section className="md:hidden px-3.5 py-3 w-full">
      <div className="bg-[#FFC83D] rounded-2xl overflow-hidden shadow-xs relative border border-amber-300/60">
        <div className="flex items-center justify-between p-4 gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-[#8F1028] uppercase tracking-wider block">
              Daily Essentials
            </span>
            <p className="font-black text-[#252525] text-base leading-tight mt-0.5">
              Groceries at Your Doorstep
            </p>
            <p className="text-[11px] text-gray-800 font-medium mt-1">
              Kirana • Cold Drinks • Stationery
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 bg-[#8F1028] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl mt-2.5 hover:bg-[#690D20] active:scale-95 transition-all shadow-xs"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Decorative grocery previews */}
          <div className="flex gap-1.5 shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs bg-white p-1 border border-amber-200">
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&q=80"
                alt="Atta Flour"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = getGroceryFallbackImage('Atta');
                }}
                loading="lazy"
              />
            </div>
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs bg-white p-1 border border-amber-200">
              <img
                src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&q=80"
                alt="Cold Drinks"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = getGroceryFallbackImage('Cold Drinks');
                }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
