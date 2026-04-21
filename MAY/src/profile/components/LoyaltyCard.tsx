import { FiAward } from "react-icons/fi";
import type { User } from "../../contexts/AuthContext";
import { Modal } from "./Modal";
import React from "react";
interface LoyaltyCardProps {
  user: User;
  formatPrice: (value: number) => string;
}

function LoyaltyCard({ user, formatPrice }: LoyaltyCardProps) {
  const [open, setOpen] = React.useState(false);
  const tiers = [
    { key: "NORMAL", name: "Thường", min: 0, max: 99999 },
    { key: "SILVER", name: "Bạc", min: 100000, max: 1999999 },
    { key: "GOLD", name: "Vàng", min: 2000000, max: 3499999 },
    { key: "PLATINUM", name: "Bạch Kim", min: 3500000, max: Infinity },
  ];

  const spent = user.totalSpent || 0;

  const currentIndex = tiers.findIndex((t) => spent >= t.min && spent <= t.max);

  const currentTier = tiers[currentIndex];
  const nextTier =
    currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;

  const progress = nextTier
    ? ((spent - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const remaining = nextTier ? nextTier.min - spent : 0;

  return (
    <div className="w-full rounded-2xl bg-white p-8 shadow-xl text-gray-900">
      {/* ===== HEADER (CENTER) ===== */}
      <div className="flex flex-col items-center mb-8">
        <FiAward className="text-4xl mb-2 drop-shadow-lg text-[#6b8f5e]" />

        <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-lg text-gray-900">
          {currentTier.name.toUpperCase()}
        </h1>

        <p className="text-gray-600 text-sm mt-2">Hạng thành viên</p>
        <button onClick={() => setOpen(true)} className="text-red-500">
          Xem chi tiết
        </button>
      </div>

      {/* ===== CARD ===== */}
      <div className="w-full bg-gray-50 rounded-2xl p-6 shadow-lg">
        <div className="text-gray-900">
          {/* ===== TEXT MỤC TIÊU ===== */}
          {nextTier ? (
            <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
              Còn{" "}
              <span className="text-orange-500 font-bold">
                {formatPrice(remaining)}
              </span>{" "}
              để lên hạng <span className="font-bold">{nextTier.name}</span>
            </p>
          ) : (
            <p className="text-sm font-semibold text-purple-600 mb-4 text-center">
              👑 Bạn đã đạt hạng cao nhất!
            </p>
          )}

          {/* ===== PROGRESS BAR ===== */}
          <div className="relative h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />

            {/* TEXT Ở GIỮA */}
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
              {formatPrice(spent)} /{" "}
              {nextTier ? formatPrice(nextTier.min) : "MAX"}
            </div>
          </div>

          {/* ===== MỐC ===== */}
          <div className="flex justify-between text-xs text-gray-500 mb-5">
            <span>{formatPrice(currentTier.min)}</span>
            <span>{nextTier ? formatPrice(nextTier.min) : "MAX"}</span>
          </div>

          {/* ===== STATS ===== */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">Đơn hàng</p>
              <p className="font-bold text-lg text-blue-600 mt-1">
                {user.totalOrders || 0}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">Điểm</p>
              <p className="font-bold text-lg text-purple-600 mt-1">
                {user.loyaltyPoint || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="max-w-md">
          {/* TITLE */}
          <h2 className="text-xl font-bold text-center mb-4">
            🎁 Quy tắc tích điểm
          </h2>

          {/* ===== CÁCH TÍNH ĐIỂM ===== */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="font-semibold mb-1">Cách tính điểm</p>
            <p className="text-sm text-gray-600">
              Với mỗi đơn hàng, bạn sẽ nhận được điểm thưởng dựa trên giá trị
              đơn:
            </p>
            <p className="text-sm mt-1">
              💰{" "}
              <span className="font-bold text-green-600">
                10.000đ = 1.000 điểm
              </span>
            </p>
          </div>

          {/* ===== HẠNG THÀNH VIÊN ===== */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="font-semibold mb-2">Hạng thành viên</p>

            <div className="space-y-1 text-sm">
              <p>
                 <span className="font-medium">Thường:</span> dưới 100.000đ
              </p>
              <p>
                 <span className="font-medium">Bạc:</span> 100.000đ – dưới
                2.000.000đ
              </p>
              <p>
                 <span className="font-medium">Vàng:</span> 2.000.000đ – dưới
                5.000.000đ
              </p>
              <p>
                <span className="font-medium">Bạch Kim:</span> từ 5.000.000đ
                trở lên
              </p>
            </div>
          </div>

          {/* ===== QUYỀN LỢI ===== */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="font-semibold mb-1">Quyền lợi</p>

            <ul className="text-sm text-gray-600 space-y-1">
              <li> Tích điểm cho mỗi đơn hàng</li>
              <li> Dùng điểm để đổi ưu đãi</li>
              <li> Hạng càng cao, ưu đãi càng lớn</li>
            </ul>
          </div>

          {/* ===== LƯU Ý ===== */}
          <div className="text-xs text-gray-500 mb-4 text-center">
            * Điểm và hạng sẽ được cập nhật sau mỗi đơn hàng hoàn thành
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-[#6b8f5e] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Đóng
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default LoyaltyCard;
