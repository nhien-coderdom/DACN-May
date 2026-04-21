import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatPrice, getToppingNames } from "../utils/checkout.utils";

type SummaryItem = {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  toppings?: unknown[];
};

interface OrderSummaryProps {
  cart: SummaryItem[];
  subtotal: number;
  usePointsAmount: number;
  discountFromPoints: number;
  finalAmount: number;
}

export default function OrderSummary({
  cart,
  subtotal,
  usePointsAmount,
  discountFromPoints,
  finalAmount,
}: OrderSummaryProps) {
  const navigate = useNavigate();

  return (
    <div className="h-fit sticky top-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">
        Tóm tắt đơn hàng
      </h3>

      <div className="space-y-3 rounded-lg bg-neutral-50 p-4 mb-6">
        {cart.map((item, index) => {
          const toppingNames = getToppingNames(item.toppings);

          return (
            <div
              key={`${item.id}-${index}`}
              className="flex justify-between items-start"
            >
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-medium text-neutral-900">
                  {item.title}
                </span>

                {"size" in item && item.size && (
                  <div className="text-xs text-neutral-600">
                    Size {String(item.size).toUpperCase()}
                  </div>
                )}

                {toppingNames.length > 0 && (
                  <div className="text-xs text-neutral-600">
                    +{toppingNames.join(", ")}
                  </div>
                )}

                <div className="text-xs text-neutral-600">
                  x {item.quantity}
                </div>
              </div>

              <span className="font-semibold text-xs sm:text-sm">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 border-b border-neutral-200 pb-4">
        <div className="flex justify-between text-xs sm:text-sm text-neutral-600">
          <span>Tạm tính:</span>
          <span>{formatPrice(subtotal)}</span>
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
            <span className="font-semibold">💡 Hãy biết:</span> Bạn sẽ nhận{" "}
            {Math.floor(finalAmount / 10)} điểm từ đơn hàng này!
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
  );
}