import type { PaymentMethod } from "../types/checkout.types";
import { FiTruck, FiDollarSign } from "react-icons/fi";

export const CHECKOUT_STEPS = [
  { id: 1, title: "Địa chỉ" },
  { id: 2, title: "Thanh toán" },
  { id: 3, title: "Xác nhận" },
] as const;

export const POINTS_STEP = 1;
export const POINTS_TO_VND_RATE = 1;

export const PAYMENT_METHODS = [
  {
    id: "cod" as PaymentMethod,
    name: "Thanh toán khi nhận hàng (COD)",
    icon: FiTruck,
  },
  {
    id: "vnpay" as PaymentMethod,
    name: "VNPay (Cổng thanh toán trực tuyến)",
    icon: FiDollarSign,
  },
];