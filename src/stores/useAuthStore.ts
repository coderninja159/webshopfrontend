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
  tempAdminToken: string | null;
  tempAdminUser: AuthUser | null;

  // Actions
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearSession: () => void; // for backwards compatibility
  
  // Secure Portal Gates
  loginAdminStep1: (email: string, pass: string) => Promise<{ success: boolean; require2FA?: boolean; error?: string }>;
  verifyAdmin2FA: (otp: string) => Promise<{ success: boolean; error?: string }>;
}

// Pure JS base64 decoder for JWT payload
export const decodeJwt = (token: string | null): any => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decoding failed:", e);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  const claims = decodeJwt(token);
  if (!claims || !claims.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return claims.exp < now;
};

// Safely load initial state
const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token') || localStorage.getItem('jwt');
  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    return null;
  }
  return token;
};

const storedToken = getStoredToken();
let initialUser: AuthUser | null = null;
if (storedToken && typeof window !== 'undefined') {
  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      initialUser = JSON.parse(userJson);
    }
  } catch (e) {
    console.error("Failed to parse stored user session:", e);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  token: storedToken,
  isAuthenticated: !!storedToken,

  isLockedOut: false,
  lockoutTimeRemaining: 0,
  admin2FAPending: false,
  tempAdminToken: null,
  tempAdminUser: null,

  login: async (username, password) => {
    try {
      // Normalize user input to Uzbekistan phone format if digit-only
      let identifier = username.trim();
      if (/^\d+$/.test(identifier.replace(/\+/g, ''))) {
        identifier = "+" + identifier.replace(/\D/g, '');
      }

      const response = await apiClient.post('/auth/login', { phone_number: identifier, password });
      const { accessToken } = response.data;

      const claims = decodeJwt(accessToken);
      if (!claims) {
        throw new Error("Invalid JWT token structure");
      }

      const user: AuthUser = {
        id: claims.id,
        full_name: claims.full_name || identifier,
        name: claims.full_name || identifier,
        emailOrPhone: claims.sub || identifier,
        role: claims.role
      };

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

  register: async (fullName, phone, password) => {
    try {
      const formattedPhone = "+" + phone.replace(/\D/g, '');
      const response = await apiClient.post('/auth/register', {
        phone_number: formattedPhone,
        full_name: fullName,
        password: password
      });
      const { accessToken } = response.data;

      const claims = decodeJwt(accessToken);
      if (!claims) {
        throw new Error("Invalid JWT token structure");
      }

      const user: AuthUser = {
        id: claims.id,
        full_name: claims.full_name || fullName,
        name: claims.full_name || fullName,
        emailOrPhone: claims.sub || formattedPhone,
        role: claims.role
      };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        token: accessToken,
        user,
        isAuthenticated: true
      });

      return { success: true };
    } catch (err: any) {
      console.error("Registration request failed:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || "Ro'yxatdan o'tishda xatolik yuz berdi";
      return { success: false, error: msg };
    }
  },

  loginAdminStep1: async (email, pass) => {
    try {
      const response = await apiClient.post('/auth/login', { phone_number: email.trim(), password: pass });
      const { accessToken } = response.data;

      const claims = decodeJwt(accessToken);
      if (!claims || claims.role !== 'ADMIN') {
        return { success: false, error: "Ruxsat etilmagan foydalanuvchi" };
      }

      const user: AuthUser = {
        id: claims.id,
        full_name: claims.full_name || email,
        name: claims.full_name || email,
        emailOrPhone: claims.sub || email,
        role: claims.role
      };

      set({
        admin2FAPending: true,
        tempAdminToken: accessToken,
        tempAdminUser: user
      });

      return { success: true, require2FA: true };
    } catch (err: any) {
      console.error("Admin step 1 authentication failed:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || "Elektron pochta yoki parol noto'g'ri";
      return { success: false, error: msg };
    }
  },

  verifyAdmin2FA: async (otp) => {
    if (otp === '123456') {
      const { tempAdminToken, tempAdminUser } = get();
      if (!tempAdminToken || !tempAdminUser) {
        return { success: false, error: "Sessiya muddati tugagan. Iltimos qaytadan urining." };
      }

      localStorage.setItem('token', tempAdminToken);
      localStorage.setItem('user', JSON.stringify(tempAdminUser));

      set({
        token: tempAdminToken,
        user: tempAdminUser,
        isAuthenticated: true,
        admin2FAPending: false,
        tempAdminToken: null,
        tempAdminUser: null
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
