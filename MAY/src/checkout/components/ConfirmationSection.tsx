import { FiCheck } from "react-icons/fi";
import type { CheckoutFormData } from "../types/checkout.types";
import {
  getFullAddress,
  getPaymentMethodLabel,
} from "../utils/checkout.utils";

interface ConfirmationSectionProps {
  formData: CheckoutFormData;
}

export default function ConfirmationSection({
  formData,
}: ConfirmationSectionProps) {
  return (
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
            {getFullAddress(formData)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Phương thức:</span>
          <span className="font-semibold">
            {getPaymentMethodLabel(formData.paymentMethod)}
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
  );
}