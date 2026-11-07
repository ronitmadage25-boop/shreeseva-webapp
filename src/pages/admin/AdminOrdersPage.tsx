import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Store,
  X,
  AlertCircle,
  Phone,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';
import { formatPrice } from '../../utils';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await adminApi.getOrders({
        status: statusFilter,
        deliveryType: deliveryTypeFilter,
        search,
      });
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, deliveryTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    setActionMessage('');
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setActionMessage(res.message);
        // Refresh orders
        await fetchOrders();
        // Update selected order view
        const updated = await adminApi.getOrderById(orderId);
        if (updated.success) {
          setSelectedOrder(updated.data);
        }
      }
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER & SEARCH / FILTERS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5ECE7]">
        <div>
          <h1 className="text-2xl font-black text-[#17231C]">Orders Management</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Process incoming orders, dispatch home deliveries & counter pickups in Pachora.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl text-xs font-bold text-[#17231C] shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#16834A]" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-3xl border border-[#E5ECE7] p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer name, phone..."
            className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl pl-10 pr-4 py-2 text-xs text-[#17231C] placeholder:text-[#718078] focus:outline-none focus:border-[#16834A]"
          />
        </form>

        {/* Status Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs font-semibold text-[#17231C] focus:outline-none focus:border-[#16834A]"
          >
            <option value="all">All Order Statuses</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={deliveryTypeFilter}
            onChange={(e) => setDeliveryTypeFilter(e.target.value)}
            className="bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3 py-2 text-xs font-semibold text-[#17231C] focus:outline-none focus:border-[#16834A]"
          >
            <option value="all">All Delivery Types</option>
            <option value="home_delivery">Home Delivery</option>
            <option value="store_pickup">Store Pickup</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-4 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* ── ORDERS TABLE ── */}
      <div className="bg-white rounded-3xl border border-[#E5ECE7] overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500 animate-pulse">
            Loading orders from Neon database...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            No orders match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F9F7] border-b border-[#E5ECE7] text-[#718078] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Date / Time</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F6F9F7] transition-colors">
                    <td className="py-3.5 px-4 font-black text-[#17231C]">
                      #{o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Asia/Kolkata',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{o.customerName}</p>
                      <p className="text-[10px] text-gray-500">{o.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 text-xs text-gray-700">
                        {o.deliveryType === 'home_delivery' ? (
                          <><Truck className="w-3.5 h-3.5 text-[#16834A]" /> Home</>
                        ) : (
                          <><Store className="w-3.5 h-3.5 text-blue-600" /> Pickup</>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-gray-900">
                      {formatPrice(parseFloat(o.totalAmount))}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-gray-600">
                      {o.paymentMethod} • <span className={o.paymentStatus === 'completed' ? 'text-green-600' : 'text-amber-600'}>{o.paymentStatus}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          o.orderStatus === 'delivered'
                            ? 'bg-[#E8F5EC] text-[#16834A]'
                            : o.orderStatus === 'out_for_delivery'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : o.orderStatus === 'cancelled'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {o.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(o)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#16834A] hover:bg-[#E8F5EC] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ORDER DETAIL MODAL & WORKFLOW ACTIONS ── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#E5ECE7] space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE7]">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#16834A] bg-[#E8F5EC] px-2 py-0.5 rounded-md">
                  Order Management
                </span>
                <h2 className="text-xl font-black text-[#17231C] mt-1">
                  #{selectedOrder.orderNumber}
                </h2>
                <p className="text-xs text-[#718078]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setActionMessage('');
                }}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionMessage && (
              <div className="bg-[#E8F5EC] border border-[#16834A]/30 text-[#105C37] text-xs p-3.5 rounded-2xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16834A]" />
                <span>{actionMessage}</span>
              </div>
            )}

            {/* Customer & Delivery Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F6F9F7] p-4 rounded-2xl border border-[#E5ECE7]">
              <div>
                <p className="text-[10px] font-bold text-[#718078] uppercase">Customer</p>
                <p className="text-xs font-bold text-[#17231C] mt-0.5">{selectedOrder.customerName}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-[#16834A]" /> {selectedOrder.customerPhone}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-[#718078] uppercase">Delivery Address</p>
                <p className="text-xs text-gray-700 mt-0.5 leading-relaxed flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#16834A] shrink-0 mt-0.5" />
                  <span>{selectedOrder.deliveryAddress || 'Counter Pickup (Station Road, Pachora)'}</span>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-xs font-bold text-[#718078] uppercase mb-2">
                Ordered Items ({selectedOrder.items?.length || 0})
              </h3>
              <div className="divide-y divide-[#E5ECE7] border border-[#E5ECE7] rounded-2xl overflow-hidden">
                {(selectedOrder.items || []).map((item: any) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs hover:bg-[#F6F9F7]">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{item.productName}</p>
                        <p className="text-[10px] text-gray-500">
                          {item.quantity} × ₹{item.unitPrice} {item.unitValue ? `(${item.unitValue})` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-gray-900">
                      {formatPrice(parseFloat(item.totalPrice))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-center text-sm font-black text-[#17231C] pt-3 px-1">
                <span>Total Amount</span>
                <span className="text-base text-[#16834A]">
                  {formatPrice(parseFloat(selectedOrder.totalAmount))}
                </span>
              </div>
            </div>

            {/* Workflow Action Buttons */}
            <div className="pt-2 border-t border-[#E5ECE7]">
              <p className="text-xs font-bold text-[#17231C] mb-2.5">
                Update Status (Current: <strong className="uppercase text-[#16834A]">{selectedOrder.orderStatus}</strong>)
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedOrder.orderStatus === 'placed' && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Confirm Order
                  </button>
                )}

                {(selectedOrder.orderStatus === 'placed' || selectedOrder.orderStatus === 'confirmed') && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'packed')}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Mark as Packed
                  </button>
                )}

                {(selectedOrder.orderStatus === 'packed' || selectedOrder.orderStatus === 'confirmed') && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'out_for_delivery')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Out for Delivery
                  </button>
                )}

                {selectedOrder.orderStatus === 'out_for_delivery' && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                    className="px-3.5 py-2 bg-[#16834A] hover:bg-[#105C37] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Mark as Delivered
                  </button>
                )}

                {selectedOrder.orderStatus !== 'delivered' && selectedOrder.orderStatus !== 'cancelled' && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#D94B4B] border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

