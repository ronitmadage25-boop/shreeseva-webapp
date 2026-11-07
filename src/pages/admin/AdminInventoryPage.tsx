import { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  History,
  ArrowRight,
  X,
} from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';

export function AdminInventoryPage() {
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'low' | 'out'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Adjustment Modal
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('New stock arrival from supplier');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustMessage, setAdjustMessage] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [invRes, logsRes] = await Promise.all([
        adminApi.getInventory(activeTab),
        adminApi.getInventoryLogs(),
      ]);

      if (invRes.success) setInventoryList(invRes.data);
      if (logsRes.success) setLogs(logsRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleOpenAdjustModal = (item: any) => {
    setSelectedItem(item);
    setNewStock(item.stockQuantity);
    setAdjustReason('Restocked from wholesale distributor');
    setAdjustMessage('');
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsAdjusting(true);
    setAdjustMessage('');
    try {
      const res = await adminApi.adjustStock(selectedItem.productId, newStock, adjustReason);
      if (res.success) {
        setAdjustMessage(res.message);
        await fetchData();
        setTimeout(() => setSelectedItem(null), 1200);
      }
    } catch (err: any) {
      setAdjustMessage(`Error: ${err.message}`);
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5ECE7]">
        <div>
          <h1 className="text-2xl font-black text-[#17231C]">Inventory Management</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Monitor real-time grocery warehouse stock levels, low-stock warnings & track audit logs.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl text-xs font-bold text-[#17231C] shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#16834A]" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'All Inventory' },
          { id: 'low', label: 'Low Stock (< 10 units)' },
          { id: 'out', label: 'Out of Stock' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-[#16834A] text-white shadow-2xs'
                : 'bg-white border border-[#E5ECE7] text-[#718078] hover:text-[#16834A]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-4 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* ── INVENTORY TABLE ── */}
      <div className="bg-white rounded-3xl border border-[#E5ECE7] overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500 animate-pulse">
            Loading inventory records...
          </div>
        ) : inventoryList.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            No products match this inventory filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F9F7] border-b border-[#E5ECE7] text-[#718078] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Pack Unit</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Threshold</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]/60">
                {inventoryList.map((item) => {
                  const p = item.product;
                  const isLow = item.stockQuantity > 0 && item.stockQuantity <= item.lowStockThreshold;
                  const isOut = item.stockQuantity <= 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#F6F9F7] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {p?.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {p?.category?.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {p?.unitValue}
                      </td>
                      <td className="py-3.5 px-4 font-black text-gray-900">
                        ₹{p?.basePrice}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-sm text-gray-900">
                          {item.stockQuantity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {item.lowStockThreshold}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                            isOut
                              ? 'bg-red-50 text-[#D94B4B]'
                              : isLow
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-[#E8F5EC] text-[#16834A]'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenAdjustModal(item)}
                          className="px-3 py-1.5 bg-[#E8F5EC] hover:bg-[#16834A] text-[#16834A] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Correct Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── STOCK ADJUSTMENT AUDIT LOG TABLE ── */}
      <div className="bg-white rounded-3xl border border-[#E5ECE7] p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E5ECE7]">
          <History className="w-4 h-4 text-[#16834A]" />
          <h2 className="text-sm font-black text-[#17231C]">Stock Adjustment Audit Log</h2>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-gray-400 py-3 text-center">No manual stock adjustments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#718078] font-bold border-b border-[#E5ECE7]">
                  <th className="pb-2">Date / Time</th>
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Previous</th>
                  <th className="pb-2">Adjusted</th>
                  <th className="pb-2">Delta</th>
                  <th className="pb-2">Reason</th>
                  <th className="pb-2 text-right">Modified By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]/60">
                {logs.slice(0, 10).map((l) => (
                  <tr key={l.id} className="hover:bg-[#F6F9F7]">
                    <td className="py-2.5 text-gray-500">
                      {new Date(l.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Asia/Kolkata',
                      })}
                    </td>
                    <td className="py-2.5 font-bold text-gray-900">{l.product?.name}</td>
                    <td className="py-2.5 text-gray-600">{l.previousStock}</td>
                    <td className="py-2.5 font-black text-gray-900">{l.newStock}</td>
                    <td className="py-2.5">
                      <span className={l.adjustmentQuantity >= 0 ? 'text-[#16834A] font-bold' : 'text-[#D94B4B] font-bold'}>
                        {l.adjustmentQuantity >= 0 ? `+${l.adjustmentQuantity}` : l.adjustmentQuantity}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-600 italic">{l.reason}</td>
                    <td className="py-2.5 text-right font-semibold text-gray-700">
                      {l.actor?.fullName || 'Store Owner'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── STOCK ADJUSTMENT MODAL ── */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5ECE7]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE7] mb-4">
              <div>
                <h2 className="text-base font-black text-[#17231C]">Manual Stock Correction</h2>
                <p className="text-xs text-[#718078] truncate max-w-[280px]">
                  {selectedItem.product?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {adjustMessage && (
              <div className="bg-[#E8F5EC] border border-[#16834A]/30 text-[#105C37] text-xs p-3 rounded-xl mb-4 font-semibold">
                {adjustMessage}
              </div>
            )}

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Current Stock Count: <strong className="text-[#16834A]">{selectedItem.stockQuantity} units</strong>
                </label>
                <label className="block font-bold text-gray-800 mb-1 mt-2">New Verified Stock *</label>
                <input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value, 10) || 0)}
                  required
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Adjustment Reason (Mandatory Audit) *</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16834A] mb-2"
                >
                  <option value="Restocked from wholesale distributor">Restocked from wholesale distributor</option>
                  <option value="Physical shelf audit discrepancy">Physical shelf audit discrepancy</option>
                  <option value="Damaged / expired goods write-off">Damaged / expired goods write-off</option>
                  <option value="Counter return by customer">Counter return by customer</option>
                  <option value="Other manual correction">Other manual correction</option>
                </select>

                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Or type specific reason..."
                  required
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div className="pt-3 border-t border-[#E5ECE7] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-5 py-2 bg-[#16834A] hover:bg-[#105C37] text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isAdjusting ? 'Saving...' : 'Confirm Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

