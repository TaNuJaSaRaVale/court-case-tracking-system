import { Outlet, Link } from "react-router-dom";
import { court } from "../../assets";
import { useState } from "react";

export default function CitizenLayout() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#0d1b3e] text-white hover:bg-[#162447]"
      >
        <div className="w-5 h-0.5 bg-white mb-1"></div>
        <div className="w-5 h-0.5 bg-white mb-1"></div>
        <div className="w-5 h-0.5 bg-white"></div>
      </button>
      {/* Sidebar */}
      <div
        className={`${isOpen ? "w-64 p-4" : "w-16 p-0"} bg-[#0d1b3e] text-white flex flex-col transition-all duration-300 overflow-hidden`}
      >
        {isOpen && (
          <>
            <div className="flex gap-2 items-center mx-10">
              <img src={court} alt="logo" className="w-10 h-10" />
              <h2 className="text-xl font-semibold text-[rgb(255,94,0)]">
                NyaySetu
              </h2>
            </div>

            <nav className="flex flex-col gap-2 mt-4">
              <Link
                to="/citizen/dashboard"
                className="hover:bg-white/10 p-2 rounded"
              >
                Dashboard
              </Link>

              <Link to="/citizen/mycases" className="hover:bg-white/10 p-2 rounded">
                My Cases
              </Link>

              <Link to="#" className="hover:bg-white/10 p-2 rounded">
                Documents
              </Link>

              <Link to="#" className="hover:bg-white/10 p-2 rounded">
                Settings
              </Link>
            </nav>
          </>
        )}

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("role");
            window.location.href = "/";
          }}
          className={`${!isOpen ? "rounded-full m-3":"rounded"} mt-auto bg-red-500 p-2`}
        >
          <>{isOpen ? "Logout":"<-"}</>
        </button>
      </div>

      {/* Main Section */}
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Topbar */}
        <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Citizen Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back 👋</p>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-4 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
