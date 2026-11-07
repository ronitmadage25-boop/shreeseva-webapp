import { useState, useEffect } from 'react';
import { Grid3X3, Plus, Edit, RefreshCw, X, Check } from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';
import { ImageUpload } from '../../components/admin/ImageUpload';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await adminApi.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder((categories.length + 1).toString());
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
    setName(c.name);
    setDescription(c.description || '');
    setImageUrl(c.imageUrl || '');
    setDisplayOrder(c.displayOrder?.toString() || '1');
    setIsActive(Boolean(c.isActive));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, {
          name,
          description,
          imageUrl,
          displayOrder,
          isActive,
        });
      } else {
        await adminApi.createCategory({
          name,
          description,
          imageUrl,
          displayOrder,
          isActive,
        });
      }
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5ECE7]">
        <div>
          <h1 className="text-2xl font-black text-[#17231C]">Categories Management</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Organize retail departments, priority display order & category banners.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#16834A] hover:bg-[#105C37] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-4 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* ── CATEGORIES GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-[#E5ECE7] p-5 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&q=80'}
                  alt={cat.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shrink-0"
                />
                <div className="text-right">
                  <span className="text-[10px] font-black bg-[#E8F5EC] text-[#16834A] px-2 py-0.5 rounded-full">
                    Order #{cat.displayOrder}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {cat.productCount ?? 0} active products
                  </p>
                </div>
              </div>

              <h2 className="text-sm font-black text-gray-900 leading-snug">{cat.name}</h2>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
            </div>

            <div className="pt-4 border-t border-[#E5ECE7] mt-4 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cat.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {cat.isActive ? 'Active on Storefront' : 'Hidden'}
              </span>

              <button
                type="button"
                onClick={() => handleOpenEdit(cat)}
                className="text-xs font-bold text-[#16834A] hover:bg-[#E8F5EC] px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5ECE7]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE7] mb-4">
              <h2 className="text-base font-black text-[#17231C]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kirana & Groceries"
                  required
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Daily grocery staples..."
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Display Priority Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Active Status</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Upload Category Image or Click Picture with Camera */}
              <ImageUpload
                label="Category Banner / Icon"
                placeholder="Upload category photo or click picture with camera"
                value={imageUrl}
                onChange={(img) => setImageUrl(img)}
              />

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
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

