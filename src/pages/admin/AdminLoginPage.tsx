import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error } = useAdminAuthStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin@2006');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!username.trim() || !password.trim()) {
      setLocalError('Please enter both username and password.');
      return;
    }

    const success = await login({
      username: username.trim(),
      password: password.trim(),
      rememberMe,
    });

    if (success) {
      navigate('/admin/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9F7] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#16834A] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-[#16834A]/20">
            <Store className="w-8 h-8" strokeWidth={2.4} />
          </div>
          <h1 className="text-2xl font-black text-[#17231C] tracking-tight">
            SHREE SEVA
          </h1>
          <p className="text-xs font-bold text-[#16834A] uppercase tracking-wider mt-0.5">
            Owner Admin Portal
          </p>
          <p className="text-xs text-[#718078] mt-1">
            Pachora, Maharashtra • Single Retail Store Management
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E5ECE7] shadow-xl p-7 relative overflow-hidden">
          {/* Top subtle decorative strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#16834A] to-[#105C37]" />

          <div className="mb-6">
            <h2 className="text-lg font-black text-[#17231C]">Store Owner Sign In</h2>
            <p className="text-xs text-[#718078] mt-0.5">
              Enter your authorized owner credentials to access store analytics and management.
            </p>
          </div>

          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 text-[#D94B4B] text-xs p-3.5 rounded-2xl mb-5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-semibold leading-relaxed">{error || localError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1.5">
                Username / Email / Mobile
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#17231C] placeholder:text-[#718078] focus:outline-none focus:border-[#16834A] focus:ring-1 focus:ring-[#16834A] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#F6F9F7] border border-[#E5ECE7] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#17231C] placeholder:text-[#718078] focus:outline-none focus:border-[#16834A] focus:ring-1 focus:ring-[#16834A] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718078] hover:text-[#17231C] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#718078]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#16834A] rounded-md"
                />
                <span>Remember session</span>
              </label>

              <span className="text-[11px] text-[#16834A] font-semibold">
                Protected Portal
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#16834A] hover:bg-[#105C37] text-white py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md shadow-[#16834A]/25 disabled:opacity-50 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Development Bootstrap Info Note */}
          <div className="mt-6 pt-5 border-t border-[#E5ECE7] text-[11px] text-[#718078] bg-[#F6F9F7] -mx-7 -mb-7 p-4 rounded-b-3xl">
            <div className="flex items-center gap-1.5 font-bold text-[#105C37] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16834A]" />
              <span>Development Initial Credentials:</span>
            </div>
            <p className="font-mono text-gray-600">
              User: <span className="text-gray-900 font-bold">admin</span> &nbsp;|&nbsp; Pass: <span className="text-gray-900 font-bold">admin@2006</span>
            </p>
            <p className="text-[10px] text-gray-500 mt-1 leading-tight">
              Temporary password will prompt for secure change on first login. All actions are logged.
            </p>
          </div>
        </div>

        {/* Back to Customer Web App link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-bold text-[#718078] hover:text-[#16834A] transition-colors"
          >
            ← Return to Customer Storefront
          </a>
        </div>
      </div>
    </div>
  );
}

