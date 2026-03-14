import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"
import type { JSX } from "react/jsx-dev-runtime"

interface Props {
  children: JSX.Element
  roles?: string[]
}

export default function PrivateRoute({ children, roles }: Props) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />
  }

  return children
}