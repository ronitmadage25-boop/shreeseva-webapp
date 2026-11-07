import { useState, useEffect } from 'react';
import {
  Store,
  Clock,
  CheckCircle2,
  RefreshCw,
  Save,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';

export function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    storeName: 'Shree Seva Enterprises & Readymade',
    phone: '+91 98765 43210',
    email: 'contact@shreeseva.local',
    address: 'Station Road, Opp. Primary School, Pachora, Maharashtra 424201',
    operatingHours: '8:00 AM - 9:30 PM (Daily)',
    deliveryFee: '0.00',
    minOrderValue: '199.00',
    lowStockThreshold: 10,
    timezone: 'Asia/Kolkata',
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getSettings();
      if (res.success && res.data) {
        setForm({
          storeName: res.data.storeName || 'Shree Seva Enterprises & Readymade',
          phone: res.data.phone || '+91 98765 43210',
          email: res.data.email || 'contact@shreeseva.local',
          address: res.data.address || 'Station Road, Opp. Primary School, Pachora, Maharashtra 424201',
          operatingHours: res.data.operatingHours || '8:00 AM - 9:30 PM (Daily)',
          deliveryFee: res.data.deliveryFee || '0.00',
          minOrderValue: res.data.minOrderValue || '199.00',
          lowStockThreshold: res.data.lowStockThreshold || 10,
          timezone: res.data.timezone || 'Asia/Kolkata',
        });
      }
    } catch (err: any) {
      console.error('Failed to load store settings:', err);
      setErrorMessage(err.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);
      await adminApi.updateSettings(form);
      setToastMessage('Store settings successfully updated and applied.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      setErrorMessage(err.message || 'Failed to save store settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#17231C] tracking-tight">Store Configuration</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Configure business identity, Pachora retail address, operational delivery rules, and stock alerts.
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="p-2.5 rounded-xl border border-[#E5ECE7] bg-white text-[#718078] hover:text-[#16834A] hover:bg-[#F6F9F7] transition-colors self-start sm:self-auto"
          title="Reload Settings"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {toastMessage && (
        <div className="bg-[#E8F5EC] border border-[#16834A]/30 text-[#16834A] text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Identity */}
        <div className="bg-white rounded-2xl border border-[#E5ECE7] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5ECE7]">
            <Store className="w-5 h-5 text-[#16834A]" />
            <div>
              <h2 className="text-sm font-bold text-[#17231C]">Retail Store Profile</h2>
              <p className="text-[11px] text-[#718078]">Business details displayed on invoices and receipts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">Official Business Name</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">Store Helpline / WhatsApp</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">Store Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">Store Operating Hours</label>
              <input
                type="text"
                value={form.operatingHours}
                onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#17231C] mb-1">Physical Store Address (Pachora)</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Order & Delivery Settings */}
        <div className="bg-white rounded-2xl border border-[#E5ECE7] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5ECE7]">
            <Truck className="w-5 h-5 text-[#16834A]" />
            <div>
              <h2 className="text-sm font-bold text-[#17231C]">Fulfillment & Checkout Rules</h2>
              <p className="text-[11px] text-[#718078]">Order value thresholds and delivery pricing for Pachora.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                step="0.01"
                value={form.deliveryFee}
                onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
              />
              <span className="text-[10px] text-[#718078] mt-1 block">Set ₹0 for free local delivery</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">Min Order Threshold (₹)</label>
              <input
                type="number"
                step="0.01"
                value={form.minOrderValue}
                onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
              />
              <span className="text-[10px] text-[#718078] mt-1 block">Minimum checkout amount</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">Low Stock Alert Count</label>
              <input
                type="number"
                value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: parseInt(e.target.value, 10) || 5 })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
              />
              <span className="text-[10px] text-[#718078] mt-1 block">Trigger low stock warning badge</span>
            </div>
          </div>
        </div>

        {/* Section 3: Timezone & System */}
        <div className="bg-white rounded-2xl border border-[#E5ECE7] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5ECE7]">
            <Clock className="w-5 h-5 text-[#16834A]" />
            <div>
              <h2 className="text-sm font-bold text-[#17231C]">Regional Localization</h2>
              <p className="text-[11px] text-[#718078]">Date formatting and timeline calculations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">Store Timezone</label>
              <input
                type="text"
                disabled
                value={form.timezone}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] bg-gray-50 text-gray-500 font-mono"
              />
              <span className="text-[10px] text-[#718078] mt-1 block">Locked to Indian Standard Time (IST)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">Currency Standard</label>
              <input
                type="text"
                disabled
                value="Indian Rupee (INR - ₹)"
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] bg-gray-50 text-gray-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#16834A] hover:bg-[#105C37] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Store Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
