import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export type Topping = {
  id: number;
  name: string;
  price: number;
};

export type CartItem = {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  toppings?: Topping[];  // Topping với đầy đủ thông tin (id, name, price)
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_PREFIX = "may_cart";

const getCartStorageKey = (userId?: number) =>
  userId ? `${CART_STORAGE_PREFIX}_user_${userId}` : `${CART_STORAGE_PREFIX}_guest`;
const GUEST_CART_STORAGE_KEY = getCartStorageKey();

export const clearAllCartStorage = () => {
  try {
    const cartKeys = Object.keys(localStorage).filter(
      (key) =>
        key === GUEST_CART_STORAGE_KEY ||
        key.startsWith(`${CART_STORAGE_PREFIX}_user_`)
    );

    cartKeys.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Failed to clear cart storage:", error);
  }
};

const isSameItem = (a: CartItem, b: CartItem) =>
  a.id === b.id && JSON.stringify(a.toppings ?? []) === JSON.stringify(b.toppings ?? []);

const mergeCarts = (baseCart: CartItem[], incomingCart: CartItem[]) => {
  const merged = [...baseCart];

  incomingCart.forEach((incomingItem) => {
    const existingIndex = merged.findIndex((item) => isSameItem(item, incomingItem));

    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        quantity: merged[existingIndex].quantity + incomingItem.quantity,
      };
      return;
    }

    merged.push(incomingItem);
  });

  return merged;
};

// Hàm lưu cart vào localStorage
const saveCartToStorage = (storageKey: string, cart: CartItem[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

// Hàm khôi phục cart từ localStorage
const loadCartFromStorage = (storageKey: string): CartItem[] => {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const storageKey = getCartStorageKey(user?.id);

  // Khôi phục cart theo user hiện tại. Nếu vừa login thì gộp guest cart vào user cart.
  useEffect(() => {
    if (user?.id) {
      const userCart = loadCartFromStorage(storageKey);
      const guestCart = loadCartFromStorage(GUEST_CART_STORAGE_KEY);

      if (guestCart.length > 0) {
        const mergedCart = mergeCarts(userCart, guestCart);
        saveCartToStorage(storageKey, mergedCart);
        localStorage.removeItem(GUEST_CART_STORAGE_KEY);
        setCart(mergedCart);
      } else {
        setCart(userCart);
      }
    } else {
      const guestCart = loadCartFromStorage(GUEST_CART_STORAGE_KEY);
      setCart(guestCart);
    }

    setInitialized(true);
  }, [storageKey, user?.id]);

  // Lưu cart vào localStorage theo user hiện tại
  useEffect(() => {
    if (initialized) {
      saveCartToStorage(storageKey, cart);
    }
  }, [cart, initialized, storageKey]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => isSameItem(i, item));
      if (existing) {
        return prev.map((i) =>
         isSameItem(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (item: CartItem, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => !isSameItem(i, item));
      }

      return prev.map((i) =>
        isSameItem(i, item) ? { ...i, quantity } : i
      );
    });
  };

  const removeFromCart = (item: CartItem) => {
    setCart((prev) => prev.filter((i) => !isSameItem(i, item)));
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Failed to clear cart from localStorage:", error);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
