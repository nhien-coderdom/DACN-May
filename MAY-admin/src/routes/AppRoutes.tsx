import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "@/pages/auth/Login"
import Dashboard from "@/pages/dashboard/Dashboard"

import MainLayout from "@/layouts/MainLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>
        
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute roles={["ADMIN", "STAFF"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* future pages */}
          {/* <Route path="orders" element={<Orders />} /> */}
          {/* <Route path="products" element={<Products />} /> */}
        </Route>

      </Routes>

    </BrowserRouter>
  )
}