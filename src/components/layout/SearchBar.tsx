import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { allProducts } from '../../data/products';
import { categories } from '../../data/categories';
import { formatPrice, getGroceryFallbackImage } from '../../utils';

const RECENT_KEY = 'shreeseva_recent_searches';

interface SearchBarProps {
  isMobile?: boolean;
  placeholder?: string;
}

export function SearchBar({
  isMobile = false,
  placeholder = 'Search for groceries, cold drinks, stationery...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      // Ignore
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching Products & Categories
  const { matchedProducts, matchedCategories } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { matchedProducts: [], matchedCategories: [] };
    }

    const prods = allProducts
      .filter((p) => {
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
        const matchCat = p.category.toLowerCase().includes(q);
        const matchSub = p.subcategory ? p.subcategory.toLowerCase().includes(q) : false;
        const matchTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q)) : false;
        return matchName || matchBrand || matchCat || matchSub || matchTags;
      })
      .slice(0, 5);

    const cats = categories
      .filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
      .slice(0, 2);

    return { matchedProducts: prods, matchedCategories: cats };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectTerm = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleSelectProduct = (slug: string) => {
    saveRecentSearch(query.trim());
    setIsOpen(false);
    navigate(`/product/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    saveRecentSearch(query.trim());
    setIsOpen(false);
    navigate(`/categories/${slug}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
              isMobile ? 'w-4 h-4' : 'w-4 h-4'
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full bg-white text-gray-800 placeholder:text-gray-400 outline-none shadow-xs focus:ring-2 focus:ring-[#FFC83D] transition-all ${
              isMobile
                ? 'pl-9 pr-8 py-2 rounded-xl text-xs'
                : 'pl-10 pr-9 py-2.5 rounded-xl text-sm'
            }`}
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(true);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* ── Autocomplete Dropdown ────────────────────────────────────────────── */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          
          {/* Query is empty: Show Recent Searches & Popular Suggestions */}
          {!query.trim() && (
            <div className="p-3">
              {recentSearches.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                    <span>Recent Searches</span>
                    <button
                      onClick={clearAllRecent}
                      className="text-[#8F1028] hover:underline normal-case text-[11px]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => handleSelectTerm(term)}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{term}</span>
                        </div>
                        <button
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-gray-400 hover:text-red-500 p-0.5"
                          aria-label="Remove search term"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular quick searches */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FFC83D]" /> Popular Groceries
                </p>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {['Atta', 'Basmati Rice', 'Tata Salt', 'Fortune Oil', 'Coca-Cola', 'Classmate'].map(
                    (s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSelectTerm(s)}
                        className="text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-100 hover:bg-[#8F1028] hover:text-white transition-colors"
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Query is typed: Show Matching Categories and Products */}
          {query.trim() && (
            <div>
              {/* Category Matches */}
              {matchedCategories.length > 0 && (
                <div className="p-2 border-b border-gray-50 bg-amber-50/40">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider px-2 block mb-1">
                    Matching Categories
                  </span>
                  <div className="space-y-1">
                    {matchedCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCategory(c.slug)}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-gray-800 hover:bg-amber-100/60 flex items-center justify-between"
                      >
                        <span>{c.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Matches */}
              {matchedProducts.length > 0 ? (
                <div className="p-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 block mb-1">
                    Products
                  </span>
                  <div className="space-y-1">
                    {matchedProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProduct(p.slug)}
                        className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#FDFBF7] p-1 shrink-0 border border-gray-100 flex items-center justify-center">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getGroceryFallbackImage(p.name);
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          {p.brand && (
                            <p className="text-[9px] font-bold text-[#8F1028] uppercase truncate">
                              {p.brand}
                            </p>
                          )}
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            {p.name}
                          </p>
                        </div>
                        <span className="text-xs font-black text-[#8F1028] shrink-0">
                          {formatPrice(p.price)}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* View all results button */}
                  <button
                    onClick={handleSubmit}
                    className="w-full mt-2 pt-2 border-t border-gray-100 text-center text-xs font-bold text-[#8F1028] hover:underline flex items-center justify-center gap-1 py-1"
                  >
                    <span>View all results for "{query}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">No products found for "{query}"</p>
                  <button
                    onClick={handleSubmit}
                    className="text-xs font-bold text-[#8F1028] hover:underline"
                  >
                    Search full store catalog →
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

