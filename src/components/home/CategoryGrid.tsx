import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/categories';

// Emoji icons as reliable zero-dependency fallback for category icons.
// These are universally supported and match the Indian grocery store context.
const CATEGORY_EMOJIS: Record<string, string> = {
  kirana: '🌾',
  'cold-drinks': '🥤',
  stationery: '📒',
  'personal-care': '🧴',
  'home-cleaning': '🧹',
  snacks: '🍟',
  'daily-essentials': '🛒',
};

interface CategoryImageProps {
  category: { id: string; image: string; name: string; bgColor?: string };
}

function CategoryImage({ category }: CategoryImageProps) {
  // Using emoji icons for reliable display — no broken image risk.
  const emoji = CATEGORY_EMOJIS[category.id] ?? '🏪';

  return (
    <div
      className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-transform duration-200 group-hover:scale-110"
      style={{ background: category.bgColor ?? '#F3F4F6' }}
    >
      {emoji}
    </div>
  );
}

export function CategoryGrid() {
  return (
    <section className="bg-white py-6 md:py-8 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
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

        {/* Grid — 4 cols mobile, 8 cols desktop */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-2 md:p-3 rounded-xl hover:bg-[#FFF9EF] transition-all duration-200"
            >
              <CategoryImage category={cat} />
              <span className="text-[10px] md:text-xs font-medium text-center text-gray-700 group-hover:text-[#8F1028] transition-colors leading-tight line-clamp-2 w-full">
                {cat.name}
              </span>
            </Link>
          ))}

          {/* More tile */}
          <Link
            to="/categories"
            className="group flex flex-col items-center gap-2 p-2 md:p-3 rounded-xl hover:bg-[#FFF9EF] transition-all duration-200"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl md:text-3xl">➕</span>
            </div>
            <span className="text-[10px] md:text-xs font-medium text-center text-gray-500 group-hover:text-[#8F1028] transition-colors">
              More
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
