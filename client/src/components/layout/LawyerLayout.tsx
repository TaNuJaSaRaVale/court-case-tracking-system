import { Outlet } from "react-router-dom"
export default function LawyerLayout() {
  return (
    <div className="flex">

      <aside>
        Lawyer Sidebar
      </aside>

      <main>
        <Outlet />
      </main>

    </div>
  )
}