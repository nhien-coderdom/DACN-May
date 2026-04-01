import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "@/pages/auth/Login"
import Dashboard from "@/pages/dashboard/Dashboard"
import { CategoriesList } from "@/pages/categories/components"

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
          <Route path="categories" element={<CategoriesList />} />
          
          {/* future pages */}
          {/* <Route path="toppings" element={<ToppingsList />} /> */}
          {/* <Route path="products" element={<Products />} /> */}
          {/* <Route path="orders" element={<Orders />} /> */}
          {/* <Route path="users" element={<Users />} /> */}
        </Route>

      </Routes>

    </BrowserRouter>
  )
}