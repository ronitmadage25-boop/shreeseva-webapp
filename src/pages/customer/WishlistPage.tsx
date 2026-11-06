import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { ProductCard } from '../../components/products/ProductCard';

export function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-5 text-center">
        <Heart className="w-20 h-20 text-gray-200" />
        <h1 className="text-xl font-bold text-gray-700">Your wishlist is empty</h1>
        <p className="text-sm text-gray-400">Save your favourite products here.</p>
        <Link
          to="/"
          className="bg-[#8F1028] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#690D20] transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
      <h1 className="text-2xl font-bold text-[#252525] mb-6">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {items.map(({ product }) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

