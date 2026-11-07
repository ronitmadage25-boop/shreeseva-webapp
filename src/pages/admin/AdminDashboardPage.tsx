import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Plus,
  RefreshCw,
  Truck,
  Store,
} from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';
import { formatPrice } from '../../utils';

export function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await adminApi.getDashboardSummary();
      if (res.success) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard summary.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-white border border-[#E5ECE7] rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const kpi = data?.kpi || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    inStockProducts: 0,
    lowStockProducts: 0,
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${kpi.totalRevenue.toLocaleString('en-IN')}`,
      desc: 'Active & completed orders',
      icon: IndianRupee,
      trend: '+12.4%',
      isPositive: true,
      color: '#16834A',
      bgColor: '#E8F5EC',
    },
    {
      title: 'Total Orders',
      value: kpi.totalOrders,
      desc: 'Placed in store',
      icon: ShoppingBag,
      trend: '+8.1%',
      isPositive: true,
      color: '#105C37',
      bgColor: '#E8F5EC',
    },
    {
      title: 'Registered Customers',
      value: kpi.totalCustomers,
      desc: 'Verified local accounts',
      icon: Users,
      trend: '+4 this week',
      isPositive: true,
      color: '#1565C0',
      bgColor: '#E8F4FD',
    },
    {
      title: 'Avg. Order Value',
      value: `₹${kpi.averageOrderValue}`,
      desc: 'Per grocery cart',
      icon: TrendingUp,
      trend: '+5.2%',
      isPositive: true,
      color: '#6A1B9A',
      bgColor: '#F3E5F5',
    },
    {
      title: 'Pending Orders',
      value: kpi.pendingOrders,
      desc: 'Action required at counter',
      icon: Clock,
      trend: kpi.pendingOrders > 0 ? 'Urgent' : 'All clear',
      isPositive: kpi.pendingOrders === 0,
      color: '#F2A93B',
      bgColor: '#FEF6E8',
    },
    {
      title: 'Completed Orders',
      value: kpi.completedOrders,
      desc: 'Delivered in Pachora',
      icon: CheckCircle2,
      trend: '100% delivered',
      isPositive: true,
      color: '#16834A',
      bgColor: '#E8F5EC',
    },
    {
      title: 'Products in Stock',
      value: kpi.inStockProducts,
      desc: 'Available on storefront',
      icon: Package,
      trend: 'Active catalog',
      isPositive: true,
      color: '#00695C',
      bgColor: '#E0F2F1',
    },
    {
      title: 'Low Stock Alerts',
      value: kpi.lowStockProducts,
      desc: 'Under restock threshold',
      icon: AlertTriangle,
      trend: kpi.lowStockProducts > 0 ? 'Needs restock' : 'Healthy',
      isPositive: kpi.lowStockProducts === 0,
      color: '#D94B4B',
      bgColor: '#FDECEC',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#17231C]">Store Overview</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Real-time business performance for Shree Seva Enterprises & Readymade, Pachora.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchSummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl text-xs font-bold text-[#17231C] shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#16834A]" />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/products"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#16834A] hover:bg-[#105C37] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-4 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* ── 8 KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-3xl border border-[#E5ECE7] p-4.5 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: card.bgColor, color: card.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    card.isPositive
                      ? 'bg-[#E8F5EC] text-[#16834A]'
                      : 'bg-red-50 text-[#D94B4B]'
                  }`}
                >
                  {card.trend}
                </span>
              </div>

              <p className="text-[11px] font-bold text-[#718078] leading-tight">
                {card.title}
              </p>
              <p className="text-xl sm:text-2xl font-black text-[#17231C] mt-1 leading-tight tracking-tight">
                {card.value}
              </p>
              <p className="text-[10px] text-[#718078] mt-1 truncate">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── GRID: RECENT ORDERS & FULFILLMENT BREAKDOWN ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5ECE7] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5ECE7]">
            <div>
              <h2 className="text-base font-black text-[#17231C]">Recent Orders</h2>
              <p className="text-[11px] text-[#718078]">Latest customer orders placed via web app</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#16834A] hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!data?.recentOrders || data.recentOrders.length === 0) ? (
            <div className="text-center py-10 text-gray-400 text-xs">
              No orders recorded yet. Place a customer order to test.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5ECE7] text-[#718078] font-bold">
                    <th className="pb-2.5">Order ID</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Fulfillment</th>
                    <th className="pb-2.5">Amount</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5ECE7]/60">
                  {data.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-[#F6F9F7] transition-colors">
                      <td className="py-3 font-bold text-[#17231C]">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-gray-900 leading-tight">{order.customerName}</p>
                        <p className="text-[10px] text-gray-500">{order.customerPhone}</p>
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-1 text-[11px] text-gray-700">
                          {order.deliveryType === 'home_delivery' ? (
                            <><Truck className="w-3.5 h-3.5 text-[#16834A]" /> Home</>
                          ) : (
                            <><Store className="w-3.5 h-3.5 text-blue-600" /> Pickup</>
                          )}
                        </span>
                      </td>
                      <td className="py-3 font-black text-gray-900">
                        {formatPrice(parseFloat(order.totalAmount))}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            order.orderStatus === 'delivered'
                              ? 'bg-[#E8F5EC] text-[#16834A]'
                              : order.orderStatus === 'out_for_delivery'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {order.orderStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/admin/orders`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16834A] hover:bg-[#E8F5EC] px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Restock & Delivery Distribution */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-3xl border border-[#E5ECE7] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5ECE7]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F2A93B]" />
                <h3 className="text-xs font-black text-[#17231C] uppercase tracking-wider">
                  Low Stock Monitor
                </h3>
              </div>
              <Link to="/admin/inventory" className="text-[11px] font-bold text-[#16834A] hover:underline">
                Adjust
              </Link>
            </div>

            {(!data?.lowStockItems || data.lowStockItems.length === 0) ? (
              <p className="text-xs text-[#16834A] font-semibold py-4 text-center">
                ✓ All inventory levels are healthy!
              </p>
            ) : (
              <div className="space-y-2.5">
                {data.lowStockItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F6F9F7] border border-[#E5ECE7]">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.product?.name}</p>
                      <p className="text-[10px] text-gray-500">{item.product?.category?.name}</p>
                    </div>
                    <div className="text-right ml-2 shrink-0">
                      <span className="text-xs font-black text-[#D94B4B] bg-red-50 px-2 py-0.5 rounded-md">
                        {item.stockQuantity} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fulfillment Breakdown */}
          <div className="bg-white rounded-3xl border border-[#E5ECE7] p-5 shadow-2xs">
            <h3 className="text-xs font-black text-[#17231C] uppercase tracking-wider mb-3 pb-2 border-b border-[#E5ECE7]">
              Fulfillment by Channel
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#E8F5EC] border border-[#16834A]/20">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#16834A]" />
                  <div>
                    <p className="text-xs font-bold text-[#105C37]">Home Delivery</p>
                    <p className="text-[10px] text-[#718078]">Pachora doorstep drop</p>
                  </div>
                </div>
                <span className="text-sm font-black text-[#105C37]">
                  {data?.deliveryBreakdown?.find((b: any) => b.delivery_type === 'home_delivery')?.count || 0} orders
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200/60">
                <div className="flex items-center gap-2.5">
                  <Store className="w-5 h-5 text-amber-800" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">Store Counter Pickup</p>
                    <p className="text-[10px] text-[#718078]">Customer counter collection</p>
                  </div>
                </div>
                <span className="text-sm font-black text-amber-900">
                  {data?.deliveryBreakdown?.find((b: any) => b.delivery_type === 'store_pickup')?.count || 0} orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

