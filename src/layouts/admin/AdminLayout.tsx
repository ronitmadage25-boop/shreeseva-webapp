import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  Package,
  Grid3X3,
  Boxes,
  Users,
  Truck,
  Tag,
  FileSpreadsheet,
  History,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  ShieldCheck,
  KeyRound,
  Store,
  ChevronDown,
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { cn } from '../../utils';

const ADMIN_NAV_ITEMS = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Grid3X3 },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Deliveries', href: '/admin/deliveries', icon: Truck },
  { label: 'Offers & Discounts', href: '/admin/offers', icon: Tag },
  { label: 'Reports', href: '/admin/reports', icon: FileSpreadsheet },
  { label: 'Activity Logs', href: '/admin/activity-logs', icon: History },
  { label: 'Store Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const { admin, isAuthenticated, logout, checkAuth, isForcedPasswordChangeOpen, updatePassword } = useAdminAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated && !localStorage.getItem('shree_seva_admin_token')) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleForcePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    const success = await updatePassword(newPassword);
    setIsUpdatingPassword(false);

    if (!success) {
      setPasswordError('Failed to change password. Please try again.');
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#F6F9F7] text-[#17231C] flex flex-col font-sans">
      {/* ── TOP NAVIGATION BAR (Green / White Modern Theme) ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5ECE7] h-16 flex items-center justify-between px-4 lg:px-6 shadow-2xs">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-[#718078] hover:text-[#16834A] hover:bg-[#E8F5EC] rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#16834A] rounded-xl flex items-center justify-center text-white shadow-xs">
              <Store className="w-5 h-5" strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-wide text-[#105C37]">
                  SHREE SEVA
                </span>
                <span className="bg-[#E8F5EC] text-[#16834A] text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-[#718078] font-medium leading-none">
                Single-Owner Dashboard • Pachora
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Quick Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders, products, inventory, customers..."
              className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl pl-9 pr-4 py-2 text-xs text-[#17231C] placeholder:text-[#718078] focus:outline-none focus:border-[#16834A] focus:ring-1 focus:ring-[#16834A] transition-all"
            />
          </div>
        </div>

        {/* Right: Date, Notifications, Profile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right pr-2 border-r border-[#E5ECE7]">
            <p className="text-xs font-bold text-[#17231C]">{todayFormatted}</p>
            <p className="text-[10px] text-[#718078]">Pachora, Maharashtra (IST)</p>
          </div>

          {/* Activity / Notification Bell */}
          <Link
            to="/admin/activity-logs"
            className="p-2 text-[#718078] hover:text-[#16834A] hover:bg-[#E8F5EC] rounded-xl transition-colors relative"
            title="Activity logs & notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="w-2 h-2 bg-[#16834A] rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-[#E8F5EC] rounded-xl transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#16834A] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {admin?.fullName?.[0] || 'O'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#17231C] leading-tight">
                  {admin?.fullName || 'Store Owner'}
                </p>
                <p className="text-[10px] text-[#718078] leading-tight">
                  @{admin?.username || 'admin'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#718078]" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5ECE7] rounded-2xl shadow-lg py-2 z-50 divide-y divide-[#E5ECE7]">
                <div className="px-4 py-2">
                  <p className="text-xs font-bold text-[#17231C]">{admin?.fullName || 'Store Owner'}</p>
                  <p className="text-[11px] text-[#718078]">Pachora, Maharashtra</p>
                  <span className="inline-block mt-1 bg-[#E8F5EC] text-[#16834A] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Authorized Owner
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/admin/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17231C] hover:bg-[#E8F5EC] hover:text-[#16834A] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#718078]" /> Store Settings
                  </Link>
                  <Link
                    to="/admin/activity-logs"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17231C] hover:bg-[#E8F5EC] hover:text-[#16834A] transition-colors"
                  >
                    <History className="w-4 h-4 text-[#718078]" /> Activity Logs
                  </Link>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#D94B4B] hover:bg-red-50 transition-colors text-left font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE: SIDEBAR + CONTENT ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-2xs"
          />
        )}

        {/* ── LEFT SIDEBAR (Desktop persistent, Mobile slide-over) ── */}
        <aside
          className={cn(
            'fixed lg:static top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-[#E5ECE7] flex flex-col justify-between py-4 transition-transform duration-200 ease-in-out shrink-0',
            isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'
          )}
        >
          {/* Nav List */}
          <nav className="space-y-1 px-3 overflow-y-auto flex-1">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#718078] mb-2">
              Management Menu
            </p>

            {ADMIN_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive = location.pathname === href;
              return (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all',
                    isActive
                      ? 'bg-[#16834A] text-white shadow-xs'
                      : 'text-[#718078] hover:text-[#16834A] hover:bg-[#E8F5EC]'
                  )}
                >
                  <Icon className={cn('w-4.5 h-4.5', isActive ? 'text-white' : 'text-[#718078]')} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Card & Logout */}
          <div className="p-3 border-t border-[#E5ECE7] space-y-2">
            <div className="bg-[#E8F5EC] rounded-2xl p-3 border border-[#16834A]/20">
              <div className="flex items-center gap-2 text-[#105C37] font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#16834A]" />
                <span>Protected Session</span>
              </div>
              <p className="text-[10px] text-[#718078] mt-0.5">
                Owner role verified via secure HTTP-only session.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[#D94B4B] hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ── FORCED FIRST-TIME PASSWORD CHANGE MODAL ── */}
      {isForcedPasswordChangeOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5ECE7]">
            <div className="w-12 h-12 bg-[#E8F5EC] text-[#16834A] rounded-2xl flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-black text-[#17231C]">
              Change Temporary Password
            </h2>
            <p className="text-xs text-[#718078] mt-1 mb-5">
              Welcome to the Shree Seva Owner Panel! For security reasons, you must change your initial temporary password before continuing.
            </p>

            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-3 rounded-xl mb-4 font-semibold">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleForcePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17231C] mb-1">
                  New Secure Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#16834A] focus:ring-1 focus:ring-[#16834A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17231C] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#16834A] focus:ring-1 focus:ring-[#16834A]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full bg-[#16834A] hover:bg-[#105C37] text-white py-3 rounded-xl text-xs font-black transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingPassword ? 'Updating Password...' : 'Save & Enter Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

