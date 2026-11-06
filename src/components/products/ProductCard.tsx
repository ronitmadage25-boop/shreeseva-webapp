import { useState } from 'react';
import { Heart, ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatPrice, cn } from '../../utils';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const [qty, setQty] = useState(0);
  const [imgError, setImgError] = useState(false);

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

  if (variant === 'list') {
    return (
      <div className="flex gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
          <img
            src={imgError ? 'https://placehold.co/80x80/f9fafb/d1d5db?text=Product' : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{product.unit}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#8F1028] font-bold text-sm">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-xs">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
        <div className="shrink-0 flex items-center">
          {qty === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-[#8F1028] text-white p-2 rounded-lg hover:bg-[#690D20] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-[#8F1028] text-white rounded-lg overflow-hidden">
              <button onClick={handleDecrease} className="p-1.5 hover:bg-[#690D20] transition-colors">
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold w-5 text-center">{qty}</span>
              <button onClick={handleIncrease} className="p-1.5 hover:bg-[#690D20] transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-2 left-2 z-10 bg-[#8F1028] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {product.discount}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => toggleItem(product)}
        className={cn(
          'absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-sm',
          isWishlisted
            ? 'bg-red-50 text-red-500'
            : 'bg-white/80 text-gray-400 hover:text-red-400 hover:bg-red-50'
        )}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={cn('w-3.5 h-3.5', isWishlisted && 'fill-current')} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={imgError ? 'https://placehold.co/300x300/f9fafb/d1d5db?text=Product' : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] font-semibold text-[#8F1028] uppercase tracking-wide mb-0.5">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Unit */}
        <p className="text-xs text-gray-400 mb-2">{product.unit}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-[#FFC83D] text-[#FFC83D]" />
            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
          </div>
          <span className="text-[10px] text-gray-400">({product.reviewCount.toLocaleString()})</span>
          {product.isBestSeller && (
            <span className="ml-auto text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full">
              Best Seller
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 mt-auto mb-3">
          <span className="text-base font-black text-[#8F1028]">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Stock */}
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-[10px] text-orange-500 font-medium mb-1.5">
            Only {product.stock} left!
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-[10px] text-red-500 font-medium mb-1.5">Out of stock</p>
        )}

        {/* Add to Cart */}
        {product.stock > 0 ? (
          qty === 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 bg-[#8F1028]/10 hover:bg-[#8F1028] text-[#8F1028] hover:text-white py-2 rounded-xl text-sm font-semibold transition-all duration-200 border border-[#8F1028]/20"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#8F1028] text-white rounded-xl overflow-hidden">
              <button
                onClick={handleDecrease}
                className="px-3 py-2 hover:bg-[#690D20] transition-colors font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm">{qty}</span>
              <button
                onClick={handleIncrease}
                className="px-3 py-2 hover:bg-[#690D20] transition-colors font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        ) : (
          <button
            disabled
            className="w-full py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}

