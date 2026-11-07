import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Zap, 
  Truck, 
  Store, 
  ShieldCheck, 
  Check,
  Package,
  Layers
} from 'lucide-react';
import { allProducts, getFrequentlyBoughtTogether } from '../../data/products';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatPrice, cn, getGroceryFallbackImage } from '../../utils';
import { ProductCard } from '../../components/products/ProductCard';
import type { ProductVariant } from '../../types';

export function ProductDetailPage() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const identifier = slug || id;

  // Find product by id or slug
  const product = useMemo(() => {
    return allProducts.find((p) => p.slug === identifier || p.id === identifier);
  }, [identifier]);

  // If not found
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-[#FFF9EF] text-[#8F1028] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-[#FFC83D]/40">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The requested grocery item is unavailable or does not exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#8F1028] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#690D20] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Store
        </Link>
      </div>
    );
  }

  // Active Variant State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.find((v) => v.label.toLowerCase() === product.unit.toLowerCase()) || product.variants[0];
    }
    return undefined;
  });

  // Quantity State
  const [quantity, setQuantity] = useState(1);

  // Active Image State
  const [activeImage, setActiveImage] = useState(product.images[0]);

  // Copied alert for share
  const [copied, setCopied] = useState(false);

  // Stores
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  // Current calculated price
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const currentDiscount = currentOriginalPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : product.discount;

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Handlers
  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedVariant);
    navigate('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - Shree Seva Enterprises`,
          text: `Check out ${product.name} on Shree Seva Enterprises & Readymade, Pachora!`,
          url: window.location.href,
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Frequently Bought Together Combo
  const comboItems = useMemo(() => {
    return getFrequentlyBoughtTogether(product);
  }, [product]);

  const comboTotalPrice = useMemo(() => {
    const itemsTotal = comboItems.reduce((sum, item) => sum + item.price, 0);
    return currentPrice + itemsTotal;
  }, [comboItems, currentPrice]);

  const handleAddComboToCart = () => {
    addItem(product, 1, selectedVariant);
    comboItems.forEach((item) => addItem(item, 1));
    openCart();
  };

  // Related products from the same category
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-24 md:pb-12">
      {/* Top Mobile Bar / Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 md:static z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#8F1028] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Breadcrumbs for desktop */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-[#8F1028]">Home</Link>
            <span>/</span>
            <Link to={`/categories/${product.category}`} className="hover:text-[#8F1028] capitalize">
              {product.category.split('-').join(' ')}
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>

          {/* Right Actions: Wishlist + Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleItem(product)}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all border',
                isWishlisted
                  ? 'bg-red-50 text-red-500 border-red-200'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-red-500'
              )}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
            </button>

            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#8F1028] flex items-center justify-center transition-colors relative"
              aria-label="Share product"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              {copied && (
                <span className="absolute -bottom-8 right-0 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
          
          {/* ── Left Column: Product Gallery ── */}
          <div className="md:col-span-6 flex flex-col-reverse sm:flex-row gap-3">
            {/* Thumbnail list */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-2 shrink-0 overflow-x-auto sm:overflow-y-auto max-h-[380px] p-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      'w-14 h-14 rounded-xl border-2 p-1 bg-[#FDFBF7] flex items-center justify-center transition-all shrink-0',
                      activeImage === img ? 'border-[#8F1028] shadow-xs' : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getGroceryFallbackImage(product.name);
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 aspect-square bg-[#FDFBF7] rounded-3xl border border-gray-100 p-6 flex items-center justify-center relative overflow-hidden shadow-xs">
              {currentDiscount && currentDiscount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-[#8F1028] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                  {currentDiscount}% OFF
                </div>
              )}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getGroceryFallbackImage(product.name);
                }}
              />
            </div>
          </div>

          {/* ── Right Column: Product Information & Purchase Controls ── */}
          <div className="md:col-span-6 flex flex-col justify-start">
            
            {/* Brand Name */}
            {product.brand && (
              <span className="text-xs font-bold text-[#8F1028] uppercase tracking-wider mb-1">
                {product.brand}
              </span>
            )}

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-2">
              {product.name} {selectedVariant ? `(${selectedVariant.label})` : `(${product.unit})`}
            </h1>

            {/* Rating & Review Counter */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-[#FFF9EF] border border-[#FFC83D]/50 px-2 py-0.5 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-[#FFC83D] text-[#FFC83D]" />
                <span className="text-xs font-black text-gray-800">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({product.reviewCount.toLocaleString()} Verified Customer Ratings)
              </span>
              {product.isBestSeller && (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Best Seller
                </span>
              )}
            </div>

            {/* Pricing Details */}
            <div className="flex items-baseline gap-3 pb-4 mb-4 border-b border-gray-100">
              <span className="text-3xl font-black text-[#8F1028]">
                {formatPrice(currentPrice)}
              </span>
              {currentOriginalPrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(currentOriginalPrice)}
                </span>
              )}
              {currentDiscount && currentDiscount > 0 && (
                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                  Save {formatPrice(currentOriginalPrice! - currentPrice)} ({currentDiscount}% OFF)
                </span>
              )}
            </div>

            {/* Pack Size / Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Select Pack Size / Weight:
                  </label>
                  <span className="text-xs text-[#8F1028] font-semibold">
                    {selectedVariant?.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          'px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-0.5',
                          isSelected
                            ? 'border-[#8F1028] bg-[#FFF0F3] text-[#8F1028] shadow-xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        )}
                      >
                        <span>{v.label}</span>
                        <span className="text-[10px] font-normal text-gray-500">{formatPrice(v.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Status */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-black text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    disabled={quantity >= currentStock}
                    className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs">
                  {currentStock > 0 ? (
                    currentStock < 10 ? (
                      <span className="text-orange-600 font-bold">Only {currentStock} packs left in store</span>
                    ) : (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> In Stock at Pachora Store
                      </span>
                    )
                  ) : (
                    <span className="text-red-500 font-bold">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons: Add to Cart & Buy Now */}
            <div className="hidden sm:grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="flex items-center justify-center gap-2 border-2 border-[#8F1028] text-[#8F1028] hover:bg-[#8F1028] hover:text-white py-3.5 rounded-2xl font-black text-sm transition-all duration-200 shadow-2xs active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={currentStock <= 0}
                className="flex items-center justify-center gap-2 bg-[#8F1028] hover:bg-[#690D20] text-white py-3.5 rounded-2xl font-black text-sm transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </button>
            </div>

            {/* Store & Local Fulfillment Highlights */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Store className="w-4 h-4 text-[#8F1028] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Store Pickup Available</p>
                  <p className="text-[11px] text-gray-500">Pick up ready order in 30 mins at Shree Seva, Pachora</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t border-gray-50 pt-2">
                <Truck className="w-4 h-4 text-[#8F1028] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Local Pachora Home Delivery</p>
                  <p className="text-[11px] text-gray-500">Direct delivery to your doorstep in Pachora & nearby areas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t border-gray-50 pt-2">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800">100% Genuine & Fresh Stock</p>
                  <p className="text-[11px] text-gray-500">Authentic packaging sourced directly from authorized FMCG distributors</p>
                </div>
              </div>
            </div>

            {/* Product Specifications Table */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                Product Specifications
              </h3>
              <div className="divide-y divide-gray-50 text-xs">
                <div className="py-1.5 flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="font-semibold text-gray-800 capitalize">{product.category.replace('-', ' ')}</span>
                </div>
                {product.subcategory && (
                  <div className="py-1.5 flex justify-between">
                    <span className="text-gray-400">Subcategory</span>
                    <span className="font-semibold text-gray-800 capitalize">{product.subcategory.replace('-', ' ')}</span>
                  </div>
                )}
                {product.brand && (
                  <div className="py-1.5 flex justify-between">
                    <span className="text-gray-400">Brand</span>
                    <span className="font-semibold text-gray-800">{product.brand}</span>
                  </div>
                )}
                <div className="py-1.5 flex justify-between">
                  <span className="text-gray-400">Unit / Pack Size</span>
                  <span className="font-semibold text-gray-800">{selectedVariant?.label || product.unit}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-gray-400">Dispatch Location</span>
                  <span className="font-semibold text-[#8F1028]">Shree Seva Counter, Pachora</span>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Product Details
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-50">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Frequently Bought Together Combo Section ── */}
        {comboItems.length > 0 && (
          <div className="mt-12 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#8F1028]" />
              <h2 className="text-base sm:text-lg font-black text-gray-900">
                Frequently Bought Together
              </h2>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
              {/* Product thumbnails row */}
              <div className="flex items-center flex-wrap gap-3">
                {/* Current Product */}
                <div className="w-20 h-20 bg-[#FDFBF7] rounded-2xl border border-gray-100 p-2 flex flex-col items-center justify-center text-center">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-[10px] font-bold text-gray-800 truncate w-full mt-1">
                    {product.name}
                  </span>
                </div>

                {comboItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="text-lg font-black text-gray-300">+</span>
                    <div className="w-20 h-20 bg-[#FDFBF7] rounded-2xl border border-gray-100 p-2 flex flex-col items-center justify-center text-center">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getGroceryFallbackImage(item.name);
                        }}
                      />
                      <span className="text-[10px] font-bold text-gray-800 truncate w-full mt-1">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Combo Pricing & Action */}
              <div className="flex items-center gap-4 bg-amber-50/50 border border-amber-200/50 p-4 rounded-2xl w-full lg:w-auto justify-between lg:justify-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Combo Total ({comboItems.length + 1} items):</p>
                  <p className="text-xl font-black text-[#8F1028]">
                    {formatPrice(comboTotalPrice)}
                  </p>
                </div>
                <button
                  onClick={handleAddComboToCart}
                  className="bg-[#8F1028] hover:bg-[#690D20] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 shadow-xs"
                >
                  Add Combo to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Related Products Section ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-black text-gray-900">
                Related Grocery Products
              </h2>
              <Link
                to={`/categories/${product.category}`}
                className="text-xs font-bold text-[#8F1028] hover:underline"
              >
                View Category →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Sticky Bottom Action Bar ── */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-lg flex items-center gap-2.5">
        <button
          onClick={handleAddToCart}
          disabled={currentStock <= 0}
          className="flex-1 flex items-center justify-center gap-1.5 border-2 border-[#8F1028] text-[#8F1028] py-2.5 rounded-xl font-bold text-xs active:bg-[#8F1028]/10 transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={currentStock <= 0}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#8F1028] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm active:bg-[#690D20] transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          Buy Now ({formatPrice(currentPrice)})
        </button>
      </div>

    </div>
  );
}
