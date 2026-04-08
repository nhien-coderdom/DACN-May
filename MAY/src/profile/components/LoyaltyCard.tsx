import { FiAward, FiTrendingUp, FiCheck } from "react-icons/fi";
import type { User } from "../../contexts/AuthContext";

interface LoyaltyCardProps {
  user: User;
  formatPrice: (value: number) => string;
}

function LoyaltyCard({ user, formatPrice }: LoyaltyCardProps) {
  const getTierColor = (tier?: string) => {
    switch(tier) {
      case 'PLATINUM': return 'text-purple-600';
      case 'GOLD': return 'text-yellow-600';
      case 'SILVER': return 'text-gray-400';
      default: return 'text-orange-600';
    }
  };

  const getTierBg = (tier?: string) => {
    switch(tier) {
      case 'PLATINUM': return 'bg-purple-100 border-purple-300';
      case 'GOLD': return 'bg-yellow-100 border-yellow-300';
      case 'SILVER': return 'bg-gray-100 border-gray-300';
      default: return 'bg-orange-100 border-orange-300';
    }
  };

  const getTierName = (tier?: string) => {
    switch(tier) {
      case 'PLATINUM': return 'Bạch Kim';
      case 'GOLD': return 'Vàng';
      case 'SILVER': return 'Bạc';
      default: return 'Thường';
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
        <FiAward className="text-orange-500" size={24} />
        Điểm tích lũy
      </h2>

      {/* Tier Badge */}
      <div className={`mb-6 rounded-xl border p-4 text-center ${getTierBg(user.loyaltyTier)}`}>
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
          Hạng thành viên
        </p>
        <p className={`mt-2 text-2xl font-bold ${getTierColor(user.loyaltyTier)}`}>
          {getTierName(user.loyaltyTier)}
        </p>
      </div>

      {/* Points Display */}
      <div className="mb-8 rounded-xl bg-white/80 border border-orange-200 p-6 text-center backdrop-blur">
        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
          Điểm hiện tại
        </p>
        <p className="mt-2 text-5xl font-black text-orange-500">
          {(user.loyaltyPoint || 0).toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          pts
        </p>
      </div>

      {/* Points Info */}
      <div className="space-y-4 rounded-lg bg-white/60 p-4 backdrop-blur">
        <div className="border-t border-neutral-200 my-3 pt-3">
          <p className="text-xs font-semibold text-neutral-900 mb-3">Yêu cầu hạng thành viên</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Thường: 0 - 99</span>
              <span className={user.loyaltyPoint! >= 0 ? 'text-orange-600 font-bold' : 'text-neutral-400'}>✓</span>
            </div>
            <div className="flex justify-between">
              <span>Bạc: 100 - 999</span>
              <span className={user.loyaltyPoint! >= 100 ? 'text-orange-600 font-bold' : 'text-neutral-400'}>✓</span>
            </div>
            <div className="flex justify-between">
              <span>Vàng: 1.000 - 1.499</span>
              <span className={user.loyaltyPoint! >= 1000 ? 'text-orange-600 font-bold' : 'text-neutral-400'}>✓</span>
            </div>
            <div className="flex justify-between">
              <span>Bạch Kim: 1.500+</span>
              <span className={user.loyaltyPoint! >= 1500 ? 'text-orange-600 font-bold' : 'text-neutral-400'}>✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 border-t border-orange-200 pt-6">
        <div className="mb-3">
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
            Tổng chi tiêu
          </p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {formatPrice(user.totalSpent)}
          </p>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-600">
          <div className="h-1 flex-1 rounded-full bg-orange-300"></div>
          <span>Tiếp tục mua sắm</span>
        </div>

        <div>
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
            Tổng đơn hàng
          </p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {user.totalOrders}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoyaltyCard;
