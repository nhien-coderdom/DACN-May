import { FiAward, FiCheck } from "react-icons/fi";
import { formatPrice } from "../utils/checkout.utils";
import { POINTS_STEP, POINTS_TO_VND_RATE } from "../constants/checkout.constant";

interface LoyaltyPointsSectionProps {
  loyaltyPoints: number;
  usePointsAmount: number;
  maxPointsCanUse: number;
  onChange: (value: number) => void;
}

export default function LoyaltyPointsSection({
  loyaltyPoints,
  usePointsAmount,
  maxPointsCanUse,
  onChange,
}: LoyaltyPointsSectionProps) {
  const discountFromUsedPoints = (usePointsAmount / POINTS_STEP) * POINTS_TO_VND_RATE;

  return (
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
            Có sẵn: {loyaltyPoints.toLocaleString()} điểm
          </span>
        </div>

        <input
  type="number"
  value={usePointsAmount === 0 ? "" : usePointsAmount}
  onChange={(e) => {
    if (e.target.value === "") {
      onChange(0);
      return;
    }

    const parsedValue = parseInt(e.target.value, 10) || 0;
    const normalizedValue = Math.max(0, Math.min(parsedValue, maxPointsCanUse));
    onChange(normalizedValue);
  }}
  min={0}
  max={maxPointsCanUse}
  step={POINTS_STEP}
  className="w-full rounded-lg border border-orange-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
  placeholder="Nhập số điểm muốn dùng"
/>

        <p className="mt-2 text-xs text-neutral-600">
          Tối đa có thể dùng: {maxPointsCanUse.toLocaleString()} điểm
        </p>
      </div>

      {usePointsAmount > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3">
          <FiCheck className="text-green-600" size={18} />
          <span className="text-sm text-green-700 font-medium">
            Giảm {formatPrice(discountFromUsedPoints)}
          </span>
        </div>
      )}
    </div>
  );
}