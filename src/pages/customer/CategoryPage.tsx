import { useParams } from 'react-router-dom';
import { categories } from '../../data/categories';
import { getProductsByCategory } from '../../data/products';
import { ProductCard } from '../../components/products/ProductCard';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);
  const products = category ? getProductsByCategory(category.id) : [];

  if (!category) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Category not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div
        className="rounded-2xl p-6 mb-8 flex items-center gap-4"
        style={{ background: category.bgColor }}
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/50">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
          <p className="text-sm text-gray-600">{category.description}</p>
          {category.productCount && (
            <p className="text-xs text-gray-500 mt-1">{category.productCount} products</p>
          )}
        </div>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}

