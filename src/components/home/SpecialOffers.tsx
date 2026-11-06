import { Link } from 'react-router-dom';
import { Tag, ArrowRight, Clock } from 'lucide-react';
import { allProducts } from '../../data/products';
import { formatPrice } from '../../utils';

const offers = allProducts
  .filter((p) => p.discount !== undefined && p.discount >= 10)
  .slice(0, 4);

export function SpecialOffers() {
  return (
    <section className="py-8 bg-[#8F1028]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#FFC83D]" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Special Offers</h2>
          </div>
          <Link
            to="/offers"
            className="flex items-center gap-1 text-sm font-semibold text-[#FFC83D] hover:underline"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Offer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-4 flex gap-3 items-center transition-colors group"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm line-clamp-2 leading-tight">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[#FFC83D] font-bold">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-white/60 text-xs line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="inline-block mt-1 bg-[#FFC83D] text-[#8F1028] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {product.discount}% OFF
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Timer Badge */}
        <div className="mt-5 flex items-center justify-center gap-2 text-white/70 text-sm">
          <Clock className="w-4 h-4" />
          <span>Limited time offers — Order now to save!</span>
        </div>
      </div>
    </section>
  );
}

