import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/categories';

export function CategoryGrid() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-[#252525]">Shop by Category</h2>
        <Link
          to="/categories"
          className="flex items-center gap-1 text-sm font-semibold text-[#8F1028] hover:underline"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-8 gap-3 md:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="group flex flex-col items-center gap-2 p-2 md:p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200"
          >
            {/* Icon Container */}
            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
              style={{ background: cat.bgColor }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Name */}
            <span className="text-[11px] md:text-xs font-medium text-center text-gray-700 leading-tight group-hover:text-[#8F1028] transition-colors line-clamp-2">
              {cat.name}
            </span>
          </Link>
        ))}

        {/* More tile */}
        <Link
          to="/categories"
          className="flex flex-col items-center gap-2 p-2 md:p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-2 bg-gray-400 rounded-sm" />
              ))}
            </div>
          </div>
          <span className="text-[11px] md:text-xs font-medium text-center text-gray-500 leading-tight">
            More
          </span>
        </Link>
      </div>
    </section>
  );
}

