import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatPrice, getGroceryFallbackImage } from '../../utils';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-[#8F1028] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold">My Cart ({totalItems()})</span>
          </div>
          <button onClick={closeCart} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-200" />
              <div>
                <p className="font-semibold text-gray-700">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add items to get started</p>
              </div>
              <button
                onClick={closeCart}
                className="bg-[#8F1028] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#690D20] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const price = item.selectedVariant?.price ?? item.product.price;
              const key = item.selectedVariant
                ? `${item.product.id}-${item.selectedVariant.id}`
                : item.product.id;
              return (
                <div key={key} className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white p-1 shrink-0 border border-gray-100 flex items-center justify-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = getGroceryFallbackImage(item.product.name);
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item.product.name}
                    </p>
                    {item.selectedVariant && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.selectedVariant.label}</p>
                    )}
                    <p className="text-[#8F1028] font-bold text-sm mt-1">
                      {formatPrice(price)}
                    </p>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedVariant?.id
                          )
                        }
                        className="w-6 h-6 rounded-full bg-[#8F1028]/10 text-[#8F1028] flex items-center justify-center hover:bg-[#8F1028]/20 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">
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
                        className="w-6 h-6 rounded-full bg-[#8F1028]/10 text-[#8F1028] flex items-center justify-center hover:bg-[#8F1028]/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedVariant?.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Subtotal ({totalItems()} items)</span>
              <span className="font-bold text-gray-800">{formatPrice(totalPrice())}</span>
            </div>
            <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
              🎉 You've saved on today's order!
            </p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full bg-[#8F1028] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#690D20] transition-colors"
            >
              Proceed to Checkout → {formatPrice(totalPrice())}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

