import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { ArrowRight } from 'lucide-react';
import { getGroceryFallbackImage } from '../../utils';

export function CategoriesPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-[#252525]">All Categories</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Explore groceries, cold beverages, school stationery & household essentials
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center gap-3 hover:border-[#8F1028]/25"
          >
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden p-1.5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{ background: cat.bgColor || '#FFF9EF' }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = getGroceryFallbackImage(cat.name);
                }}
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-sm text-gray-800 group-hover:text-[#8F1028] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8F1028] mt-2 group-hover:translate-x-0.5 transition-transform">
                Explore Items <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
