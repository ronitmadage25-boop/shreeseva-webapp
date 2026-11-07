import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { formatPrice, getGroceryFallbackImage } from '../../utils';

export function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  const addItemToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleMoveToCart = (product: any) => {
    addItemToCart(product, 1);
    removeItem(product.id);
    openCart();
  };

  const handleMoveAllToCart = () => {
    items.forEach(({ product }) => {
      addItemToCart(product, 1);
    });
    clearWishlist();
    openCart();
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 bg-[#FFF0F3] text-[#8F1028] rounded-full flex items-center justify-center border border-red-100 shadow-xs mb-2">
          <Heart className="w-10 h-10 fill-[#8F1028]/20" />
        </div>
        <h1 className="text-2xl font-black text-gray-800">Your Wishlist is Empty</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-4">
          Save your favourite daily groceries, cold drinks and stationery here to easily order them anytime.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#8F1028] text-white px-7 py-3 rounded-2xl font-black text-xs hover:bg-[#690D20] transition-colors shadow-md active:scale-95"
        >
          <span>Explore Groceries</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 md:py-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#252525]">
            My Saved Items ({items.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Items saved for quick re-ordering from Shree Seva, Pachora
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={clearWishlist}
            className="flex-1 sm:flex-initial text-xs font-bold text-gray-500 hover:text-red-600 px-3 py-2 rounded-xl border border-gray-200 hover:border-red-200 transition-colors"
          >
            Clear Wishlist
          </button>
          <button
            onClick={handleMoveAllToCart}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#8F1028] hover:bg-[#690D20] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Move All to Cart</span>
          </button>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {items.map(({ product }) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col relative group"
          >
            {/* Remove button */}
            <button
              onClick={() => removeItem(product.id)}
              className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shadow-2xs"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Product Image Link */}
            <Link
              to={`/product/${product.slug}`}
              className="relative aspect-square bg-[#FDFBF7] p-3 overflow-hidden flex items-center justify-center border-b border-gray-50 block"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getGroceryFallbackImage(product.name);
                }}
              />
            </Link>

            {/* Product Details */}
            <div className="p-3 flex flex-col flex-1">
              {product.brand && (
                <p className="text-[9px] font-bold text-[#8F1028] uppercase tracking-wider mb-0.5 truncate">
                  {product.brand}
                </p>
              )}
              <Link to={`/product/${product.slug}`}>
                <h3 className="text-xs font-bold text-gray-800 line-clamp-2 hover:text-[#8F1028] transition-colors mb-1">
                  {product.name}
                </h3>
              </Link>
              <p className="text-[11px] text-gray-400 mb-2">{product.unit}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mt-auto mb-3">
                <span className="text-sm font-black text-[#8F1028]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Move to Cart CTA */}
              <button
                onClick={() => handleMoveToCart(product)}
                disabled={product.stock <= 0}
                className="w-full flex items-center justify-center gap-1.5 bg-[#8F1028] hover:bg-[#690D20] text-white py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
