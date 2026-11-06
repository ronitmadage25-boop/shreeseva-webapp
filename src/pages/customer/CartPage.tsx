import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-5 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200" />
        <h1 className="text-xl font-bold text-gray-700">Your cart is empty</h1>
        <p className="text-sm text-gray-400">Add some products to get started.</p>
        <Link
          to="/"
          className="bg-[#8F1028] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#690D20] transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
      <h1 className="text-2xl font-bold text-[#252525] mb-6">My Cart ({totalItems()})</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const price = item.selectedVariant?.price ?? item.product.price;
            const key = item.selectedVariant
              ? `${item.product.id}-${item.selectedVariant.id}`
              : item.product.id;
            return (
              <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 leading-snug">{item.product.name}</p>
                  {item.selectedVariant && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.selectedVariant.label}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)
                        }
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#8F1028]" />
                      </button>
                      <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)
                        }
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#8F1028]" />
                      </button>
                    </div>
                    <span className="font-black text-[#8F1028]">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product.id, item.selectedVariant?.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1 self-start"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems()} items)</span>
                <span className="font-semibold">{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800 text-base">
                <span>Total</span>
                <span className="text-[#8F1028]">{formatPrice(totalPrice())}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center bg-[#8F1028] text-white py-3 rounded-xl font-semibold mt-5 hover:bg-[#690D20] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/"
              className="block w-full text-center text-sm text-gray-500 mt-3 hover:text-[#8F1028] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

