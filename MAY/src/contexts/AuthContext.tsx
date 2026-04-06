import React, { createContext, useContext, useState } from "react";

export type User = {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  loyaltyPoints: number;
  totalSpent: number;
  joinedAt: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, fullName: string, password: string) => void;
  addPoints: (points: number) => void;
  usePoints: (points: number) => boolean;
  updateUserInfo: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USER: User = {
  id: 1,
  email: "user@example.com",
  fullName: "Nguyễn Văn A",
  phone: "0912345678",
  loyaltyPoints: 5000,
  totalSpent: 1500000,
  joinedAt: "2024-01-15",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Mock login - trong thực tế sẽ gọi API
    if (email && password) {
      setUser({ ...MOCK_USER, email });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = (email: string, fullName: string, password: string) => {
    // Mock register
    if (email && fullName && password) {
      setUser({
        id: Math.random(),
        email,
        fullName,
        loyaltyPoints: 0,
        totalSpent: 0,
        joinedAt: new Date().toISOString().split("T")[0],
      });
    }
  };

  const addPoints = (points: number) => {
    setUser((prev) =>
      prev ? { ...prev, loyaltyPoints: prev.loyaltyPoints + points } : null
    );
  };

  const usePoints = (points: number) => {
    if (!user || user.loyaltyPoints < points) {
      return false;
    }
    setUser({ ...user, loyaltyPoints: user.loyaltyPoints - points });
    return true;
  };

  const updateUserInfo = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        addPoints,
        usePoints,
        updateUserInfo,
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
