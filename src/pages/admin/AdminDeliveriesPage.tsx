import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Phone,
  Navigation,
  CheckCircle2,
  RefreshCw,
  Search,
  Bike,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';

interface DeliveryRecord {
  id: string;
  orderId: string;
  deliveryPersonnelId?: string;
  deliveryStatus: string;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
  order?: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    landmark?: string;
    totalAmount: string;
    orderStatus: string;
    paymentMethod: string;
  };
  personnel?: {
    id: string;
    fullName: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
  };
}

interface DeliveryPersonnel {
  id: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  isActive: boolean;
  createdAt: string;
}

export function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [personnelList, setPersonnelList] = useState<DeliveryPersonnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
  const [assignEstTime, setAssignEstTime] = useState('30 minutes');
  const [submitting, setSubmitting] = useState(false);

  // Form State for new personnel
  const [partnerForm, setPartnerForm] = useState({
    fullName: '',
    phone: '',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'MH 19 ',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [delRes, perRes] = await Promise.all([
        adminApi.getDeliveries(),
        adminApi.getDeliveryPersonnel(),
      ]);

      if (delRes.success) setDeliveries(delRes.data || []);
      if (perRes.success) setPersonnelList(perRes.data || []);
    } catch (err: any) {
      console.error('Failed to load deliveries data:', err);
      setError(err.message || 'Failed to fetch deliveries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.fullName.trim() || !partnerForm.phone.trim()) {
      alert('Please fill in name and phone number.');
      return;
    }

    try {
      setSubmitting(true);
      await adminApi.createDeliveryPersonnel(partnerForm);
      setIsPersonnelModalOpen(false);
      setPartnerForm({ fullName: '', phone: '', vehicleType: 'Motorcycle', vehicleNumber: 'MH 19 ' });
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to register delivery partner.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedDelivery || !selectedPersonnelId) return;

    try {
      setSubmitting(true);
      await adminApi.assignDelivery(selectedDelivery.orderId, selectedPersonnelId, assignEstTime);
      setIsAssignModalOpen(false);
      setSelectedDelivery(null);
      setSelectedPersonnelId('');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to assign delivery driver.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesFilter =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && ['assigned', 'picked_up', 'in_transit'].includes(d.deliveryStatus.toLowerCase())) ||
      (statusFilter === 'DELIVERED' && d.deliveryStatus.toLowerCase() === 'delivered');

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      d.order?.orderNumber?.toLowerCase().includes(searchLower) ||
      d.order?.customerName?.toLowerCase().includes(searchLower) ||
      d.order?.customerPhone?.includes(searchLower) ||
      d.personnel?.fullName?.toLowerCase().includes(searchLower) ||
      d.order?.deliveryAddress?.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const activeDeliveriesCount = deliveries.filter((d) =>
    ['assigned', 'picked_up', 'in_transit'].includes(d.deliveryStatus.toLowerCase())
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#17231C] tracking-tight">Delivery Operations</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Manage local Pachora delivery dispatch, live assignments, and delivery fleet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-[#E5ECE7] bg-white text-[#718078] hover:text-[#16834A] hover:bg-[#F6F9F7] transition-colors"
            title="Refresh Deliveries"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsPersonnelModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#16834A] hover:bg-[#105C37] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Partner</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Fleet Overview Strip */}
      <div className="bg-white rounded-2xl border border-[#E5ECE7] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bike className="w-5 h-5 text-[#16834A]" />
            <h2 className="text-sm font-bold text-[#17231C]">Pachora Delivery Fleet ({personnelList.length} Active Partners)</h2>
          </div>
          <span className="text-[11px] font-semibold text-[#16834A] bg-[#E8F5EC] px-2.5 py-0.5 rounded-full">
            {activeDeliveriesCount} Active Dispatches Now
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {personnelList.map((p) => {
            const partnerActiveJobs = deliveries.filter(
              (d) =>
                d.deliveryPersonnelId === p.id &&
                ['assigned', 'picked_up', 'in_transit'].includes(d.deliveryStatus.toLowerCase())
            ).length;

            return (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-[#E5ECE7] bg-[#F6F9F7] flex items-center justify-between hover:border-[#16834A]/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-[#17231C]">{p.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#718078]">
                    <Phone className="w-3 h-3 text-[#16834A]" />
                    <span>{p.phone}</span>
                  </div>
                  <div className="text-[10px] text-[#718078] font-mono">
                    {p.vehicleType} • {p.vehicleNumber}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      partnerActiveJobs > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {partnerActiveJobs > 0 ? `${partnerActiveJobs} En Route` : 'Available'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Deliveries Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E5ECE7]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A] focus:ring-1 focus:ring-[#16834A]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Deliveries' },
            { id: 'ACTIVE', label: 'Active In-Transit' },
            { id: 'DELIVERED', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#16834A] text-white shadow-xs'
                  : 'text-[#718078] hover:bg-[#F6F9F7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Deliveries List */}
      <div className="bg-white rounded-2xl border border-[#E5ECE7] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-[#16834A] animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#718078]">Loading delivery records...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="p-12 text-center">
            <Truck className="w-10 h-10 text-[#718078]/40 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#17231C]">No delivery assignments found</h3>
            <p className="text-xs text-[#718078] mt-1 max-w-sm mx-auto">
              Home delivery orders placed by customers will appear here for driver assignment and live status dispatch.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F9F7] text-[#718078] font-bold border-b border-[#E5ECE7]">
                <tr>
                  <th className="px-4 py-3.5">Order #</th>
                  <th className="px-4 py-3.5">Customer & Phone</th>
                  <th className="px-4 py-3.5">Destination & Landmark</th>
                  <th className="px-4 py-3.5">Assigned Rider</th>
                  <th className="px-4 py-3.5">Delivery Status</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]">
                {filteredDeliveries.map((del) => {
                  const status = del.deliveryStatus.toLowerCase();
                  const isDelivered = status === 'delivered';
                  const isInTransit = ['assigned', 'picked_up', 'in_transit'].includes(status);

                  return (
                    <tr key={del.id} className="hover:bg-[#F6F9F7]/60 transition-colors">
                      <td className="px-4 py-3.5 font-bold font-mono text-[#17231C]">
                        {del.order?.orderNumber || del.orderId.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#17231C]">{del.order?.customerName || 'Customer'}</div>
                        <div className="text-[11px] text-[#718078] font-mono">{del.order?.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="line-clamp-2 text-gray-700">{del.order?.deliveryAddress || 'Pachora, Maharashtra'}</div>
                        {del.order?.landmark && (
                          <div className="text-[10px] text-[#16834A] font-semibold flex items-center gap-1 mt-0.5">
                            <Navigation className="w-2.5 h-2.5" /> Near {del.order.landmark}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {del.personnel ? (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <div>
                              <div className="font-bold text-[#17231C]">{del.personnel.fullName}</div>
                              <div className="text-[10px] text-[#718078] font-mono">
                                {del.personnel.phone} ({del.personnel.vehicleNumber})
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            isDelivered
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isInTransit
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isDelivered && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {isInTransit && <Truck className="w-3 h-3 text-blue-600" />}
                          <span className="capitalize">{del.deliveryStatus.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-[#17231C]">
                        ₹{parseFloat(del.order?.totalAmount || '0').toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedDelivery(del);
                            setSelectedPersonnelId(del.deliveryPersonnelId || personnelList[0]?.id || '');
                            setIsAssignModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-[#16834A] hover:bg-[#E8F5EC] px-2.5 py-1.5 rounded-lg transition-colors border border-[#16834A]/20"
                        >
                          {del.deliveryPersonnelId ? 'Reassign Rider' : 'Assign Rider'}
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

      {/* Modal: Register Delivery Partner */}
      {isPersonnelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5ECE7] p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#17231C] mb-1">Add Delivery Partner</h3>
            <p className="text-xs text-[#718078] mb-5">
              Register a local delivery personnel with their mobile phone and vehicle registration in Pachora.
            </p>

            <form onSubmit={handleRegisterPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17231C] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ganesh Patil"
                  value={partnerForm.fullName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, fullName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17231C] mb-1">Mobile Phone (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={partnerForm.phone}
                  onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17231C] mb-1">Vehicle Type</label>
                  <select
                    value={partnerForm.vehicleType}
                    onChange={(e) => setPartnerForm({ ...partnerForm, vehicleType: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                  >
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter / Activa</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Three-Wheeler">Auto Rickshaw</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17231C] mb-1">Vehicle Plate #</label>
                  <input
                    type="text"
                    placeholder="MH 19 BY 4412"
                    value={partnerForm.vehicleNumber}
                    onChange={(e) => setPartnerForm({ ...partnerForm, vehicleNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E5ECE7]">
                <button
                  type="button"
                  onClick={() => setIsPersonnelModalOpen(false)}
                  className="text-xs font-bold text-[#718078] hover:bg-[#F6F9F7] px-4 py-2 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#16834A] hover:bg-[#105C37] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Driver to Order */}
      {isAssignModalOpen && selectedDelivery && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5ECE7] p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#17231C] mb-1">
              Assign Rider to Order #{selectedDelivery.order?.orderNumber}
            </h3>
            <p className="text-xs text-[#718078] mb-4">
              Select a driver from your fleet to pick up and deliver this order in Pachora.
            </p>

            <div className="space-y-4">
              <div className="p-3 bg-[#F6F9F7] rounded-xl border border-[#E5ECE7] text-xs space-y-1">
                <div className="font-bold text-[#17231C]">Customer: {selectedDelivery.order?.customerName}</div>
                <div className="text-[#718078]">Address: {selectedDelivery.order?.deliveryAddress}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17231C] mb-1">Select Delivery Partner</label>
                <select
                  value={selectedPersonnelId}
                  onChange={(e) => setSelectedPersonnelId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                >
                  <option value="">-- Choose Partner --</option>
                  {personnelList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.vehicleNumber}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17231C] mb-1">Estimated Delivery Time</label>
                <input
                  type="text"
                  value={assignEstTime}
                  onChange={(e) => setAssignEstTime(e.target.value)}
                  placeholder="e.g. 25-30 minutes"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E5ECE7]">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="text-xs font-bold text-[#718078] hover:bg-[#F6F9F7] px-4 py-2 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignDriver}
                  disabled={submitting || !selectedPersonnelId}
                  className="bg-[#16834A] hover:bg-[#105C37] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
