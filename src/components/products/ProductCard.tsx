import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatPrice, cn, getGroceryFallbackImage } from '../../utils';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const [qty, setQty] = useState(0);

  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const handleAddToCart = () => {
    setQty(1);
    addItem(product, 1);
  };

  const handleIncrease = () => {
    setQty((q) => q + 1);
    addItem(product, 1);
  };

  const handleDecrease = () => {
    if (qty <= 1) {
      setQty(0);
    } else {
      setQty((q) => q - 1);
    }
  };

  // ── List Variant (e.g. for search or cart drawer) ──────────────────────────
  if (variant === 'list') {
    return (
      <div className="flex gap-3 bg-white rounded-2xl p-3 shadow-xs border border-gray-100 hover:shadow-md transition-shadow">
        <Link
          to={`/product/${product.slug}`}
          className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50/50 shrink-0 flex items-center justify-center p-1.5 border border-gray-100 block"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = getGroceryFallbackImage(product.name);
            }}
            loading="lazy"
          />
        </Link>
        <div className="flex-1 min-w-0">
          {product.brand && (
            <p className="text-[9px] font-bold text-[#8F1028] uppercase tracking-wider mb-0.5">
              {product.brand}
            </p>
          )}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 hover:text-[#8F1028] transition-colors">{product.name}</h3>
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">{product.unit}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[#8F1028] font-bold text-sm">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-xs">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 flex items-center">
          {qty === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-[#8F1028] text-white p-2 rounded-xl hover:bg-[#690D20] transition-colors shadow-xs"
              aria-label="Add to cart"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-[#8F1028] text-white rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={handleDecrease}
                className="p-1.5 hover:bg-[#690D20] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold w-5 text-center">{qty}</span>
              <button
                onClick={handleIncrease}
                className="p-1.5 hover:bg-[#690D20] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Standard Grid Card (Matches the reference image product card) ──────────
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col hover:border-[#8F1028]/20">

      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-[#8F1028] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
          {product.discount}% OFF
        </div>
      )}

      {/* Wishlist Heart Button */}
      <button
        onClick={() => toggleItem(product)}
        className={cn(
          'absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs',
          isWishlisted
            ? 'bg-red-50 text-red-500 scale-105'
            : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
        )}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
      </button>

      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-square bg-[#FDFBF7] p-3 overflow-hidden flex items-center justify-center border-b border-gray-50 block"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = getGroceryFallbackImage(product.name);
          }}
          loading="lazy"
        />
      </Link>

      {/* Product Details Content */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Brand Tag */}
        {product.brand && (
          <p className="text-[10px] font-bold text-[#8F1028] uppercase tracking-wider mb-0.5 truncate">
            {product.brand}
          </p>
        )}

        {/* Product Title */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-1 group-hover:text-[#8F1028] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Unit / Pack Size */}
        <p className="text-[11px] font-medium text-gray-400 mb-2">{product.unit}</p>

        {/* Rating & Review Count */}
        <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
          <div className="flex items-center gap-1 bg-[#FFF9EF] border border-[#FFC83D]/40 px-1.5 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-[#FFC83D] text-[#FFC83D] shrink-0" />
            <span className="text-[11px] font-bold text-gray-800">{product.rating}</span>
          </div>
          <span className="text-[10px] text-gray-400">
            ({product.reviewCount.toLocaleString()})
          </span>
          {product.isBestSeller && (
            <span className="ml-auto text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md">
              Top Seller
            </span>
          )}
        </div>

        {/* Pricing Row */}
        <div className="flex items-baseline gap-2 mt-auto mb-3">
          <span className="text-base font-black text-[#8F1028]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Notice */}
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-[10px] text-orange-600 font-semibold mb-1.5">
            Only {product.stock} units left in store
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-[10px] text-red-500 font-semibold mb-1.5">Currently out of stock</p>
        )}

        {/* Add to Cart / Quantity Selector Button */}
        {product.stock > 0 ? (
          qty === 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 bg-[#8F1028]/10 hover:bg-[#8F1028] text-[#8F1028] hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border border-[#8F1028]/25 active:scale-95 shadow-2xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#8F1028] text-white rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={handleDecrease}
                className="px-3.5 py-2 hover:bg-[#690D20] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-sm min-w-[1.5rem] text-center">{qty}</span>
              <button
                onClick={handleIncrease}
                className="px-3.5 py-2 hover:bg-[#690D20] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        ) : (
          <button
            disabled
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}

      </div>
    </div>
  );
}
