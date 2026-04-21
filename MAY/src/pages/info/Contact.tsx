import { FiPhone, FiMail, FiMapPin, FiSend } from "react-icons/fi";

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 mt-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-[#086136] mb-4">Liên hệ với MAY</h1>
        <p className="text-neutral-600">Chúng tôi luôn sẵn sàng lắng nghe mọi phản hồi và đóng góp từ bạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* INFO */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-6 text-neutral-800">Thông tin liên hệ</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
                  <FiMapPin />
                </div>
                <div>
                  <p className="font-bold text-sm">Địa chỉ</p>
                  <p className="text-neutral-500 text-sm">273 An Dương Vương, Phường 3, Quận 5, TP.HCM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <FiPhone />
                </div>
                <div>
                  <p className="font-bold text-sm">Điện thoại</p>
                  <p className="text-neutral-500 text-sm">0123 456 789</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#6c935b]/10 text-[#6c935b] rounded-lg flex items-center justify-center shrink-0">
                  <FiMail />
                </div>
                <div>
                  <p className="font-bold text-sm">Email</p>
                  <p className="text-neutral-500 text-sm">hello@maycoffee.vn</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-neutral-100 rounded-2xl">
            <h4 className="font-bold mb-2">Giờ làm việc</h4>
            <div className="text-sm text-neutral-600 flex justify-between uppercase tracking-wider">
              <span>Thứ 2 - Chủ Nhật</span>
              <span>07:00 - 22:00</span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
          <h3 className="text-xl font-bold mb-8">Gửi tin nhắn cho chúng tôi</h3>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Họ và tên</label>
                <input type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6c935b]/20" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Số điện thoại</label>
                <input type="tel" placeholder="0901234567" className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6c935b]/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase">Email</label>
              <input type="email" placeholder="example@gmail.com" className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6c935b]/20" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase">Nội dung</label>
              <textarea rows={4} placeholder="Bạn muốn nhắn gì cho MAY?" className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6c935b]/20" />
            </div>

            <button type="submit" className="w-full py-4 bg-[#6c935b] text-white rounded-xl font-bold shadow-md hover:bg-[#5b7d4c] transition flex items-center justify-center gap-2">
              <FiSend /> Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
