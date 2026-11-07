import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  CheckCircle2,
  Trash2,
  Power,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';

interface Offer {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  minOrderValue?: string;
  maxDiscount?: string;
  expiryDate?: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '299',
    maxDiscount: '100',
    expiryDate: '',
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOffers();
      if (res.success) {
        setOffers(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await adminApi.toggleOffer(id);
      await fetchOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle coupon status.');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${code}"?`)) return;
    try {
      await adminApi.deleteOffer(id);
      await fetchOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete coupon.');
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.title.trim() || !formData.discountValue) {
      alert('Code, title, and discount amount are required.');
      return;
    }

    try {
      setSubmitting(true);
      await adminApi.createOffer(formData);
      setIsModalOpen(false);
      setFormData({
        code: '',
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: '299',
        maxDiscount: '100',
        expiryDate: '',
      });
      await fetchOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to create coupon code.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOffers = offers.filter(
    (o) =>
      o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = offers.filter((o) => o.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#17231C] tracking-tight">Offers & Discounts</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Configure promotional promo codes, cart discounts, and festive offers for Pachora shoppers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOffers}
            className="p-2.5 rounded-xl border border-[#E5ECE7] bg-white text-[#718078] hover:text-[#16834A] hover:bg-[#F6F9F7] transition-colors"
            title="Refresh Offers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#16834A] hover:bg-[#105C37] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon Code</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5ECE7] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718078] uppercase tracking-wider">Active Campaigns</div>
            <div className="text-2xl font-black text-[#16834A] mt-1">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] flex items-center justify-center text-[#16834A]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5ECE7] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718078] uppercase tracking-wider">Total Coupons</div>
            <div className="text-2xl font-black text-[#17231C] mt-1">{offers.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#718078]">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5ECE7] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#718078] uppercase tracking-wider">Customer Redemptions</div>
            <div className="text-2xl font-black text-[#17231C] mt-1">
              {offers.reduce((acc, curr) => acc + (curr.usageCount || 0), 0)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E5ECE7] flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code or campaign..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
          />
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-2xl border border-[#E5ECE7] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-[#16834A] animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#718078]">Loading coupons...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-10 h-10 text-[#718078]/40 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#17231C]">No coupons configured yet</h3>
            <p className="text-xs text-[#718078] mt-1 max-w-sm mx-auto">
              Create your first promotional code (like FESTIVE10 or PACHORA50) to reward your retail store customers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F9F7] text-[#718078] font-bold border-b border-[#E5ECE7]">
                <tr>
                  <th className="px-4 py-3.5">Promo Code</th>
                  <th className="px-4 py-3.5">Campaign Title</th>
                  <th className="px-4 py-3.5">Discount Value</th>
                  <th className="px-4 py-3.5">Min Order</th>
                  <th className="px-4 py-3.5">Max Cap</th>
                  <th className="px-4 py-3.5">Expiry</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]">
                {filteredOffers.map((o) => {
                  const isPercent = o.discountType === 'percentage';
                  const isExpired = o.expiryDate && new Date(o.expiryDate) < new Date();

                  return (
                    <tr key={o.id} className="hover:bg-[#F6F9F7]/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-[#16834A] bg-[#E8F5EC] border border-[#16834A]/20 px-2.5 py-1 rounded-md text-xs tracking-wider">
                          {o.code}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-[#17231C]">
                        {o.title}
                        {o.description && (
                          <div className="text-[11px] text-[#718078] font-normal mt-0.5">{o.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-black text-[#17231C]">
                        {isPercent ? `${parseFloat(o.discountValue)}% OFF` : `₹${parseFloat(o.discountValue)} OFF`}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {parseFloat(o.minOrderValue || '0') > 0 ? `₹${parseFloat(o.minOrderValue!)}` : 'None'}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {o.maxDiscount ? `₹${parseFloat(o.maxDiscount)}` : 'No Cap'}
                      </td>
                      <td className="px-4 py-3.5 text-[#718078]">
                        {o.expiryDate ? (
                          <span className={isExpired ? 'text-rose-600 font-bold' : ''}>
                            {new Date(o.expiryDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        ) : (
                          'Never Expires'
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isExpired
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : o.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {isExpired ? 'Expired' : o.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggle(o.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              o.isActive
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={o.isActive ? 'Disable Coupon' : 'Enable Coupon'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(o.id, o.code)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal: Create Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5ECE7] p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#17231C] mb-1">Create Discount Coupon</h3>
            <p className="text-xs text-[#718078] mb-5">
              Set up a promo code with custom discount logic, order threshold, and validity.
            </p>

            <form onSubmit={handleCreateOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17231C] mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PACHORA10"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full text-xs font-mono font-bold px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17231C] mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10% Off on Groceries"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17231C] mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Cash (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17231C] mb-1">
                    Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="10"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17231C] mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    placeholder="299"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17231C] mb-1">Max Cap Discount (₹)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17231C] mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E5ECE7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold text-[#718078] hover:bg-[#F6F9F7] px-4 py-2 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#16834A] hover:bg-[#105C37] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
