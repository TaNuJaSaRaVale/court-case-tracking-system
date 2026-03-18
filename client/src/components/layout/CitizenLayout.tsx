import { Outlet } from "react-router-dom";

export default function CitizenLayout(){
    return(
        <div className="flex min-h-screen">
          <aside className="w-64 bg-gray-100">
            Citizen Sidebar
          </aside>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
    )
}