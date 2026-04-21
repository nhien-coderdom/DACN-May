import { FiGift, FiStar, FiAward, FiInfo } from "react-icons/fi";

export default function Loyalty() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 mt-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-[#086136] mb-4">Thành viên & Tích điểm</h1>
        <p className="text-neutral-600">Càng uống nhiều, ưu đãi càng lớn. Khám phá đặc quyền dành riêng cho bạn tại MAY.</p>
      </div>

      {/* POINTS LOGIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
            <FiStar size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Tích lũy điểm</h3>
          <p className="text-neutral-500 text-sm">Với mỗi <span className="font-bold text-[#086136]">1.000 VNĐ</span> thanh toán, bạn sẽ nhận được <span className="font-bold text-[#086136]">1 điểm</span> vào tài khoản.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#6c935b]/10 text-[#6c935b] rounded-2xl flex items-center justify-center mb-6">
            <FiGift size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Sử dụng điểm</h3>
          <p className="text-neutral-500 text-sm">Điểm tích lũy có thể quy đổi trực tiếp thành giảm giá. <span className="font-bold text-[#086136]">1 điểm = 100 VNĐ</span> giảm giá cho hóa đơn tiếp theo.</p>
        </div>
      </div>

      {/* TIERS */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <FiAward className="text-orange-500" /> Hạng thành viên
        </h2>
        <div className="space-y-4">
          {[
            { label: 'Thành viên Bạc', points: 'Mặc định', color: 'bg-slate-100', icon: '🥈' },
            { label: 'Thành viên Vàng', points: 'Từ 1.000 điểm', color: 'bg-yellow-50', icon: '🥇' },
            { label: 'Thành viên Kim cương', points: 'Từ 5.000 điểm', color: 'bg-blue-50', icon: '💎' },
          ].map((tier, idx) => (
            <div key={idx} className={`flex items-center justify-between p-6 rounded-2xl ${tier.color} border border-white/50`}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{tier.icon}</span>
                <div>
                  <h4 className="font-bold text-neutral-800">{tier.label}</h4>
                  <p className="text-xs text-neutral-500">{tier.points}</p>
                </div>
              </div>
              <button className="text-xs font-semibold px-4 py-2 bg-white rounded-full shadow-sm">Xem đặc quyền</button>
            </div>
          ))}
        </div>
      </div>

      {/* NOTES */}
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex gap-4">
        <FiInfo className="text-orange-500 shrink-0 mt-1" />
        <div className="text-sm text-orange-800">
          <p className="font-bold mb-1">Lưu ý:</p>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>Điểm có giá trị trong vòng 1 năm kể từ ngày phát sinh.</li>
            <li>Điểm không thể quy đổi thành tiền mặt.</li>
            <li>Hạng thành viên được xét lại sau mỗi chu kỳ 12 tháng.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
