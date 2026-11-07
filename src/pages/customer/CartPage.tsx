import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatPrice, getGroceryFallbackImage } from '../../utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore();

  const totalOriginalPrice = items.reduce((sum, item) => {
    const orig = item.selectedVariant?.originalPrice ?? item.product.originalPrice ?? item.product.price;
    return sum + orig * item.quantity;
  }, 0);

  const totalSavings = Math.max(0, totalOriginalPrice - totalPrice());

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 bg-[#FFF0F3] text-[#8F1028] rounded-full flex items-center justify-center border border-red-100 shadow-xs mb-2">
          <ShoppingBag className="w-10 h-10 text-[#8F1028]" />
        </div>
        <h1 className="text-2xl font-black text-gray-800">Your Shopping Cart is Empty</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-4">
          Your cart currently has no groceries or household items. Browse our categories to start shopping.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#8F1028] text-white px-7 py-3 rounded-2xl font-black text-xs hover:bg-[#690D20] transition-colors shadow-md active:scale-95"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 md:py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#252525]">
            Shopping Cart ({totalItems()} items)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Local delivery from Shree Seva Enterprises & Readymade, Pachora
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors py-1.5 px-3 rounded-lg border border-gray-200 hover:border-red-200"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Items List (2 cols) */}
        <div className="lg:col-span-2 space-y-3.5">
          {items.map((item) => {
            const price = item.selectedVariant?.price ?? item.product.price;
            const origPrice = item.selectedVariant?.originalPrice ?? item.product.originalPrice;
            const maxStock = item.selectedVariant ? (item.selectedVariant.stock || 10) : (item.product.stock || 10);
            const key = item.selectedVariant
              ? `${item.product.id}-${item.selectedVariant.id}`
              : item.product.id;

            return (
              <div
                key={key}
                className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md p-4 sm:p-5 flex gap-4 transition-all"
              >
                {/* Product Thumbnail */}
                <Link
                  to={`/product/${item.product.slug}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FDFBF7] p-2 shrink-0 border border-gray-100 flex items-center justify-center block"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getGroceryFallbackImage(item.product.name);
                    }}
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {item.product.brand && (
                      <p className="text-[10px] font-bold text-[#8F1028] uppercase tracking-wider mb-0.5 truncate">
                        {item.product.brand}
                      </p>
                    )}
                    <Link to={`/product/${item.product.slug}`}>
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-snug line-clamp-1 hover:text-[#8F1028] transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.selectedVariant?.label || item.product.unit}
                    </p>
                  </div>

                  {/* Pricing and Stepper */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-50 flex-wrap">
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-base sm:text-lg text-[#8F1028]">
                        {formatPrice(price * item.quantity)}
                      </span>
                      {origPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(origPrice * item.quantity)}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">
                        ({formatPrice(price)} / unit)
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedVariant?.id
                          )
                        }
                        className="px-2.5 py-1.5 hover:bg-gray-100 text-[#8F1028] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-black text-xs sm:text-sm w-7 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedVariant?.id
                          )
                        }
                        disabled={item.quantity >= maxStock}
                        className="px-2.5 py-1.5 hover:bg-gray-100 text-[#8F1028] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Trash Button */}
                <button
                  onClick={() => removeItem(item.product.id, item.selectedVariant?.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1 self-start"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {/* Delivery & Assurance Note */}
          <div className="bg-[#FFF9EF] border border-[#FFC83D]/40 rounded-2xl p-4 flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#8F1028] shrink-0" />
            <p className="text-xs text-gray-700">
              Free home delivery across Pachora on orders above ₹199. Store pickup is always completely free.
            </p>
          </div>
        </div>

        {/* Order Summary Sidebar (1 col) */}
        <div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-black text-gray-900 text-lg mb-4 pb-3 border-b border-gray-100">
              Bill Details
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal ({totalItems()} items)</span>
                <span className="font-semibold text-gray-800">{formatPrice(totalPrice())}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-green-700 bg-green-50 px-2 py-1.5 rounded-lg font-bold">
                  <span>Product Savings</span>
                  <span>- {formatPrice(totalSavings)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Pachora Delivery Charge</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Store Handling & Packing</span>
                <span className="font-semibold text-gray-800">FREE</span>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-base text-gray-900">
                <span>To Pay</span>
                <span className="text-xl text-[#8F1028]">{formatPrice(totalPrice())}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full text-center bg-[#8F1028] text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm mt-6 hover:bg-[#690D20] transition-colors shadow-md active:scale-98"
            >
              Proceed to Checkout → {formatPrice(totalPrice())}
            </Link>

            <Link
              to="/"
              className="block w-full text-center text-xs font-bold text-gray-500 mt-4 hover:text-[#8F1028] transition-colors"
            >
              ← Continue Shopping
            </Link>

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Safe & Secure Local Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
