import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiCreditCard, FiTruck, FiAward, FiX } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useOrders } from "../contexts/OrdersContext";

function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user, usePoints, addPoints } = useAuth();
  const { createOrder } = useOrders();

  const [step, setStep] = useState(1);
  const [usePointsAmount, setUsePointsAmount] = useState(0);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    district: "",
    ward: "",
    notes: "",
    paymentMethod: "cod",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Create order
      if (user) {
        // Use points if applicable
        if (usePointsAmount > 0) {
          usePoints(usePointsAmount);
        }

        // Add points to user (1.000 VND = 1 point)
        const pointsEarned = Math.floor(finalAmount / 1000);
        addPoints(pointsEarned);

        createOrder({
          items: cart,
          totalAmount: subtotal,
          discountPoints: usePointsAmount,
          finalAmount,
          status: "pending",
          customerName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`,
          paymentMethod: formData.paymentMethod,
        });

        clearCart();
        navigate("/my-orders");
      }
    }
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const subtotal = getTotalPrice();
  const shipping = 30000;
  const tax = Math.round(subtotal * 0.1);
  const discountFromPoints = (usePointsAmount / 1000) * 10000;
  const finalAmount = subtotal + shipping + tax - discountFromPoints;

  const maxPointsCanUse = Math.min(user?.loyaltyPoints || 0, Math.floor(subtotal / 10000) * 1000);

  if (cart.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Giỏ hàng trống
        </h1>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-[#6c935b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-8 sm:py-12 px-4 sm:px-0">
      {/* Steps */}
      <div className="mb-8 sm:mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-neutral-900 mb-6 sm:mb-8">
          Thanh toán
        </h1>

        <div className="flex gap-4 sm:gap-8 overflow-x-auto">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0"
              onClick={() => step > s && setStep(s)}
            >
              <div
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full font-bold text-xs sm:text-sm transition ${
                  s < step
                    ? "bg-[#6c935b] text-white"
                    : s === step
                    ? "bg-[#6c935b] text-white ring-4 ring-orange-100"
                    : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {s < step ? <FiCheck size={18} /> : s}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  Bước {s}
                </p>
                <p className="text-sm font-semibold text-neutral-900">
                  {s === 1 && "Địa chỉ"}
                  {s === 2 && "Thanh toán"}
                  {s === 3 && "Xác nhận"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                  Thông tin giao hàng
                </h2>

                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="sm:col-span-2 rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <textarea
                  name="address"
                  placeholder="Địa chỉ chi tiết"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="Thành phố/Tỉnh"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="text"
                    name="district"
                    placeholder="Quận/Huyện"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="text"
                    name="ward"
                    placeholder="Phường/Xã"
                    value={formData.ward}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <textarea
                  name="notes"
                  placeholder="Ghi chú (tuỳ chọn)"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Payment Methods */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">
                    Phương thức thanh toán
                  </h2>

                  <div className="space-y-3">
                    {[
                      {
                        id: "cod",
                        name: "Thanh toán khi nhận hàng (COD)",
                        icon: <FiTruck size={20} />,
                      },
                      {
                        id: "card",
                        name: "Thẻ tín dụng/Thẻ ghi nợ",
                        icon: <FiCreditCard size={20} />,
                      },
                      {
                        id: "bank",
                        name: "Chuyển khoản ngân hàng",
                        icon: <FiCreditCard size={20} />,
                      },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-neutral-200 p-4 transition hover:border-orange-400 hover:bg-orange-50"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="h-5 w-5 cursor-pointer accent-orange-400"
                        />
                        <span className="text-orange-400">{method.icon}</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {method.name}
                        </span>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="mt-6 space-y-4 rounded-lg bg-neutral-50 p-4 border border-neutral-200">
                      <input
                        type="text"
                        placeholder="Số thẻ"
                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      <div className="grid gap-4 grid-cols-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Loyalty Points */}
                {user && user.loyaltyPoints > 0 && (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 sm:p-8">
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <FiAward className="text-[#086136]" size={20} />
                      Sử dụng điểm tích lũy
                    </h2>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-neutral-900">
                          Điểm sẽ dùng
                        </label>
                        <span className="text-sm text-neutral-600">
                          Có sẵn: {user.loyaltyPoints.toLocaleString()} pts
                        </span>
                      </div>
                      <input
                        type="number"
                        value={usePointsAmount}
                        onChange={(e) => {
                          const val = Math.min(
                            parseInt(e.target.value) || 0,
                            maxPointsCanUse
                          );
                          setUsePointsAmount(val);
                        }}
                        max={maxPointsCanUse}
                        step="1000"
                        className="w-full rounded-lg border border-orange-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="0"
                      />
                      <p className="mt-2 text-xs text-neutral-600">
                        Tối đa có thể dùng: {maxPointsCanUse.toLocaleString()} pts ({formatPrice((maxPointsCanUse / 1000) * 10000)} giảm)
                      </p>
                    </div>

                    {usePointsAmount > 0 && (
                      <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3">
                        <FiCheck className="text-green-600" size={18} />
                        <span className="text-sm text-green-700 font-medium">
                          Giảm {formatPrice((usePointsAmount / 1000) * 10000)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">
                  Xác nhận đơn hàng
                </h2>

                <div className="space-y-4 border-b border-neutral-200 pb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Tên:</span>
                    <span className="font-semibold">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Email:</span>
                    <span className="font-semibold">{formData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Điện thoại:</span>
                    <span className="font-semibold">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Địa chỉ:</span>
                    <span className="font-semibold text-right max-w-xs">
                      {formData.address}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Phương thức:</span>
                    <span className="font-semibold">
                      {formData.paymentMethod === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : "Thẻ tín dụng/ngân hàng"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <FiCheck size={18} />
                    Tất cả thông tin đã được xác nhận. Hãy bấm "Đặt hàng" để hoàn tất.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 rounded-lg border-2 border-neutral-300 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
                >
                  Quay lại
                </button>
              )}
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#6c935b] py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                {step === 3 ? "Đặt hàng" : "Tiếp tục"}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="h-fit sticky top-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">
            Tóm tắt đơn hàng
          </h3>

          <div className="space-y-3 rounded-lg bg-neutral-50 p-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-medium text-neutral-900">
                    {item.title}
                  </span>
                  {item.size && (
                    <div className="text-xs text-neutral-600">Size {item.size.toUpperCase()}</div>
                  )}
                  {item.toppings && item.toppings.length > 0 && (
                    <div className="text-xs text-neutral-600">+{item.toppings.join(", ")}</div>
                  )}
                  <div className="text-xs text-neutral-600">x {item.quantity}</div>
                </div>
                <span className="font-semibold text-xs sm:text-sm">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-b border-neutral-200 pb-4">
            <div className="flex justify-between text-xs sm:text-sm text-neutral-600">
              <span>Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-neutral-600">
              <span>Vận chuyển:</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-neutral-600">
              <span>Thuế (10%):</span>
              <span>{formatPrice(tax)}</span>
            </div>
            {usePointsAmount > 0 && (
              <div className="flex justify-between text-xs sm:text-sm text-green-600 font-semibold">
                <span>Giảm từ điểm:</span>
                <span>-{formatPrice(discountFromPoints)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between">
            <span className="font-bold text-neutral-900">Tổng cộng</span>
            <span className="text-2xl sm:text-3xl font-bold text-[#086136]">
              {formatPrice(finalAmount)}
            </span>
          </div>

          {usePointsAmount > 0 && (
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">💡 Hay biết:</span> Bạn sẽ nhận {Math.floor(finalAmount / 1000)} điểm từ đơn hàng này!
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/cart")}
            className="mt-6 w-full rounded-lg border-2 border-neutral-300 py-3 text-xs sm:text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 flex items-center justify-center gap-2"
          >
            <FiX size={16} />
            Quay về giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
