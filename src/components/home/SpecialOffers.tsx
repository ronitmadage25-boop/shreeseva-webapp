import { Link } from 'react-router-dom';
import { Tag, ArrowRight, Sparkles } from 'lucide-react';
import { allProducts } from '../../data/products';
import { formatPrice, getGroceryFallbackImage } from '../../utils';

const offers = allProducts
  .filter((p) => p.discount !== undefined && p.discount >= 10)
  .slice(0, 4);

export function SpecialOffers() {
  return (
    <section className="py-8 md:py-10 bg-[#8F1028] text-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFC83D] flex items-center justify-center text-[#8F1028] shadow-xs">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">Special Store Offers</h2>
              <p className="text-xs text-amber-200/90 font-medium hidden sm:block">
                Exclusive discounts on grocery staples, beverages and household supplies
              </p>
            </div>
          </div>
          <Link
            to="/offers"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#FFC83D] hover:text-white transition-colors"
          >
            <span>View All Offers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Offer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {offers.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-3.5 flex gap-3.5 items-center transition-all duration-200 group hover:scale-[1.01]"
            >
              {/* Product Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white p-1.5 shrink-0 shadow-xs">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = getGroceryFallbackImage(product.name);
                  }}
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm line-clamp-1 leading-tight group-hover:text-[#FFC83D] transition-colors">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[#FFC83D] font-black text-sm">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-white/60 text-xs line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="bg-[#FFC83D] text-[#8F1028] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {product.discount}% OFF
                  </span>
                  <span className="text-[10px] text-white/70">{product.unit}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Local Banner */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-white/75 text-xs text-center">
          <Sparkles className="w-3.5 h-3.5 text-[#FFC83D] shrink-0" />
          <span>Special promotional pricing applied directly at checkout. Visit our Pachora store for more in-counter deals.</span>
        </div>
      </div>
    </section>
  );
}
