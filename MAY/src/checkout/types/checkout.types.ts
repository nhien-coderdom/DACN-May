export type CheckoutStep = 1 | 2 | 3;
export type PaymentMethod = "cod" | "vnpay";

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault?: boolean;
}