import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/axios"
import { useAuthStore } from "@/pages/auth/stores/authStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await api.post("/auth/login", {
        email,
        password,
      })

      const { user, access_token } = res.data

      login(user, access_token)

      if (user.role === "ADMIN") {
        navigate("/admin/products")
      }
      else if (user.role === "STAFF") {
        navigate("/StaffDashboard")
      }
      else {
        alert("You don't have permission to access admin panel")
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-[360px] space-y-6 rounded-xl border bg-white p-6 shadow-sm">

        <div className="text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your account information
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="admin@may.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

        </form>

      </div>
    </div>
  )
}
