import { create } from 'zustand';
import { adminApi } from '../services/admin/adminClient';

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  phone: string;
  role: string;
  isTemporaryPassword: boolean;
}

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isForcedPasswordChangeOpen: boolean;

  login: (credentials: { username: string; password: string; rememberMe?: boolean }) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  updatePassword: (newPassword: string, currentPassword?: string) => Promise<boolean>;
  setForcedPasswordChangeOpen: (open: boolean) => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  admin: null,
  isAuthenticated: Boolean(localStorage.getItem('shree_seva_admin_token')),
  isLoading: false,
  error: null,
  isForcedPasswordChangeOpen: false,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminApi.login(credentials);
      if (res.success && res.token) {
        localStorage.setItem('shree_seva_admin_token', res.token);
        set({
          admin: res.admin,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          isForcedPasswordChangeOpen: res.admin.isTemporaryPassword,
        });
        return true;
      }
      set({ isLoading: false, error: 'Login failed. Please check credentials.' });
      return false;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Invalid owner username or password.',
        isAuthenticated: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await adminApi.logout();
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem('shree_seva_admin_token');
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isForcedPasswordChangeOpen: false,
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('shree_seva_admin_token');
    if (!token) {
      set({ admin: null, isAuthenticated: false });
      return false;
    }

    try {
      const res = await adminApi.getMe();
      if (res.success && res.admin) {
        set({
          admin: res.admin,
          isAuthenticated: true,
          isForcedPasswordChangeOpen: res.admin.isTemporaryPassword,
        });
        return true;
      }
      localStorage.removeItem('shree_seva_admin_token');
      set({ admin: null, isAuthenticated: false });
      return false;
    } catch {
      localStorage.removeItem('shree_seva_admin_token');
      set({ admin: null, isAuthenticated: false });
      return false;
    }
  },

  updatePassword: async (newPassword: string, currentPassword?: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminApi.changePassword({ currentPassword, newPassword });
      if (res.success) {
        set((state) => ({
          isLoading: false,
          isForcedPasswordChangeOpen: false,
          admin: state.admin ? { ...state.admin, isTemporaryPassword: false } : null,
        }));
        return true;
      }
      set({ isLoading: false, error: 'Failed to update password.' });
      return false;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Password update failed.' });
      return false;
    }
  },

  setForcedPasswordChangeOpen: (open) => set({ isForcedPasswordChangeOpen: open }),
}));

