import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { allProducts } from '../../data/products';
import { ProductListingView } from '../../components/products/ProductListingView';
import { Search, Sparkles } from 'lucide-react';

const POPULAR_SEARCHES = [
  'Atta',
  'Basmati Rice',
  'Fortune Oil',
  'Tata Salt',
  'Coca-Cola',
  'Classmate Notebook',
  'Amul Ghee',
  'Maggi Noodles',
];

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  // Search logic across product names, brands, categories, subcategories, tags and description
  const matchingProducts = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return allProducts.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subcategory ? p.subcategory.toLowerCase().includes(q) : false;
      const matchTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q)) : false;
      const matchDesc = p.description.toLowerCase().includes(q);

      return matchName || matchBrand || matchCat || matchSub || matchTags || matchDesc;
    });
  }, [query]);

  if (!query) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-[#FFF9EF] text-[#8F1028] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-[#FFC83D]/40">
          <Search className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">Search Shree Seva Store</h1>
        <p className="text-sm text-gray-500 mb-6">
          Find your daily groceries, cold drinks, school stationery and household supplies.
        </p>

        {/* Popular Search Suggestions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC83D]" /> Popular Searches
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                to={`/search?q=${encodeURIComponent(term)}`}
                className="bg-gray-50 hover:bg-[#8F1028] hover:text-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProductListingView
      title={`Search Results for "${query}"`}
      description={`Found ${matchingProducts.length} items matching your query in the Shree Seva catalog.`}
      bannerBgColor="#FFF9EF"
      badge="Search Results"
      products={matchingProducts}
      breadcrumbs={[{ label: 'Search Results' }, { label: `"${query}"` }]}
      emptyMessage={`No items found matching "${query}". Try searching for daily staples like Atta, Rice, Tea, or Biscuits.`}
    />
  );
}

