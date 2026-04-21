import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

const API_URL = `${API_BASE_URL}/auth`;

export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export type LoyaltyTier = 'NORMAL' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type User = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  address?: string | null;
  createdAt?: string;
  loyaltyPoint?: number;
  loyaltyTier?: LoyaltyTier;
  totalOrders: number;
  totalSpent: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: (tokenOverride?: string) => Promise<void>;
  updateUserInfo: (updates: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
  const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

  const fetchMe = async (tokenOverride?: string) => {
    try {
      // Use provided token or get from storage
      const token = tokenOverride || getAccessToken();

      if (!token) {
        console.warn('⚠️ No token available for fetchMe()');
        setUser(null);
        return;
      }

      console.log('📝 Fetching user data with token...');
      const res = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ User data fetched successfully:', res.data);
      setUser(res.data);
    } catch (error: any) {
      console.error("❌ Lấy thông tin người dùng thất bại:", error);

      // thử refresh access token nếu access token hết hạn
      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) throw new Error("No refresh token");

        console.log('🔄 Refreshing access token...');
        const refreshRes = await axios.post(`${API_URL}/refresh`, {
          refreshToken,
        });

        const newAccessToken = refreshRes.data.access_token;
        
        // Try to save new token
        try {
          localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
          console.log('✅ New token saved to localStorage');
        } catch (storageErr) {
          console.warn('⚠️ Could not save new token to localStorage:', storageErr);
        }

        const meRes = await axios.get(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        console.log('✅ User data fetched after token refresh:', meRes.data);
        setUser(meRes.data);
      } catch (refreshError: any) {
        console.error("❌ Làm mới token thất bại:", refreshError);
        clearTokens();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { access_token, refresh_token } = res.data;

      saveTokens(access_token, refresh_token);

      await fetchMe();
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const updateUserInfo = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      const token = getAccessToken();

      if (!token) throw new Error("No access token");

      await axios.post(
        `${API_URL}/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Thay đổi mật khẩu thất bại:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        fetchMe,
        updateUserInfo,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}