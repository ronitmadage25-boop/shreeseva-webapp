import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from '../products/ProductCard';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  maxItems?: number;
  bgColor?: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  maxItems = 6,
  bgColor,
}: ProductSectionProps) {
  const displayProducts = products.slice(0, maxItems);

  return (
    <section
      className="py-8"
      style={bgColor ? { background: bgColor } : undefined}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#252525]">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link
              to={viewAllHref}
              className="flex items-center gap-1 text-sm font-semibold text-[#8F1028] hover:underline shrink-0"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

