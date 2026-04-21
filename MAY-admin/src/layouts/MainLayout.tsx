import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { getSocket } from "@/lib/socket"

export default function MainLayout() {
  useEffect(() => {
    getSocket()
  }, [])

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}