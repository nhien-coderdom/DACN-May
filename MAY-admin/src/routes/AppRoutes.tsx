import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "@/pages/auth/Login"
import StaffDashboard from "@/pages/dashboard/StaffDashboard"
// import AdminDashboard from "@/pages/dashboard/AdminDashboard"

import MainLayout from "@/layouts/MainLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* ADMIN routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* <Route index element={<AdminDashboard />} /> */}
        </Route>

        {/* STAFF routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute roles={["STAFF"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}