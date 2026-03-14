import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"

interface Props {
  children: React.ReactNode
  roles?: string[]
}

export default function ProtectedRoute({ children, roles }: Props) {

  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // chặn role không hợp lệ
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}