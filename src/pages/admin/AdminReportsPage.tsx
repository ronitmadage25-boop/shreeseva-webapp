import { useState } from 'react';
import {
  Download,
  CheckCircle2,
  TrendingUp,
  Package,
  Users,
  ShieldCheck,
} from 'lucide-react';

export function AdminReportsPage() {
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerDownload = async (endpoint: string, defaultFilename: string, reportKey: string) => {
    try {
      setDownloadingReport(reportKey);
      const token = localStorage.getItem('shree_seva_admin_token');
      const res = await fetch(`/api${endpoint}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Export failed with HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = defaultFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setToastMessage(`Report "${defaultFilename}" downloaded successfully.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to download report.');
    } finally {
      setDownloadingReport(null);
    }
  };

  const reportsList = [
    {
      key: 'sales',
      title: 'Sales & Order Transactions Report',
      description:
        'Complete chronological audit of all retail and online orders, payment modes (UPI/Cash/Online), order items, and revenue breakdown.',
      icon: TrendingUp,
      endpoint: '/admin/reports/sales/csv',
      filename: `shree-seva-sales-${new Date().toISOString().slice(0, 10)}.csv`,
      badge: 'Full Transaction History',
      metrics: 'Order #, Customer, Phone, Items, Status, Total',
    },
    {
      key: 'inventory',
      title: 'Inventory Valuation & Stock Levels',
      description:
        'Snapshot of current stock quantities, low stock thresholds, unit pack sizes, base prices, discounted prices, and catalog status.',
      icon: Package,
      endpoint: '/admin/reports/inventory/csv',
      filename: `shree-seva-inventory-${new Date().toISOString().slice(0, 10)}.csv`,
      badge: 'Real-time Stock Monitor',
      metrics: 'Product, Category, Pack Size, Price, Stock, Threshold',
    },
    {
      key: 'customers',
      title: 'Customer Directory & Lifetime Value',
      description:
        'Customer intelligence list for Pachora retail patrons, including contact phone numbers, registration dates, total orders, and lifetime expenditure.',
      icon: Users,
      endpoint: '/admin/reports/customers/csv',
      filename: `shree-seva-customers-${new Date().toISOString().slice(0, 10)}.csv`,
      badge: 'Patron Intelligence',
      metrics: 'Name, Phone, Email, Total Orders, Lifetime Spend',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#17231C] tracking-tight">Business Reports & Data Export</h1>
        <p className="text-xs text-[#718078] mt-0.5">
          Generate and export official CSV reports for bookkeeping, tax compliance, and stock accounting.
        </p>
      </div>

      {toastMessage && (
        <div className="bg-[#E8F5EC] border border-[#16834A]/30 text-[#16834A] text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reportsList.map((rep) => {
          const Icon = rep.icon;
          const isDownloading = downloadingReport === rep.key;

          return (
            <div
              key={rep.key}
              className="bg-white rounded-2xl border border-[#E5ECE7] p-5 flex flex-col justify-between hover:shadow-md hover:border-[#16834A]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#16834A] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#16834A] bg-[#E8F5EC] px-2.5 py-0.5 rounded-full">
                    {rep.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#17231C] mb-1.5">{rep.title}</h3>
                <p className="text-xs text-[#718078] leading-relaxed mb-4">{rep.description}</p>

                <div className="bg-[#F6F9F7] p-2.5 rounded-xl border border-[#E5ECE7] text-[11px] text-[#718078] mb-5">
                  <span className="font-bold text-[#17231C]">Includes: </span>
                  {rep.metrics}
                </div>
              </div>

              <button
                onClick={() => triggerDownload(rep.endpoint, rep.filename, rep.key)}
                disabled={isDownloading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#16834A] hover:bg-[#105C37] text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting CSV...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download CSV Report</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Compliance & Export Advice Box */}
      <div className="bg-[#F6F9F7] rounded-2xl border border-[#E5ECE7] p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#16834A] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-[#17231C]">Data Integrity & Formats</h4>
            <p className="text-[#718078] leading-relaxed">
              Exported CSV spreadsheets are encoded in UTF-8 with standard comma separators, fully compatible with Microsoft Excel, Google Sheets, Tally ERP, and Vyapar software. All timestamps are localized to Indian Standard Time (Asia/Kolkata).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
