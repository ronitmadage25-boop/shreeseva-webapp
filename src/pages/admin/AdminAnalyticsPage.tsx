import { useState, useEffect } from 'react';
import {
  Calendar,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Clock,
  MapPin,
  Users,
  Sun,
  Sunset,
  Moon,
  Coffee,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart2,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { adminApi } from '../../services/admin/adminClient';
import { formatPrice } from '../../utils';

const DATE_RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'this_year', label: 'This Year' },
];

const STATUS_COLORS: Record<string, string> = {
  placed: '#F2A93B',
  confirmed: '#1565C0',
  packed: '#6A1B9A',
  out_for_delivery: '#00695C',
  delivered: '#16834A',
  cancelled: '#D94B4B',
};

export function AdminAnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('30d');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async (range: string) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await adminApi.getAnalyticsOverview(range);
      if (res.success) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedRange);
  }, [selectedRange]);

  // Derived metrics
  const revenueTimeline = data?.revenueTimeline?.map((item: any) => ({
    ...item,
    revenue: parseFloat(item.revenue || '0'),
    orders: parseInt(item.orders_count || '0', 10),
  })) || [];

  const totalPeriodRevenue = revenueTimeline.reduce((acc: number, curr: any) => acc + curr.revenue, 0);
  const totalPeriodOrders = revenueTimeline.reduce((acc: number, curr: any) => acc + curr.orders, 0);
  const periodAOV = totalPeriodOrders > 0 ? Math.round(totalPeriodRevenue / totalPeriodOrders) : 0;

  // Highest revenue day
  const highestDay = revenueTimeline.reduce((prev: any, curr: any) => {
    return (!prev || curr.revenue > prev.revenue) ? curr : prev;
  }, null);

  // Hourly Distribution
  const hourlyData = Array.from({ length: 24 }).map((_, h) => {
    const found = data?.hourlyOrders?.find((row: any) => row.hour === h);
    return {
      hour: `${h}:00`,
      orders: found ? parseInt(found.orders_count, 10) : 0,
      revenue: found ? parseFloat(found.revenue) : 0,
    };
  });

  const peakHour = hourlyData.reduce((prev: any, curr: any) => {
    return (!prev || curr.orders > prev.orders) ? curr : prev;
  }, null);

  // Status Pie Data
  const orderStatusData = (data?.orderStatuses || []).map((s: any) => ({
    name: s.status.replace(/_/g, ' ').toUpperCase(),
    value: parseInt(s.count, 10),
    color: STATUS_COLORS[s.status] || '#718078',
  }));

  return (
    <div className="space-y-6">
      {/* ── HEADER & GLOBAL DATE FILTERS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5ECE7]">
        <div>
          <h1 className="text-2xl font-black text-[#17231C]">Business Analytics</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Real sales trends, customer intelligence & ordering patterns in Pachora.
          </p>
        </div>

        {/* Global Date Range Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1 rounded-2xl border border-[#E5ECE7] shadow-2xs">
          {DATE_RANGES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedRange(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedRange === id
                  ? 'bg-[#16834A] text-white shadow-2xs'
                  : 'text-[#718078] hover:text-[#16834A] hover:bg-[#E8F5EC]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-4 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* ── HIGHLIGHT METRICS FOR SELECTED PERIOD ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-[#E5ECE7] p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#718078]">Period Revenue</p>
          <p className="text-2xl font-black text-[#16834A] mt-1">
            ₹{totalPeriodRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-[#718078] mt-1">
            Across {totalPeriodOrders} non-cancelled orders
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E5ECE7] p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#718078]">Average Order Value</p>
          <p className="text-2xl font-black text-[#17231C] mt-1">
            ₹{periodAOV.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-[#718078] mt-1">
            Highest ticket item: Atta / Oil
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E5ECE7] p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#718078]">Peak Ordering Hour</p>
          <p className="text-2xl font-black text-[#105C37] mt-1">
            {peakHour?.orders > 0 ? `${peakHour.hour} IST` : '10:00 AM IST'}
          </p>
          <p className="text-[10px] text-[#718078] mt-1">
            Highest volume ordering window
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E5ECE7] p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#718078]">Repeat Purchase Rate</p>
          <p className="text-2xl font-black text-[#6A1B9A] mt-1">
            {data?.customerIntelligence?.repeatPurchaseRate ?? 0}%
          </p>
          <p className="text-[10px] text-[#718078] mt-1">
            {data?.customerIntelligence?.repeatCustomers ?? 0} repeat retail buyers
          </p>
        </div>
      </div>

      {/* ── SECTION A: REVENUE OVER TIME (Line / Area Chart) ── */}
      <div className="bg-white rounded-3xl border border-[#E5ECE7] p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-black text-[#17231C]">Revenue & Order Volume Over Time</h2>
            <p className="text-xs text-[#718078]">Daily aggregate trajectory in selected period</p>
          </div>
          {highestDay && (
            <div className="mt-2 sm:mt-0 text-xs font-semibold text-[#16834A] bg-[#E8F5EC] px-3 py-1 rounded-xl">
              Peak Day: {highestDay.label} (₹{highestDay.revenue})
            </div>
          )}
        </div>

        <div className="h-72 w-full">
          {revenueTimeline.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[#718078]">
              No sales data in this date range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16834A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16834A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F2" />
                <XAxis dataKey="label" stroke="#718078" fontSize={11} tickLine={false} />
                <YAxis stroke="#718078" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`₹${val}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5ECE7', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#16834A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── SECTION B: TIME OF DAY & SHIFTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution Bar Chart */}
        <div className="bg-white rounded-3xl border border-[#E5ECE7] p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-[#17231C]">Orders by Hour of Day</h2>
              <p className="text-xs text-[#718078]">Local Pachora Time (Asia/Kolkata)</p>
            </div>
            <Clock className="w-5 h-5 text-[#16834A]" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F2" />
                <XAxis dataKey="hour" stroke="#718078" fontSize={10} interval={3} tickLine={false} />
                <YAxis stroke="#718078" fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [val, 'Orders']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5ECE7', fontSize: '12px' }}
                />
                <Bar dataKey="orders" fill="#16834A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4 Shift Cards (Morning, Afternoon, Evening, Night) */}
        <div className="bg-white rounded-3xl border border-[#E5ECE7] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-black text-[#17231C] mb-1">Time Slot Distribution</h2>
            <p className="text-xs text-[#718078] mb-5">Plan store counter staff & dispatch based on shift demand</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                title: 'Morning',
                hours: '6 AM - 11 AM',
                icon: Coffee,
                data: data?.timeSlotOrders?.find((s: any) => s.slot.includes('Morning')),
                color: '#E65100',
                bgColor: '#FFF3E0',
              },
              {
                title: 'Afternoon',
                hours: '11 AM - 4 PM',
                icon: Sun,
                data: data?.timeSlotOrders?.find((s: any) => s.slot.includes('Afternoon')),
                color: '#F57F17',
                bgColor: '#FFFDE7',
              },
              {
                title: 'Evening',
                hours: '4 PM - 9 PM',
                icon: Sunset,
                data: data?.timeSlotOrders?.find((s: any) => s.slot.includes('Evening')),
                color: '#16834A',
                bgColor: '#E8F5EC',
              },
              {
                title: 'Night',
                hours: '9 PM - 6 AM',
                icon: Moon,
                data: data?.timeSlotOrders?.find((s: any) => s.slot.includes('Night')),
                color: '#1565C0',
                bgColor: '#E8F4FD',
              },
            ].map(({ title, hours, icon: Icon, data: slotData, color, bgColor }) => (
              <div key={title} className="p-3.5 rounded-2xl bg-[#F6F9F7] border border-[#E5ECE7]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor, color }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#17231C]">{title}</p>
                    <p className="text-[10px] text-[#718078] leading-none">{hours}</p>
                  </div>
                </div>
                <p className="text-lg font-black text-[#17231C] mt-1">
                  {slotData?.count || 0} orders
                </p>
                <p className="text-[10px] text-[#718078]">
                  ₹{parseFloat(slotData?.revenue || '0').toLocaleString('en-IN')} revenue
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION C: ORDER STATUS DOUGHNUT & GEOGRAPHIC ANALYTICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Doughnut Chart */}
        <div className="bg-white rounded-3xl border border-[#E5ECE7] p-6 shadow-2xs">
          <h2 className="text-base font-black text-[#17231C] mb-1">Order Status Pipeline</h2>
          <p className="text-xs text-[#718078] mb-4">Breakdown of orders in selected period</p>

          <div className="h-56 w-full">
            {orderStatusData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#718078]">
                No orders available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5ECE7', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {orderStatusData.map((entry: any) => (
              <span key={entry.name} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}: {entry.value}
              </span>
            ))}
          </div>
        </div>

        {/* Geographic Analytics (Pachora Localities Map & Demand List) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5ECE7] p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-black text-[#17231C]">Geographic Delivery Demand</h2>
              <p className="text-xs text-[#718078]">Aggregated order volume across Pachora town areas</p>
            </div>
            <MapPin className="w-5 h-5 text-[#16834A]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {(data?.geographicOrders || []).map((loc: any) => (
              <div
                key={loc.area}
                className="p-3.5 rounded-2xl bg-[#F6F9F7] border border-[#E5ECE7] hover:border-[#16834A]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#16834A] shrink-0" />
                    <p className="text-xs font-bold text-[#17231C]">{loc.area}</p>
                  </div>
                  <span className="text-xs font-black text-[#16834A] bg-[#E8F5EC] px-2 py-0.5 rounded-md">
                    {loc.orders} orders
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#718078] mt-2 pt-2 border-t border-[#E5ECE7]">
                  <span>{loc.customers} unique customers</span>
                  <span className="font-bold text-gray-900">₹{loc.revenue} generated</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION D: PRODUCT PERFORMANCE & CATEGORY REVENUE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Table */}
        <div className="bg-white rounded-3xl border border-[#E5ECE7] p-6 shadow-2xs">
          <h2 className="text-base font-black text-[#17231C] mb-1">Top Selling Products</h2>
          <p className="text-xs text-[#718078] mb-4">Highest units sold in Pachora store</p>

          <div className="space-y-3">
            {(data?.topProducts || []).map((prod: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F6F9F7] border border-[#E5ECE7]">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'}
                    alt={prod.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                    <p className="text-[10px] text-[#16834A] font-bold">{prod.units_sold} units sold</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-gray-900">
                    {formatPrice(parseFloat(prod.revenue))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue Distribution */}
        <div className="bg-white rounded-3xl border border-[#E5ECE7] p-6 shadow-2xs">
          <h2 className="text-base font-black text-[#17231C] mb-1">Category Revenue Contribution</h2>
          <p className="text-xs text-[#718078] mb-4">Gross sales value grouped by department</p>

          <div className="space-y-3.5">
            {(data?.categoryRevenue || []).map((cat: any) => {
              const rev = parseFloat(cat.revenue || '0');
              const pct = totalPeriodRevenue > 0 ? Math.round((rev / totalPeriodRevenue) * 100) : 0;
              return (
                <div key={cat.category}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-gray-800">{cat.category}</span>
                    <span className="font-black text-[#16834A]">{formatPrice(rev)} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#F0F4F2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#16834A] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

