import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/axios"
import { useAuthStore } from "@/pages/auth/stores/authStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import axios from "axios"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [loading, setLoading] = useState(false)

  const recaptchaRef = useRef<any>(null)
  const confirmationRef = useRef<any>(null)

  useEffect(() => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      )
    }
  }, [])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      // 1. Validate simple phone
      if (!/^0\d{9}$/.test(phone)) {
        throw new Error("Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 0)")
      }

      // 2. Check if phone exists using our proxy backend
      const { data } = await axios.get(`http://localhost:3000/auth/check-phone/${phone}`)
      if (!data.exists) {
        throw new Error("Số điện thoại chưa tồn tại trong hệ thống.")
      }

      // 3. Send OTP
      const phoneNumber = "+84" + phone.slice(1)
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaRef.current
      )
      confirmationRef.current = confirmation
      setStep("otp")
    } catch (err: any) {
      alert(err.message || "Lỗi khi kiểm tra SĐT hoặc gửi OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      // 1. Verify OTP
      const result = await confirmationRef.current.confirm(otp)
      const idToken = await result.user.getIdToken()

      // 2. Server Login
      const res = await api.post("/auth/firebase-login", { idToken })
      const { user, access_token } = res.data

      // Role Check Before Login
      if (user.role === "ADMIN") {
        login(user, access_token)
        navigate("/admin/products")
      } else if (user.role === "STAFF") {
        login(user, access_token)
        navigate("/StaffDashboard")
      } else {
        alert("Bạn không có quyền truy cập bảng điều khiển quản trị viên")
        auth.signOut()
      }
    } catch (err: any) {
      console.error("❌ Admin login error:", err);
      const serverMsg = err.response?.data?.message;
      const firebaseMsg = err.message;
      alert(serverMsg || firebaseMsg || "Mã OTP không chính xác hoặc hết hạn");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-[360px] space-y-6 rounded-xl border bg-white p-6 shadow-sm">

        <div className="text-center">
          <h1 className="text-2xl font-semibold">Đăng nhập Admin</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Xác thực bằng số điện thoại
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                type="tel"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button className="w-full" disabled={loading || !phone}>
              {loading ? "Đang xử lý..." : "Nhận mã xác nhận"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhập mã OTP</label>
              <Input
                type="text"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button className="w-full" disabled={loading || otp.length < 6}>
              {loading ? "Đang xác thực..." : "Đăng nhập"}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full" 
              onClick={() => setStep("phone")}
            >
              Quay lại
            </Button>
          </form>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  )
}
