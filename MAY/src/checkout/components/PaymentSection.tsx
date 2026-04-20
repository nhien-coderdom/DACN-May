import type { CheckoutFormData } from "../types/checkout.types";
import { PAYMENT_METHODS } from "../constants/checkout.constant";

interface PaymentSectionProps {
  paymentMethod: CheckoutFormData["paymentMethod"];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

export default function PaymentSection({
  paymentMethod,
  onChange,
}: PaymentSectionProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">
        Phương thức thanh toán
      </h2>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;

          return (
            <label
              key={method.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-neutral-200 p-4 transition hover:border-orange-400 hover:bg-orange-50"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={onChange}
                className="h-5 w-5 cursor-pointer accent-orange-400"
              />
              <span className="text-orange-400">
                <Icon size={20} />
              </span>
              <span className="text-sm font-semibold text-neutral-900">
                {method.name}
              </span>
            </label>
          );
        })}
      </div>

      {paymentMethod === "vnpay" && (
        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900">
            💳 Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay để hoàn tất giao dịch.
          </p>
        </div>
      )}
    </div>
  );
}