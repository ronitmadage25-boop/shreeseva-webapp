import { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  Tag,
  Star,
  Sparkles,
  Flame,
} from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';
import { formatPrice } from '../../utils';

export function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'kirana',
    brand: '',
    description: '',
    basePrice: '',
    discountPrice: '',
    unit: 'kg',
    unitValue: '',
    stockQuantity: '50',
    imageUrl: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    hasOffer: false,
    badge: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [prodRes, catRes] = await Promise.all([
        adminApi.getProducts({ category: selectedCategory, search }),
        adminApi.getCategories(),
      ]);

      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 'kirana',
      brand: 'Shree Seva',
      description: '',
      basePrice: '',
      discountPrice: '',
      unit: 'kg',
      unitValue: '1 kg Pack',
      stockQuantity: '50',
      imageUrl: '',
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      hasOffer: false,
      badge: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: any) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      categoryId: p.categoryId,
      brand: p.brand || '',
      description: p.description || '',
      basePrice: p.basePrice,
      discountPrice: p.discountPrice || '',
      unit: p.unit || 'kg',
      unitValue: p.unitValue || '',
      stockQuantity: p.inventory?.stockQuantity?.toString() || '50',
      imageUrl: p.images?.[0]?.imageUrl || '',
      isFeatured: Boolean(p.isFeatured),
      isBestSeller: Boolean(p.isBestSeller),
      isNewArrival: Boolean(p.isNewArrival),
      hasOffer: Boolean(p.hasOffer),
      badge: p.badge || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.basePrice || !formData.unitValue) {
      setFormError('Please fill in required fields (Name, Price, Pack Unit).');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, formData);
      } else {
        await adminApi.createProduct(formData);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from store catalog?`)) {
      return;
    }

    try {
      await adminApi.deleteProduct(id);
      await fetchData();
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER & ADD BUTTON ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5ECE7]">
        <div>
          <h1 className="text-2xl font-black text-[#17231C]">Products Catalog</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Manage daily kirana groceries, beverages, school stationery & household items.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#16834A] hover:bg-[#105C37] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-3xl border border-[#E5ECE7] p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            placeholder="Search by product name or brand..."
            className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl pl-10 pr-4 py-2 text-xs text-[#17231C] placeholder:text-[#718078] focus:outline-none focus:border-[#16834A]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs font-semibold text-[#17231C] focus:outline-none focus:border-[#16834A]"
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-4 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* ── PRODUCTS TABLE ── */}
      <div className="bg-white rounded-3xl border border-[#E5ECE7] overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500 animate-pulse">
            Loading products from database...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            No products found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F9F7] border-b border-[#E5ECE7] text-[#718078] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Pack / Unit</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Badges</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]/60">
                {products.map((p) => {
                  const stock = p.inventory?.stockQuantity ?? 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#F6F9F7] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
                          />
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{p.name}</p>
                            <p className="text-[10px] text-gray-500">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-semibold">
                        {p.category?.name || p.categoryId}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {p.unitValue || p.unit}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-gray-900">{formatPrice(parseFloat(p.basePrice))}</span>
                        {p.discountPrice && (
                          <span className="block text-[10px] text-gray-400 line-through">
                            ₹{p.discountPrice}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            stock <= 0
                              ? 'bg-red-50 text-[#D94B4B]'
                              : stock <= 10
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-[#E8F5EC] text-[#16834A]'
                          }`}
                        >
                          {stock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {p.isBestSeller && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm" title="Best Seller">
                              BEST
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="bg-purple-100 text-purple-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm" title="Featured">
                              HOT
                            </span>
                          )}
                          {p.hasOffer && (
                            <span className="bg-red-100 text-red-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm" title="Offer">
                              OFFER
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-gray-500 hover:text-[#16834A] hover:bg-[#E8F5EC] rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-gray-400 hover:text-[#D94B4B] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ADD / EDIT PRODUCT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#E5ECE7]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE7] mb-4">
              <h2 className="text-lg font-black text-[#17231C]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-3 rounded-xl mb-4 font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aashirvaad Whole Wheat Atta"
                  required
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16834A]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Tata, Fortune, Parle"
                    className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    placeholder="279.00"
                    required
                    className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="299.00"
                    className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="50"
                    required
                    className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Pack Size / Unit Label *</label>
                  <input
                    type="text"
                    value={formData.unitValue}
                    onChange={(e) => setFormData({ ...formData, unitValue: e.target.value })}
                    placeholder="e.g. 5 kg Pack, 1 L Bottle, 200 Pages"
                    required
                    className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fresh quality daily essentials for Pachora families..."
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                />
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="accent-[#16834A]"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#16834A]"
                  />
                  <span>Featured Hero</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.hasOffer}
                    onChange={(e) => setFormData({ ...formData, hasOffer: e.target.checked })}
                    className="accent-[#16834A]"
                  />
                  <span>Has Offer Badge</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E5ECE7] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#16834A] hover:bg-[#105C37] text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

