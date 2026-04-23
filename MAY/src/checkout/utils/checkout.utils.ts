import type { CheckoutFormData, PaymentMethod } from "../types/checkout.types";
import {
  POINTS_STEP,
  POINTS_TO_VND_RATE,
} from "../constants/checkout.constant";
import type { LoyaltyTier } from "../../contexts/AuthContext";

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

export const getDiscountPercentageByTier = (tier: LoyaltyTier | undefined): number => {
  if (tier === 'PLATINUM') return 0.1;
  if (tier === 'GOLD') return 0.05;
  return 0;
};

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
  [formData.address]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");

export const calculateCheckoutSummary = (
  subtotal: number,
  usePointsAmount: number,
  loyaltyTier?: LoyaltyTier
) => {
  const discountFromPoints = (usePointsAmount / POINTS_STEP) * POINTS_TO_VND_RATE;
  const discountPercentage = getDiscountPercentageByTier(loyaltyTier);
  const discountFromTier = Math.floor(subtotal * discountPercentage);
  const finalAmount = subtotal - discountFromPoints - discountFromTier;

  return {
    subtotal,
    discountFromPoints,
    discountFromTier,
    discountPercentage,
    finalAmount,
  };
};

export const getMaxPointsCanUse = (
  loyaltyPoints: number,
  subtotal: number,
  loyaltyTier?: LoyaltyTier
) => {
  const discountPercentage = getDiscountPercentageByTier(loyaltyTier);
  const discountFromTier = Math.floor(subtotal * discountPercentage);
  const remainingAmount = subtotal - discountFromTier;
  return Math.min(loyaltyPoints, Math.floor(remainingAmount / POINTS_TO_VND_RATE) * POINTS_STEP);
};

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