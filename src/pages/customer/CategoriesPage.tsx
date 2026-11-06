import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';

export function CategoriesPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
      <h1 className="text-2xl font-bold text-[#252525] mb-6">All Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-4 flex flex-col items-center gap-3"
          >
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden"
              style={{ background: cat.bgColor }}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm text-gray-800">{cat.name}</p>
              {cat.productCount && (
                <p className="text-xs text-gray-400 mt-0.5">{cat.productCount} products</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

