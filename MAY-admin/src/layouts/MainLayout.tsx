import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <div className="flex">

      <aside className="w-64 border-r p-4">
        Sidebar
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  )
}