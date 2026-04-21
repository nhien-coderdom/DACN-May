import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { auth } from "../../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { fetchMe } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef<any>(null);
  const confirmationRef = useRef<any>(null);

  // Init Recaptcha
  useEffect(() => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Basic validation
      if (!formData.fullName || !formData.phone) {
        throw new Error("Vui lòng nhập Họ tên và Số điện thoại!");
      }
      if (!/^0\d{9}$/.test(formData.phone)) {
        throw new Error("Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 0)");
      }

      // 2. Check if phone exists
      const { data } = await axios.get(`http://localhost:3000/auth/check-phone/${formData.phone}`);
      if (data.exists) {
        throw new Error("SĐT ĐÃ_TỒN_TẠI");
      }

      // 3. Send OTP
      const phoneNumber = "+84" + formData.phone.slice(1);
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaRef.current
      );
      confirmationRef.current = confirmation;
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      if (err.message === "SĐT ĐÃ_TỒN_TẠI") {
        setError("Số điện thoại này đã được đăng ký. Vui lòng đăng nhập!");
      } else {
        setError(err.message || "Không thể gửi OTP. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Verify OTP
      const result = await confirmationRef.current.confirm(otp);
      const idToken = await result.user.getIdToken();

      // 2. Server Register/Login
      const res = await axios.post("http://localhost:3000/auth/firebase-login", {
        idToken,
        profile: {
          fullName: formData.fullName,
          email: formData.email,
          address: formData.address,
        },
      });

      // 3. Complete authentication workflow
      localStorage.setItem("access_token", res.data.access_token);
      await fetchMe();

      // Navigate home
      navigate("/");
    } catch (err: any) {
      console.error("❌ Login error:", err);
      const serverMsg = err.response?.data?.message;
      const firebaseMsg = err.message;
      setError(serverMsg || firebaseMsg || "Mã OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#e1c8c8] via-white to-[#c8e1ca] py-12 px-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-[#4f6f41] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md">
        {/* Glassmorphism Form Card */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#4f6f41] tracking-tight">M A Y</h2>
            <p className="text-sm font-medium text-neutral-600 mt-2">Tạo tài khoản mới</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-4 py-3 text-sm text-red-600 animate-slideDown">
              {error}
            </div>
          )}

          {step === "form" ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#4f6f41] mb-1 pl-1 drop-shadow-sm">Họ và tên *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-[#6c935b] group-focus-within:text-orange-500 transition-colors" size={18} />
                  </div>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-white/70 border border-white/60 text-neutral-800 text-sm rounded-xl focus:ring-2 focus:ring-[#6c935b] focus:border-transparent block pl-11 p-3 backdrop-blur-sm shadow-inner transition-all"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4f6f41] mb-1 pl-1 drop-shadow-sm">Số điện thoại *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiPhone className="text-[#6c935b] group-focus-within:text-orange-500 transition-colors" size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912345678"
                    className="w-full bg-white/70 border border-white/60 text-neutral-800 text-sm rounded-xl focus:ring-2 focus:ring-[#6c935b] focus:border-transparent block pl-11 p-3 backdrop-blur-sm shadow-inner transition-all"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4f6f41] mb-1 pl-1 drop-shadow-sm">Email (Tùy chọn)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-[#6c935b] group-focus-within:text-orange-500 transition-colors" size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-white/70 border border-white/60 text-neutral-800 text-sm rounded-xl focus:ring-2 focus:ring-[#6c935b] focus:border-transparent block pl-11 p-3 backdrop-blur-sm shadow-inner transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4f6f41] mb-1 pl-1 drop-shadow-sm">Địa chỉ giao hàng (Tùy chọn)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMapPin className="text-[#6c935b] group-focus-within:text-orange-500 transition-colors" size={18} />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Lê Lợi, Quận 1..."
                    className="w-full bg-white/70 border border-white/60 text-neutral-800 text-sm rounded-xl focus:ring-2 focus:ring-[#6c935b] focus:border-transparent block pl-11 p-3 backdrop-blur-sm shadow-inner transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.fullName || !formData.phone}
                className="w-full mt-4 bg-gradient-to-r from-[#4f6f41] to-[#6c935b] hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-2xl text-sm px-5 py-4 text-center shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Nhận mã OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fadeIn">
              <div className="text-center mb-4">
                <p className="text-sm text-neutral-600">
                  Mã xác nhận đã gửi đến <span className="font-bold text-[#4f6f41]">{formData.phone}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4f6f41] mb-2 text-center drop-shadow-sm">
                  Nhập mã OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiCheckCircle className="text-[#6c935b]" size={18} />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-white/70 border border-white/60 text-center text-xl tracking-widest font-bold text-neutral-800 rounded-2xl focus:ring-2 focus:ring-[#6c935b] focus:border-transparent block py-4 backdrop-blur-sm shadow-inner transition-all"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-[#4f6f41] hover:to-[#6c935b] text-white font-bold rounded-2xl text-sm px-5 py-4 text-center shadow-lg transform transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? "Đang xác thực..." : "Xác nhận đăng ký"}
              </button>
              
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-center text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors mt-2"
              >
                Quay lại để sửa thông tin
              </button>
            </form>
          )}

          <div id="recaptcha-container"></div>

          <div className="mt-8 text-center border-t border-white/40 pt-6">
            <p className="text-sm font-medium text-neutral-600">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold transition-colors">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;