import React, { createContext, useContext, useState } from "react";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  id: number;
  productId: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  toppings?: string[];
};

export type Order = {
  id: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  discountPoints: number;
  finalAmount: number;
  status: OrderStatus;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
};

type OrdersContextType = {
  orders: Order[];
  createOrder: (order: Omit<Order, "id" | "orderId" | "createdAt" | "updatedAt">) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (email: string) => Order[];
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderId: "ORD-001",
      items: [
        {
          id: 1,
          productId: 1,
          title: "MATCHA LATTE",
          image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80",
          price: 45000,
          quantity: 1,
          size: "M",
          toppings: ["Boba"],
        },
      ],
      totalAmount: 45000,
      discountPoints: 0,
      finalAmount: 45000,
      status: "delivered",
      customerName: "Nguyễn Văn A",
      email: "user@example.com",
      phone: "0912345678",
      address: "123 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM",
      paymentMethod: "cod",
      createdAt: "2024-04-01",
      updatedAt: "2024-04-02",
      estimatedDelivery: "2024-04-02",
    },
  ]);

  const createOrder = (order: Omit<Order, "id" | "orderId" | "createdAt" | "updatedAt">) => {
    const newOrder: Order = {
      ...order,
      id: String(orders.length + 1),
      orderId: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? { ...order, status, updatedAt: new Date().toISOString().split("T")[0] }
          : order
      )
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.orderId === orderId);
  };

  const getUserOrders = (email: string) => {
    return orders.filter((order) => order.email === email);
  };

  return (
    <OrdersContext.Provider
      value={{ orders, createOrder, updateOrderStatus, getOrderById, getUserOrders }}
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
