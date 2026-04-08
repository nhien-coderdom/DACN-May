import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/auth";

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
  fetchMe: () => Promise<void>;
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

  const fetchMe = async () => {
    try {
      const token = getAccessToken();

      if (!token) {
        setUser(null);
        return;
      }

      const res = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (error) {
      console.error("fetchMe failed:", error);

      // thử refresh access token nếu access token hết hạn
      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) throw new Error("No refresh token");

        const refreshRes = await axios.post(`${API_URL}/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = refreshRes.data.access_token;
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

        const meRes = await axios.get(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        setUser(meRes.data);
      } catch (refreshError) {
        console.error("refresh token failed:", refreshError);
        clearTokens();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
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
      console.error("login failed:", error);
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
      console.error("changePassword failed:", error);
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