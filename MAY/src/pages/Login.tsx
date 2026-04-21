import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiPhone, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef<any>(null);
  const confirmationRef = useRef<any>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchMe } = useAuth();
  const from = (location.state as { from?: string } | null)?.from || "/";

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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Validate simple phone
      if (!/^0\d{9}$/.test(phone)) {
        throw new Error("Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 0)");
      }

      // 2. Check if phone exists
      const { data } = await axios.get(`${API_BASE_URL}/auth/check-phone/${phone}`);
      if (!data.exists) {
        throw new Error("SĐT CHƯA_TỒN_TẠI");
      }

      // 3. Send OTP
      const phoneNumber = "+84" + phone.slice(1);
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaRef.current
      );
      confirmationRef.current = confirmation;
      setStep("otp");
    } catch (err: any) {
      if (err.message === "SĐT CHƯA_TỒN_TẠI") {
        setError("Số điện thoại chưa đăng ký. Hãy tạo tài khoản mới!");
      } else {
        setError(err.message || "Lỗi khi kiểm tra SĐT hoặc gửi OTP");
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

      // 2. Server Login
      const res = await axios.post(`${API_BASE_URL}/auth/firebase-login`, {
        idToken,
      });

      // 3. Update Auth Context
      const accessToken = res.data.access_token;
      
      // Try to save token to localStorage
      try {
        localStorage.setItem("access_token", accessToken);
        console.log("✅ Token saved to localStorage");
      } catch (storageErr: any) {
        console.warn("⚠️ localStorage blocked, using token from response:", storageErr.message);
        // Token is still in memory, pass it to fetchMe
      }

      // fetchMe will get token from localStorage first, or use provided token
      await fetchMe(accessToken);

      // Navigate
      navigate(from, { replace: true });
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#e1c8c8] via-white to-[#c8e1ca]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-[#4f6f41] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md px-4">
        {/* Glassmorphism Form Card */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#4f6f41] tracking-tight">M A Y</h2>
            <p className="text-sm font-medium text-neutral-600 mt-2">Đăng nhập với số điện thoại</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-4 py-3 text-sm text-red-600 animate-slideDown">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#4f6f41] mb-2 drop-shadow-sm">
                  Số điện thoại
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiPhone className="text-[#6c935b] group-focus-within:text-orange-500 transition-colors" size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full bg-white/70 border border-white/60 text-neutral-800 text-sm rounded-2xl focus:ring-2 focus:ring-[#6c935b] focus:border-transparent block pl-11 p-3.5 backdrop-blur-sm transition-all shadow-inner"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-gradient-to-r from-[#4f6f41] to-[#6c935b] hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-2xl text-sm px-5 py-4 text-center shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Tiếp tục"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fadeIn">
              <div className="text-center mb-4">
                <p className="text-sm text-neutral-600">
                  Mã xác nhận đã gửi đến <span className="font-bold text-[#4f6f41]">{phone}</span>
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
                {loading ? "Đang xác thực..." : "Đăng nhập"}
              </button>
              
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-center text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors mt-2"
              >
                Quay lại
              </button>
            </form>
          )}

          <div id="recaptcha-container"></div>

          <div className="mt-8 text-center border-t border-white/40 pt-6">
            <p className="text-sm font-medium text-neutral-600">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-orange-500 hover:text-orange-600 font-bold transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;