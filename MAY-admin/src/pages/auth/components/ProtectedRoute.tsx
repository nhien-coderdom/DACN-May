import { Navigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"

type Role = "ADMIN" | "STAFF" | "CUSTOMER"

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: Role[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role as Role)) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />
    }

    if (user.role === "STAFF") {
      return <Navigate to="/staffDashboard" replace />
    }

    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}