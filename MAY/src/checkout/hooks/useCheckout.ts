import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useOrders } from "../../contexts/OrdersContext";
import { useProfile } from "../../profile/hooks/useProfile";

import type {
  CheckoutFormData,
  CheckoutStep,
  SavedAddress,
} from "../types/checkout.types";
import {
  calculateCheckoutSummary,
  getFullAddress,
  getMaxPointsCanUse,
} from "../utils/checkout.utils";
import { API_BASE_URL } from "../../lib/api";

const mapPaymentMethodToBackend = (
  method: CheckoutFormData["paymentMethod"]
): "CASH" | "VNPAY" => (method === "cod" ? "CASH" : "VNPAY");

const ADDRESS_STORAGE_PREFIX = "may_saved_addresses";
const ADDRESS_BOOK_PREFIX = "__MAY_ADDR_BOOK__:";

const getAddressStorageKey = (userId?: number) =>
  userId
    ? `${ADDRESS_STORAGE_PREFIX}_user_${userId}`
    : `${ADDRESS_STORAGE_PREFIX}_guest`;

const mapProfileAddressToSavedAddresses = (
  rawAddress: string,
  fallbackContact: { fullName: string; email: string; phone: string }
): SavedAddress[] => {
  const safeAddress = rawAddress.trim();
  if (!safeAddress) return [];

  if (!safeAddress.startsWith(ADDRESS_BOOK_PREFIX)) {
    return [
      {
        id: "profile-seed-0",
        ...fallbackContact,
        address: safeAddress,
        city: "",
        district: "",
        ward: "",
        isDefault: true,
      },
    ];
  }

  try {
    const payload = JSON.parse(safeAddress.slice(ADDRESS_BOOK_PREFIX.length)) as {
      selectedAddressId?: string | null;
      addresses?: Array<{
        id?: string;
        address?: string;
        city?: string;
        district?: string;
        ward?: string;
        isDefault?: boolean;
      }>;
    };

    if (!Array.isArray(payload.addresses) || payload.addresses.length === 0) {
      return [];
    }

    const normalized = payload.addresses
      .filter((item) => typeof item?.address === "string" && item.address.trim().length > 0)
      .map((item, index) => ({
        id: item.id || `profile-seed-${index}`,
        ...fallbackContact,
        address: (item.address || "").trim(),
        city: item.city || "",
        district: item.district || "",
        ward: item.ward || "",
        isDefault: Boolean(item.isDefault),
      }));

    if (normalized.length === 0) return [];

    const selectedId =
      normalized.find((item) => item.id === payload.selectedAddressId)?.id ||
      normalized.find((item) => item.isDefault)?.id ||
      normalized[0].id;

    return normalized.map((item) => ({
      ...item,
      isDefault: item.id === selectedId,
    }));
  } catch {
    return [
      {
        id: "profile-seed-0",
        ...fallbackContact,
        address: safeAddress,
        city: "",
        district: "",
        ward: "",
        isDefault: true,
      },
    ];
  }
};

