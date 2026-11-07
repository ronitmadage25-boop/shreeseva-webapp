import { useParams, Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { getProductsByCategory } from '../../data/products';
import { ProductCard } from '../../components/products/ProductCard';
import { ArrowLeft } from 'lucide-react';
import { getGroceryFallbackImage } from '../../utils';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);
  const products = category ? getProductsByCategory(category.id) : [];

  if (!category) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Category Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">The category you are looking for does not exist.</p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 bg-[#8F1028] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#690D20] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 md:py-8">
      {/* Back Link */}
      <Link
        to="/categories"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#8F1028] transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All Categories
      </Link>

      {/* Category Banner */}
      <div
        className="rounded-2xl p-5 md:p-6 mb-7 flex items-center gap-4 sm:gap-5 border border-black/5 shadow-xs"
        style={{ background: category.bgColor || '#FFF9EF' }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white/70 p-1.5 shrink-0 shadow-xs">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = getGroceryFallbackImage(category.name);
            }}
            loading="lazy"
          />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#252525]">{category.name}</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{category.description}</p>
          <p className="text-[11px] font-semibold text-[#8F1028] mt-1.5">
            Showing {products.length} products
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-sm">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
