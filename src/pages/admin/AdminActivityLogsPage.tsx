import { useState, useEffect } from 'react';
import {
  History,
  RefreshCw,
  Search,
  AlertTriangle,
  FileText,
  KeyRound,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { adminApi } from '../../services/admin/adminClient';

interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
  user?: {
    id: string;
    fullName?: string;
    username?: string;
    role: string;
  };
}

export function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getActivityLogs(1);
      if (res.success) {
        setLogs(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('LOGIN') || act.includes('AUTH')) {
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: KeyRound };
    }
    if (act.includes('STOCK') || act.includes('INVENTORY')) {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Package };
    }
    if (act.includes('ORDER')) {
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ShoppingCart };
    }
    if (act.includes('DELETE')) {
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertTriangle };
    }
    return { bg: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText };
  };

  const filteredLogs = logs.filter((log) => {
    const act = log.action.toUpperCase();
    const matchesFilter =
      filterAction === 'ALL' ||
      (filterAction === 'AUTH' && (act.includes('LOGIN') || act.includes('AUTH') || act.includes('PASSWORD'))) ||
      (filterAction === 'INVENTORY' && (act.includes('STOCK') || act.includes('INVENTORY'))) ||
      (filterAction === 'ORDERS' && act.includes('ORDER')) ||
      (filterAction === 'PRODUCTS' && act.includes('PRODUCT'));

    const searchLower = searchTerm.toLowerCase();
    const detailsStr = typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '');
    const matchesSearch =
      !searchTerm ||
      log.action.toLowerCase().includes(searchLower) ||
      log.entityType.toLowerCase().includes(searchLower) ||
      log.user?.username?.toLowerCase().includes(searchLower) ||
      log.user?.fullName?.toLowerCase().includes(searchLower) ||
      detailsStr.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#17231C] tracking-tight">System Activity Logs</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Immutable security audit trail of administrative modifications, stock overrides, and owner actions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 p-2.5 rounded-xl border border-[#E5ECE7] bg-white text-[#718078] hover:text-[#16834A] hover:bg-[#F6F9F7] transition-colors self-start sm:self-auto text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E5ECE7]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5ECE7] focus:outline-none focus:border-[#16834A]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'AUTH', label: 'Auth & Logins' },
            { id: 'INVENTORY', label: 'Stock Changes' },
            { id: 'ORDERS', label: 'Orders' },
            { id: 'PRODUCTS', label: 'Products' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterAction(tab.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterAction === tab.id
                  ? 'bg-[#16834A] text-white shadow-xs'
                  : 'text-[#718078] hover:bg-[#F6F9F7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-2xl border border-[#E5ECE7] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-[#16834A] animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#718078]">Loading audit trail records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-10 h-10 text-[#718078]/40 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#17231C]">No logs recorded</h3>
            <p className="text-xs text-[#718078] mt-1 max-w-sm mx-auto">
              Owner activities, product edits, inventory adjustments, and status changes will be securely audited here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F9F7] text-[#718078] font-bold border-b border-[#E5ECE7]">
                <tr>
                  <th className="px-4 py-3.5">Timestamp (IST)</th>
                  <th className="px-4 py-3.5">Admin / Actor</th>
                  <th className="px-4 py-3.5">Action Type</th>
                  <th className="px-4 py-3.5">Target Entity</th>
                  <th className="px-4 py-3.5">Audit Details</th>
                  <th className="px-4 py-3.5 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE7]">
                {filteredLogs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const Icon = badge.icon;

                  let detailsText = '';
                  if (typeof log.details === 'string') {
                    detailsText = log.details;
                  } else if (log.details && typeof log.details === 'object') {
                    detailsText = Object.entries(log.details)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' • ');
                  }

                  return (
                    <tr key={log.id} className="hover:bg-[#F6F9F7]/60 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-[#718078] whitespace-nowrap">
                        <div className="font-semibold text-[#17231C]">
                          {new Date(log.createdAt).toLocaleDateString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px]">
                          {new Date(log.createdAt).toLocaleTimeString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#E8F5EC] text-[#16834A] flex items-center justify-center font-bold text-[10px]">
                            {log.user?.username?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-[#17231C]">
                              {log.user?.fullName || log.user?.username || 'Owner'}
                            </div>
                            <div className="text-[10px] text-[#718078] uppercase">{log.user?.role || 'owner'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.bg}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{log.action}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-[#718078]">
                        <span className="font-semibold text-[#17231C]">{log.entityType}</span>
                        {log.entityId && <span className="block text-[10px] truncate max-w-[120px]">#{log.entityId}</span>}
                      </td>
                      <td className="px-4 py-3.5 max-w-sm">
                        <span className="text-gray-700 font-mono text-[11px] line-clamp-2">
                          {detailsText || 'No extra metadata recorded.'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-[11px] text-[#718078]">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
