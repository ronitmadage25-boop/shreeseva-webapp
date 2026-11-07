import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw,
  Sparkles,
  PackageOpen
} from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { formatPrice, cn, getGroceryFallbackImage } from '../../utils';

export type SortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'rating'
  | 'discount';

interface ProductListingViewProps {
  title: string;
  description?: string;
  bannerImage?: string;
  bannerBgColor?: string;
  badge?: string;
  products: Product[];
  emptyMessage?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function ProductListingView({
  title,
  description,
  bannerImage,
  bannerBgColor = '#FFF9EF',
  badge,
  products,
  emptyMessage = 'No products match your selected filters.',
  breadcrumbs,
}: ProductListingViewProps) {
  // ── Filter State ────────────────────────────────────────────────────────────
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [discountOnly, setDiscountOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Price Extents in product set
  const minMaxPrice = useMemo(() => {
    if (products.length === 0) return [0, 1000];
    const prices = products.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(minMaxPrice[1]);

  // Reset max price when product set changes
  useEffect(() => {
    setMaxPriceFilter(minMaxPrice[1]);
  }, [minMaxPrice]);

  // ── Available Facets Derived from Products ─────────────────────────────────
  const availableSubcategories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      if (p.subcategory) {
        map.set(p.subcategory, (map.get(p.subcategory) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([subcat, count]) => ({
      id: subcat,
      label: subcat
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      count,
    }));
  }, [products]);

  const availableBrands = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      if (p.brand) {
        map.set(p.brand, (map.get(p.brand) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([brand, count]) => ({
      id: brand,
      label: brand,
      count,
    }));
  }, [products]);

  // ── Filter & Sort Execution ────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Subcategory filter
      if (
        selectedSubcategories.length > 0 &&
        (!p.subcategory || !selectedSubcategories.includes(p.subcategory))
      ) {
        return false;
      }
      // Brand filter
      if (
        selectedBrands.length > 0 &&
        (!p.brand || !selectedBrands.includes(p.brand))
      ) {
        return false;
      }
      // Max Price filter
      if (p.price > maxPriceFilter) {
        return false;
      }
      // In-stock filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      // Discount filter
      if (discountOnly && (!p.discount || p.discount <= 0)) {
        return false;
      }
      return true;
    });
  }, [
    products,
    selectedSubcategories,
    selectedBrands,
    maxPriceFilter,
    inStockOnly,
    discountOnly,
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case 'recommended':
      default:
        return list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  // ── Active Filter Handlers ─────────────────────────────────────────────────
  const toggleSubcategory = (subcat: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcat) ? prev.filter((s) => s !== subcat) : [...prev, subcat]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setDiscountOnly(false);
    setMaxPriceFilter(minMaxPrice[1]);
  };

  const activeFiltersCount =
    selectedSubcategories.length +
    selectedBrands.length +
    (inStockOnly ? 1 : 0) +
    (discountOnly ? 1 : 0) +
    (maxPriceFilter < minMaxPrice[1] ? 1 : 0);

  // ── Filter Controls Content (Shared between desktop sidebar & mobile drawer)
  const FilterControls = () => (
    <div className="space-y-6">
      {/* Header with clear */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#8F1028]" />
          <span className="font-bold text-gray-800 text-sm">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-[#8F1028] text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-[#8F1028] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Subcategories (if available) */}
      {availableSubcategories.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            Subcategories
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableSubcategories.map(({ id, label, count }) => {
              const checked = selectedSubcategories.includes(id);
              return (
                <label
                  key={id}
                  className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSubcategory(id)}
                      className="accent-[#8F1028] rounded w-3.5 h-3.5"
                    />
                    <span className={cn('text-xs', checked && 'font-bold text-[#8F1028]')}>
                      {label}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">({count})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Brands (if available) */}
      {availableBrands.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            Brands
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableBrands.map(({ id, label, count }) => {
              const checked = selectedBrands.includes(id);
              return (
                <label
                  key={id}
                  className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBrand(id)}
                      className="accent-[#8F1028] rounded w-3.5 h-3.5"
                    />
                    <span className={cn('text-xs', checked && 'font-bold text-[#8F1028]')}>
                      {label}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">({count})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Max Price
          </h4>
          <span className="text-xs font-black text-[#8F1028]">
            {formatPrice(maxPriceFilter)}
          </span>
        </div>
        <input
          type="range"
          min={minMaxPrice[0]}
          max={minMaxPrice[1]}
          value={maxPriceFilter}
          onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
          className="w-full accent-[#8F1028] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{formatPrice(minMaxPrice[0])}</span>
          <span>{formatPrice(minMaxPrice[1])}</span>
        </div>
      </div>

      {/* Toggles: In Stock Only & Discount Only */}
      <div className="pt-4 border-t border-gray-100 space-y-2">
        <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer py-1">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-[#8F1028] rounded w-3.5 h-3.5"
          />
        </label>
        <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer py-1">
          <span>Special Offers Only</span>
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={(e) => setDiscountOnly(e.target.checked)}
            className="accent-[#8F1028] rounded w-3.5 h-3.5"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
      {/* ── Breadcrumbs ──────────────────────────────────────────────────────── */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[#8F1028] transition-colors">Home</Link>
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span>/</span>
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-[#8F1028] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-semibold">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* ── Banner / Header ──────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-5 md:p-7 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-black/5 shadow-xs relative overflow-hidden"
        style={{ background: bannerBgColor }}
      >
        <div className="flex items-center gap-4 sm:gap-5 z-10">
          {bannerImage && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white/80 p-2 shrink-0 shadow-xs border border-white">
              <img
                src={bannerImage}
                alt={title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getGroceryFallbackImage(title);
                }}
              />
            </div>
          )}
          <div>
            {badge && (
              <span className="inline-block bg-[#8F1028] text-white text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
                {badge}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-[#252525] leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                {description}
              </p>
            )}
            <p className="text-[11px] font-bold text-[#8F1028] mt-1.5 flex items-center gap-1">
              <span>Showing {sortedProducts.length} of {products.length} products</span>
            </p>
          </div>
        </div>

        {/* Pachora Store Assurance Stamp */}
        <div className="hidden lg:flex items-center gap-2 bg-white/70 backdrop-blur-xs border border-[#FFC83D]/40 px-3.5 py-2 rounded-2xl shrink-0">
          <Sparkles className="w-4 h-4 text-[#FFC83D]" />
          <span className="text-xs font-bold text-gray-700">Pachora Retail Store</span>
        </div>
      </div>

      {/* ── Main Layout: Sidebar & Products ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ── Desktop Filter Sidebar (1 col) ─────────────────────────────────── */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs sticky top-24">
            <FilterControls />
          </div>
        </div>

        {/* ── Products Column (3 cols) ───────────────────────────────────────── */}
        <div className="lg:col-span-3">
          
          {/* Controls Bar: Sort + Mobile Filter Trigger */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-4 flex items-center justify-between gap-3 shadow-2xs">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-[#8F1028]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4.5 h-4.5 bg-[#8F1028] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Results Count (Mobile & Tablet) */}
            <span className="text-xs font-semibold text-gray-500">
              <strong className="text-gray-800">{sortedProducts.length}</strong> items
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-xl px-2.5 py-2 outline-none focus:border-[#8F1028] transition-colors cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
                <option value="discount">Highest Discount</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* ── Active Filter Badges ─────────────────────────────────────────── */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-gray-400 font-medium">Active:</span>
              
              {selectedSubcategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => toggleSubcategory(subcat)}
                  className="inline-flex items-center gap-1 bg-[#8F1028]/10 text-[#8F1028] text-xs font-bold px-2.5 py-1 rounded-full border border-[#8F1028]/20 hover:bg-[#8F1028]/20 transition-colors"
                >
                  <span>{subcat.split('-').join(' ')}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}

              {selectedBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <span>{brand}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}

              {maxPriceFilter < minMaxPrice[1] && (
                <button
                  onClick={() => setMaxPriceFilter(minMaxPrice[1])}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <span>≤ {formatPrice(maxPriceFilter)}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {inStockOnly && (
                <button
                  onClick={() => setInStockOnly(false)}
                  className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <span>In Stock</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {discountOnly && (
                <button
                  onClick={() => setDiscountOnly(false)}
                  className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <span>Offers Only</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-gray-500 hover:text-[#8F1028] underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* ── Product Grid ─────────────────────────────────────────────────── */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
              <PackageOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">No Matching Products</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                {emptyMessage}
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 bg-[#8F1028] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#690D20] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── Mobile Filter Drawer / Bottom Sheet ──────────────────────────────── */}
      {isMobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-3xl z-50 lg:hidden flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Sheet Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8F1028]" />
                <span className="font-bold text-gray-800 text-sm">Filters</span>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="p-5 overflow-y-auto flex-1">
              <FilterControls />
            </div>

            {/* Sheet Footer */}
            <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#8F1028] text-white text-xs font-bold hover:bg-[#690D20]"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
