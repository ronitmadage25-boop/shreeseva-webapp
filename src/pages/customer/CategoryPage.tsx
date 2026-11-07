import { useParams, Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { getProductsByCategory } from '../../data/products';
import { ProductListingView } from '../../components/products/ProductListingView';
import { ArrowLeft } from 'lucide-react';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug || c.id === slug);
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
    <ProductListingView
      title={category.name}
      description={category.description}
      bannerImage={category.image}
      bannerBgColor={category.bgColor || '#FFF9EF'}
      badge="Category Catalog"
      products={products}
      breadcrumbs={[
        { label: 'Categories', href: '/categories' },
        { label: category.name },
      ]}
      emptyMessage={`No products found in ${category.name} matching your filter criteria.`}
    />
  );
}
