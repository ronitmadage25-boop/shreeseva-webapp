import { Link } from 'react-router-dom';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { categories as defaultCategories } from '../../data/categories';
import { useCategoriesQuery } from '../../services/queries';
import { getGroceryFallbackImage } from '../../utils';

export function CategoryGrid() {
  const { data: categoriesData } = useCategoriesQuery();
  const categoryList = categoriesData && categoriesData.length > 0 ? categoriesData : defaultCategories;
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-7 md:py-9">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#252525]">Shop by Category</h2>
          <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
            Fresh kirana, cold beverages, school stationery & household essentials
          </p>
        </div>
        <Link
          to="/categories"
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#8F1028] hover:text-[#690D20] hover:underline"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid: 4 columns on mobile, 8 columns on desktop matching reference mockup */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-8 gap-2.5 sm:gap-3 md:gap-4">
        {categoryList.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="group flex flex-col items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-white border border-gray-100/80 shadow-xs hover:shadow-md hover:border-[#8F1028]/20 transition-all duration-200"
          >
            {/* Visual Container */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex items-center justify-center p-1.5 transition-transform duration-200 group-hover:scale-105"
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
            {/* Category Name */}
            <span className="text-[11px] sm:text-xs font-semibold text-center text-gray-700 leading-tight group-hover:text-[#8F1028] transition-colors line-clamp-2 h-7 flex items-center justify-center">
              {cat.name}
            </span>
          </Link>
        ))}

        {/* More Categories Tile */}
        <Link
          to="/categories"
          className="group flex flex-col items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-white border border-gray-100/80 shadow-xs hover:shadow-md hover:border-[#8F1028]/20 transition-all duration-200"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <LayoutGrid className="w-6 h-6 text-[#8F1028] group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-center text-gray-700 group-hover:text-[#8F1028] transition-colors leading-tight h-7 flex items-center justify-center">
            More
          </span>
        </Link>
      </div>
    </section>
  );
}
