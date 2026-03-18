import { Outlet, Link } from "react-router-dom";

export default function CitizenLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-[#0d1b3e] text-white flex flex-col p-4">
        <h2 className="text-xl font-semibold mb-6">NyaySetu</h2>

        <nav className="flex flex-col gap-2">
          <Link to="/dashboard/citizen" className="hover:bg-white/10 p-2 rounded">
            Dashboard
          </Link>

          <Link to="#" className="hover:bg-white/10 p-2 rounded">
            My Cases
          </Link>

          <Link to="#" className="hover:bg-white/10 p-2 rounded">
            Documents
          </Link>

          <Link to="#" className="hover:bg-white/10 p-2 rounded">
            Settings
          </Link>
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
          className="mt-auto bg-red-500 p-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Citizen Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back 👋</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}