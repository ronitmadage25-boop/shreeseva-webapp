import { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, ShoppingBag, Eye, X, Calendar, MapPin } from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';
import { formatPrice } from '../../utils';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await adminApi.getCustomers(search);
      if (res.success) setCustomers(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleViewCustomer = async (id: string) => {
    setIsDetailLoading(true);
    try {
      const res = await adminApi.getCustomerById(id);
      if (res.success) {
        setSelectedCustomer(res.data);
      }
    } catch (err: any) {
      alert(`Failed to load customer: ${err.message}`);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5ECE7]">
        <div>
          <h1 className="text-2xl font-black text-[#17231C]">Customer Intelligence</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Registered local retail customers in Pachora, order counts & lifetime spend.
          </p>
        </div>

        <span className="text-xs font-bold text-[#16834A] bg-[#E8F5EC] px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          {customers.length} Verified Accounts
        </span>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-[#E5ECE7] p-4 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name, phone or email..."
            className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl pl-10 pr-4 py-2 text-xs text-[#17231C] placeholder:text-[#718078] focus:outline-none focus:border-[#16834A]"
          />
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-4 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* ── CUSTOMERS TABLE ── */}
      <div className="bg-white rounded-3xl border border-[#E5ECE7] overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500 animate-pulse">
            Loading customers from database...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            No customer accounts found matching search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F9F7] border-b border-[#E5ECE7] text-[#718078] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Completed Spend</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]/60">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F6F9F7] transition-colors">
                    <td className="py-3.5 px-4 font-black text-gray-900">
                      {c.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-semibold">
                      {c.phone}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {c.email || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md">
                        {c.totalOrders || 0} orders
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#16834A]">
                      {formatPrice(parseFloat(c.totalSpent || '0'))}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleViewCustomer(c.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#16834A] hover:bg-[#E8F5EC] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CUSTOMER DETAIL MODAL ── */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-[#E5ECE7] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE7]">
              <div>
                <h2 className="text-base font-black text-[#17231C]">{selectedCustomer.fullName}</h2>
                <p className="text-xs text-[#718078]">{selectedCustomer.phone} • {selectedCustomer.email || 'No email'}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Saved Addresses */}
            <div>
              <p className="text-xs font-bold text-[#718078] uppercase mb-2">Saved Delivery Locations</p>
              {(selectedCustomer.addresses || []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No saved addresses on file.</p>
              ) : (
                <div className="space-y-2">
                  {selectedCustomer.addresses.map((a: any) => (
                    <div key={a.id} className="p-3 rounded-2xl bg-[#F6F9F7] border border-[#E5ECE7] text-xs">
                      <p className="font-bold text-gray-900">{a.label || 'Home'} • {a.recipientName}</p>
                      <p className="text-gray-600 mt-0.5">{a.addressLine1}, {a.city} {a.pincode}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order History */}
            <div>
              <p className="text-xs font-bold text-[#718078] uppercase mb-2">
                Order History ({(selectedCustomer.orders || []).length})
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(selectedCustomer.orders || []).map((o: any) => (
                  <div key={o.id} className="p-3 rounded-2xl bg-[#F6F9F7] border border-[#E5ECE7] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-black text-gray-900">#{o.orderNumber}</p>
                      <p className="text-[10px] text-gray-500">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} • {o.items?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#16834A]">{formatPrice(parseFloat(o.totalAmount))}</p>
                      <span className="text-[9px] font-bold uppercase text-gray-600">{o.orderStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

