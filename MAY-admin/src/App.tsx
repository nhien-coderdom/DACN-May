import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "@/pages/auth/Login"
import StaffDashboard from "@/pages/dashboard/StaffDashboard"
// import AdminDashboard from "@/pages/AdminDashboard"
import ProtectedRoute from "@/components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN only */}
        {/* <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/" element={<AdminDashboard />} />
        </Route> */}

        {/* STAFF only */}
        <Route
          path="/StaffDashboard"
          element={
            <ProtectedRoute roles={["STAFF"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<div>Không có quyền truy cập</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App