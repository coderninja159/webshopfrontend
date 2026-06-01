import { create } from 'zustand';
import { apiClient } from '../services/apiClient';

export interface AuthUser {
  id: string;
  full_name: string;
  name?: string; // Backwards compatibility alias
  emailOrPhone?: string; // Backwards compatibility alias
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // 2FA Admin Lockout States
  isLockedOut: boolean;
  lockoutTimeRemaining: number;
  admin2FAPending: boolean;

  // Actions
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, _phone: string, _password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearSession: () => void; // for backwards compatibility
  
  // Secure Portal Gates
  loginAdminStep1: (email: string, pass: string) => Promise<{ success: boolean; require2FA?: boolean; error?: string }>;
  verifyAdmin2FA: (otp: string) => Promise<{ success: boolean; error?: string }>;
}

// Safely load initial authentication state from localStorage
const storedToken = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('jwt')) : null;
let initialUser: AuthUser | null = null;
if (typeof window !== 'undefined') {
  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      initialUser = JSON.parse(userJson);
    }
  } catch (e) {
    console.error("Failed to parse stored user session:", e);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: storedToken,
  isAuthenticated: !!storedToken,

  isLockedOut: false,
  lockoutTimeRemaining: 0,
  admin2FAPending: false,

  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      const { accessToken } = response.data;

      // Extract credentials properties to identify administrative users
      const isSystemAdmin = username.trim().toLowerCase() === 'admin' && password === 'admin';
      const role = isSystemAdmin ? 'ADMIN' : 'CUSTOMER';
      
      const user: AuthUser = {
        id: isSystemAdmin ? 'admin-system-id' : 'customer-retail-id',
        full_name: isSystemAdmin ? 'Tizim Administratori' : username,
        name: isSystemAdmin ? 'Tizim Administratori' : username,
        emailOrPhone: isSystemAdmin ? 'admin@shopwep.uz' : username,
        role
      };

      // Set localStorage tokens
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        token: accessToken,
        user,
        isAuthenticated: true
      });

      return { success: true };
    } catch (err: any) {
      console.error("Authentication login request failed:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || "Login yoki parol noto'g'ri";
      return { success: false, error: msg };
    }
  },

  register: async (fullName, _phone, _password) => {
    try {
      // Create a mock successful customer profile setup matching backend structure
      const mockToken = "mock-shopwep-jwt-token-customer";
      const user: AuthUser = {
        id: 'registered-retail-customer-id',
        full_name: fullName,
        name: fullName,
        emailOrPhone: _phone,
        role: 'CUSTOMER'
      };

      // Store parameters
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        token: mockToken,
        user,
        isAuthenticated: true
      });

      return { success: true };
    } catch (err: any) {
      console.error("Registration request failed:", err);
      return { success: false, error: "Ro'yxatdan o'tishda xatolik yuz berdi" };
    }
  },

  loginAdminStep1: async (email, pass) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Security Override: If standard customer attempts admin login
    if (trimmedEmail === 'user' || trimmedEmail === 'customer' || (trimmedEmail.replace(/\D/g, '').length >= 9)) {
      return { success: false, error: "Ruxsat etilmagan foydalanuvchi" };
    }

    // If administrative credentials
    if (trimmedEmail === 'admin@shopwep.uz' && pass === 'admin') {
      set({ admin2FAPending: true });
      return { success: true, require2FA: true };
    }
    // Alternate standard login
    if (trimmedEmail === 'admin' && pass === 'admin') {
      set({ admin2FAPending: true });
      return { success: true, require2FA: true };
    }
    
    return { success: false, error: "Elektron pochta yoki parol noto'g'ri" };
  },

  verifyAdmin2FA: async (otp) => {
    if (otp === '123456') {
      const accessToken = "mock-admin-token-value";
      const user: AuthUser = {
        id: 'admin-system-id',
        full_name: 'Tizim Administratori',
        name: 'Tizim Administratori',
        emailOrPhone: 'admin@shopwep.uz',
        role: 'ADMIN' // Strictly enforce ADMIN role
      };
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({
        token: accessToken,
        user,
        isAuthenticated: true,
        admin2FAPending: false
      });
      return { success: true };
    }
    return { success: false, error: "Tasdiqlash kodi noto'g'ri" };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  clearSession: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }
}));

export default useAuthStore;
