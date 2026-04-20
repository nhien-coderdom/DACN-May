import type { CheckoutFormData, PaymentMethod } from "../types/checkout.types";
import {
  POINTS_STEP,
  POINTS_TO_VND_RATE,
} from "../constants/checkout.constant";

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

export const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case "cod":
      return "Thanh toán khi nhận hàng";
    case "vnpay":
      return "VNPay";
    default:
      return "Không xác định";
  }
};

export const getFullAddress = (formData: CheckoutFormData) =>
  [formData.address, formData.ward, formData.district, formData.city]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");

export const calculateCheckoutSummary = (
  subtotal: number,
  usePointsAmount: number
) => {
  const discountFromPoints = (usePointsAmount / POINTS_STEP) * POINTS_TO_VND_RATE;
  const finalAmount = subtotal - discountFromPoints;

  return {
    subtotal,
    discountFromPoints,
    finalAmount,
  };
};

export const getMaxPointsCanUse = (
  loyaltyPoints: number,
  subtotal: number
) => Math.min(loyaltyPoints, Math.floor(subtotal / POINTS_TO_VND_RATE) * POINTS_STEP);

export const getToppingNames = (toppings?: unknown[]) => {
  if (!Array.isArray(toppings)) return [];

  return toppings
    .map((topping) => {
      if (typeof topping === "string") return topping;

      if (
        typeof topping === "object" &&
        topping !== null &&
        "name" in topping &&
        typeof (topping as { name?: unknown }).name === "string"
      ) {
        return (topping as { name: string }).name;
      }

      return "";
    })
    .filter(Boolean);
};