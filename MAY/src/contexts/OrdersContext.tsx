import React, { createContext, useContext, useState } from "react";
import axios from "axios";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type OrderLog = {
  id: number;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
};

export type OrderItemTopping = {
  id: number;
  toppingName: string;
  toppingPrice: number;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  productName: string;
  basePrice: number;
  toppings: OrderItemTopping[];

  // nếu BE include product
  product?: {
    id: number;
    name: string;
    image?: string | null;
  };
};

export type Order = {
  id: number;
  userId: number;
  total: number;
  status: OrderStatus;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  earnedPoint: number;
  usedPoint: number;
  isDeleted: boolean;
  items: OrderItem[];
  logs: OrderLog[];

  // nếu BE include user
  user?: {
    id: number;
    name?: string | null;
    email: string;
    phone?: string | null;
  };
};

type CreateOrderPayload = {
  userId: number;
  phone: string;
  address: string;
  usedPoint?: number;
  items: {
    productId: number;
    quantity: number;
    toppings?: {
      toppingName: string;
      toppingPrice: number;
    }[];
  }[];
};

type UpdateOrderInfoPayload = Partial<{
  phone: string;
  address: string;
}>;

type OrdersContextType = {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  getOrderById: (id: number) => Promise<Order | undefined>;
  createOrder: (payload: CreateOrderPayload) => Promise<Order>;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
  updateOrderInfo: (id: number, payload: UpdateOrderInfoPayload) => Promise<void>;
  cancelOrder: (id: number) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const API_URL = "http://localhost:3000/orders";

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { withCredentials: true });
      setOrders(res.data);
    } catch (error) {
      console.error("Fetch orders failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id: number) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Get order by id failed:", error);
      return undefined;
    }
  };

  const createOrder = async (payload: CreateOrderPayload) => {
    try {
      const res = await axios.post(API_URL, payload, {
        withCredentials: true,
      });

      const newOrder = res.data;
      setOrders((prev) => [newOrder, ...prev]);

      return newOrder;
    } catch (error) {
      console.error("Create order failed:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (id: number, status: OrderStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/${id}/status`,
        { status },
        { withCredentials: true }
      );

      const updatedOrder = res.data;

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
    } catch (error) {
      console.error("Update order status failed:", error);
      throw error;
    }
  };

  const updateOrderInfo = async (id: number, payload: UpdateOrderInfoPayload) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/info`, payload, {
        withCredentials: true,
      });

      const updatedOrder = res.data;

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
    } catch (error) {
      console.error("Update order info failed:", error);
      throw error;
    }
  };

  const cancelOrder = async (id: number) => {
    try {
      const res = await axios.patch(
        `${API_URL}/${id}/cancel`,
        {},
        { withCredentials: true }
      );

      const updatedOrder = res.data;

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
    } catch (error) {
      console.error("Cancel order failed:", error);
      throw error;
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });

      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Delete order failed:", error);
      throw error;
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        getOrderById,
        createOrder,
        updateOrderStatus,
        updateOrderInfo,
        cancelOrder,
        deleteOrder,
      }}
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