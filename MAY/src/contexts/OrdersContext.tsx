import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type OrderItemTopping = {
  id?: number;
  orderItemId?: number;
  toppingName: string;
  toppingPrice: number;
};

export type OrderItem = {
  id: number;
  quantity: number;
  // Backend schema fields
  orderId?: number;
  productId?: number;
  productName?: string;
  basePrice?: number;
  toppings?: OrderItemTopping[];
  // Legacy fields (CartItem compatibility)
  title?: string;
  image?: string;
  price?: number;
  size?: string;
};

export type Order = {
  id: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  // Backend schema fields
  userId?: number;
  phone?: string;
  address?: string;
  total?: number;
  usedPoint?: number;
  earnedPoint?: number;
  user?: { id?: number; name?: string; email?: string };
  // Legacy fields (Checkout compatibility)
  orderId?: string;
  totalAmount?: number;
  discountPoints?: number;
  finalAmount?: number;
  customerName?: string;
  email?: string;
  paymentMethod?: string;
};

type OrdersContextType = {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void;
  updateOrderStatus: (orderId: number | string, status: OrderStatus) => void;
  getOrderById: (orderId: number | string) => Order | undefined;
  getUserOrders: (email: string) => Order[];
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get<Order[]>(`${API_BASE_URL}/orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrders(response.data);
    } catch (error) {
      console.error("fetchOrders failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      orderId: order.orderId ?? `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: number | string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId || order.orderId === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const getOrderById = (orderId: number | string) => {
    return orders.find((order) => order.id === orderId || order.orderId === String(orderId));
  };

  const getUserOrders = (email: string) => {
    return orders.filter((order) => order.email === email);
  };

  return (
    <OrdersContext.Provider
      value={{ orders, loading, fetchOrders, createOrder, updateOrderStatus, getOrderById, getUserOrders }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider");
  }
  return context;
}