export function useCheckout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user, fetchMe } = useAuth();
  const { createOrder } = useOrders();
  const token = localStorage.getItem("access_token");
  const { data: profileData, isLoading: isProfileLoading } = useProfile(token);
  const addressStorageKey = getAddressStorageKey(user?.id);
  const hydratedStorageKeyRef = useRef<string | null>(null);

  const [step, setStep] = useState<CheckoutStep>(1);
  const [usePointsAmount, setUsePointsAmount] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(savedAddresses.length === 0);
  const [setAsDefaultAddress, setSetAsDefaultAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    district: "",
    ward: "",
    notes: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (!user) return;
    if (hydratedStorageKeyRef.current === addressStorageKey) return;

    try {
      const raw = localStorage.getItem(addressStorageKey);
      const parsed = raw ? (JSON.parse(raw) as SavedAddress[]) : [];
      const loaded = Array.isArray(parsed) ? parsed : [];

      let initialAddresses = loaded;
      if (initialAddresses.length === 0 && isProfileLoading) {
        return;
      }

      if (initialAddresses.length === 0 && profileData?.address) {
        initialAddresses = mapProfileAddressToSavedAddresses(profileData.address, {
          fullName: profileData.name || user.name || "",
          email: profileData.email || user.email || "",
          phone: profileData.phone || user.phone || "",
        });
      }

      setSavedAddresses(initialAddresses);

      if (initialAddresses.length === 0) {
        setSelectedAddressId(null);
        setIsAddingNewAddress(true);
        setEditingAddressId(null);
        setSetAsDefaultAddress(false);
        setFormData((prev) => ({
          ...prev,
          fullName: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: "",
          city: "",
          district: "",
          ward: "",
        }));
        return;
      }

      const defaultAddress =
        initialAddresses.find((address) => address.isDefault) || initialAddresses[0];
      setSelectedAddressId(defaultAddress.id);
      setIsAddingNewAddress(false);
      setEditingAddressId(null);
      setSetAsDefaultAddress(false);
      setFormData((prev) => ({
        ...prev,
        fullName: defaultAddress.fullName,
        email: defaultAddress.email,
        phone: defaultAddress.phone,
        address: defaultAddress.address,
        city: defaultAddress.city,
        district: defaultAddress.district,
        ward: defaultAddress.ward,
      }));
      hydratedStorageKeyRef.current = addressStorageKey;
    } catch (error) {
      console.error("Failed to load saved addresses:", error);
      setSavedAddresses([]);
      setSelectedAddressId(null);
      setIsAddingNewAddress(true);
      hydratedStorageKeyRef.current = addressStorageKey;
    }
  }, [
    addressStorageKey,
    isProfileLoading,
    profileData?.address,
    profileData?.email,
    profileData?.name,
    profileData?.phone,
    user?.email,
    user?.id,
    user?.name,
    user?.phone,
    user,
  ]);

  useEffect(() => {
    try {
      localStorage.setItem(addressStorageKey, JSON.stringify(savedAddresses));
    } catch (error) {
      console.error("Failed to save addresses:", error);
    }
  }, [addressStorageKey, savedAddresses]);

  const subtotal = getTotalPrice();

  const {discountFromPoints, finalAmount } =
    calculateCheckoutSummary(subtotal, usePointsAmount);

  const maxPointsCanUse = getMaxPointsCanUse(
    user?.loyaltyPoint || 0,
    subtotal
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackStep = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as CheckoutStep) : prev));
  };

  const onSelectAddress = (addressId: string) => {
    const selected = savedAddresses.find((address) => address.id === addressId);
    if (!selected) return;

    setSelectedAddressId(addressId);
    setIsAddingNewAddress(false);
    setEditingAddressId(null);
    setFormData((prev) => ({
      ...prev,
      fullName: selected.fullName,
      email: selected.email,
      phone: selected.phone,
      address: selected.address,
      city: selected.city,
      district: selected.district,
      ward: selected.ward,
    }));
  };

  const onEditAddress = (addressId: string) => {
    const selected = savedAddresses.find((address) => address.id === addressId);
    if (!selected) return;

    setEditingAddressId(addressId);
    setIsAddingNewAddress(true);
    setSelectedAddressId(addressId);
    setSetAsDefaultAddress(Boolean(selected.isDefault));
    setFormData((prev) => ({
      ...prev,
      fullName: selected.fullName,
      email: selected.email,
      phone: selected.phone,
      address: selected.address,
      city: selected.city,
      district: selected.district,
      ward: selected.ward,
    }));
  };

  const onDeleteAddress = (addressId: string) => {
    setSavedAddresses((prev) => {
      const next = prev.filter((address) => address.id !== addressId);

      if (next.length === 0) {
        setSelectedAddressId(null);
        setEditingAddressId(null);
        setIsAddingNewAddress(true);
        setSetAsDefaultAddress(false);
        setFormData((prevForm) => ({
          ...prevForm,
          fullName: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: "",
          city: "",
          district: "",
          ward: "",
        }));
        return next;
      }

      if (selectedAddressId === addressId || editingAddressId === addressId) {
        const fallbackAddress = next.find((address) => address.isDefault) || next[0];
        setSelectedAddressId(fallbackAddress.id);
        setEditingAddressId(null);
        setIsAddingNewAddress(false);
        setSetAsDefaultAddress(false);
        setFormData((prevForm) => ({
          ...prevForm,
          fullName: fallbackAddress.fullName,
          email: fallbackAddress.email,
          phone: fallbackAddress.phone,
          address: fallbackAddress.address,
          city: fallbackAddress.city,
          district: fallbackAddress.district,
          ward: fallbackAddress.ward,
        }));
      }

      return next;
    });
  };

  const onStartAddNew = () => {
    setEditingAddressId(null);
    setIsAddingNewAddress(true);
    setSelectedAddressId(null);
    setSetAsDefaultAddress(savedAddresses.length === 0);
    setFormData((prev) => ({
      ...prev,
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: "",
      city: "",
      district: "",
      ward: "",
    }));
  };

  const onCancelAddOrEdit = () => {
    setIsAddingNewAddress(false);
    setEditingAddressId(null);
    setSetAsDefaultAddress(false);

    if (selectedAddressId) {
      const selected = savedAddresses.find((address) => address.id === selectedAddressId);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          fullName: selected.fullName,
          email: selected.email,
          phone: selected.phone,
          address: selected.address,
          city: selected.city,
          district: selected.district,
          ward: selected.ward,
        }));
      }
      return;
    }

    if (savedAddresses.length === 0) {
      setIsAddingNewAddress(true);
    }
  };

  const onSaveAddress = () => {
    const newAddress: SavedAddress = {
      id: editingAddressId || `${Date.now()}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      district: formData.district,
      ward: formData.ward,
      isDefault: setAsDefaultAddress,
    };

    setSavedAddresses((prev) => {
      let next = prev;

      if (editingAddressId) {
        next = prev.map((address) => (address.id === editingAddressId ? newAddress : address));
      } else {
        next = [...prev, newAddress];
      }

      if (setAsDefaultAddress) {
        next = next.map((address) => ({
          ...address,
          isDefault: address.id === newAddress.id,
        }));
      } else if (!next.some((address) => address.isDefault)) {
        next = next.map((address) => ({
          ...address,
          isDefault: address.id === newAddress.id,
        }));
      }

      return next;
    });

    setSelectedAddressId(newAddress.id);
    setEditingAddressId(null);
    setIsAddingNewAddress(false);
    setSetAsDefaultAddress(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (!user) return;

    try {
      const paymentMethod = mapPaymentMethodToBackend(formData.paymentMethod);

      const orderData = {
        userId: user.id,
        phone: formData.phone,
        address: getFullAddress(formData),
        usedPoint: usePointsAmount,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          toppings: item.toppings?.map((topping) => topping.id),
        })),
        paymentMethod,
      };

      if (formData.paymentMethod === "vnpay") {
        let createdOrderId: number | null = null;
        let timeoutId: number | undefined;
        try {
          const order = await createOrder(orderData);
          if (!order?.id) {
            throw new Error("Create order failed");
          }

          createdOrderId = order.id;
          await fetchMe();

          const controller = new AbortController();
          timeoutId = window.setTimeout(() => controller.abort(), 15000);

          const paymentResponse = await fetch(
            `${API_BASE_URL}/payments/checkout`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              signal: controller.signal,
              body: JSON.stringify({
                orderId: order.id,
                method: "VNPAY",
              }),
            }
          );

          if (!paymentResponse.ok) {
            let errorMessage = "Failed to create payment session";
            try {
              const errorPayload = (await paymentResponse.json()) as {
                message?: string | string[];
                error?: string;
              };
              const backendMessage = Array.isArray(errorPayload?.message)
                ? errorPayload.message.join(", ")
                : errorPayload?.message;
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (errorPayload?.error) {
                errorMessage = errorPayload.error;
              }
            } catch {
              // Ignore JSON parse errors and keep fallback message.
            }

            throw new Error(errorMessage);
          }

          const paymentData = (await paymentResponse.json()) as {
            paymentUrl?: string;
            checkoutUrl?: string;
          };

          const redirectUrl = paymentData.paymentUrl || paymentData.checkoutUrl;
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          } else {
            throw new Error("No payment URL returned");
          }
        } catch (paymentError) {
          console.error("Create payment session error:", paymentError);
          if (paymentError instanceof Error && paymentError.name === "AbortError") {
            alert("Hết thời gian tạo phiên thanh toán. Vui lòng thử lại.");
          } else {
            const message = paymentError instanceof Error
              ? paymentError.message
              : "Lỗi khi tạo link thanh toán. Vui lòng thử lại.";
            alert(message);
          }

          if (createdOrderId) {
            navigate("/my-orders");
          }
        } finally {
          if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
          }
        }
      } else {
        const order = await createOrder(orderData);
        if (!order?.id) {
          throw new Error("Create order failed");
        }
        await fetchMe();
        clearCart();
        navigate("/my-orders");
      }
    } catch (error) {
      console.error("Create order failed:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  const goHome = () => navigate("/");
  const goCart = () => navigate("/cart");

  return {
    cart,
    user,

    step,
    setStep,

    formData,
    setFormData,
    handleInputChange,

    savedAddresses,
    selectedAddressId,
    isAddingNewAddress,
    setAsDefaultAddress,
    editingAddressId,

    onSelectAddress,
    onEditAddress,
    onDeleteAddress,
    onStartAddNew,
    onCancelAddOrEdit,
    onSaveAddress,
    onToggleDefault: setSetAsDefaultAddress,

    usePointsAmount,
    setUsePointsAmount,
    maxPointsCanUse,

    subtotal,
    discountFromPoints,
    finalAmount,

    handleBackStep,
    handleSubmit,

    goHome,
    goCart,
  };
}