import { Link } from "react-router-dom";
import { FaFacebook, FaTiktok, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full mt-0 bg-linear-to-br bg-[#6c935b] text-white">

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TOP CONTENT */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 w-full">

          {/* LEFT: LOGO */}
          <div className="flex flex-col items-center md:items-start gap-120">
            <img
              src="/src/assets/may_logo.png"
              alt="May Logo"
              className="w-50 object-contain"
            />
          </div>

          {/* CENTER: MAP MINI */}
          <div className="w-150 h-32 rounded-xl overflow-hidden border border-white/20 shadow-md">
            <iframe
              title="map"
              width="100%"
              height="100%"
              src="https://www.google.com/maps?q=10.760596,106.681948&z=15&output=embed"
            />
          </div>

          {/* RIGHT: CONTACT */}
          <div className="flex flex-col gap-3 text-sm text-white/90">

            <div className="flex items-center gap-3">
              <span>Địa chỉ : 273 An Dương Vương, TP.HCM</span>
            </div>

            <div className="flex items-center gap-3">
              <span>Điện thoại: 0123 456 789</span>
            </div>

            <div className="flex items-center gap-6 mt-2 text-lg">
              <FaFacebook className="cursor-pointer hover:scale-110 transition" />
              <FaTiktok className="cursor-pointer hover:scale-110 transition" />
              <FaEnvelope className="cursor-pointer hover:scale-110 transition" />
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/20 my-8"></div>

        {/* BOTTOM MENU */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/80">

          <div className="flex flex-wrap gap-6">
            <Link to="/loyalty" className="hover:text-white cursor-pointer">Thành viên và tích điểm giảm giá</Link>
            <Link to="/contact" className="hover:text-white cursor-pointer">Liên hệ</Link>
            <Link to="/purchase-policy" className="hover:text-white cursor-pointer">Chính sách mua hàng</Link>
            <Link to="/privacy-policy" className="hover:text-white cursor-pointer">Chính sách bảo mật</Link>
            <Link to="/terms" className="hover:text-white cursor-pointer">Điều khoản & lưu ý</Link>
          </div>

          <div className="text-white/60">
            © 2026 May Coffee
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;