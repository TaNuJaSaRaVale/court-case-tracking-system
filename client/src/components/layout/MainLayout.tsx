import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { court } from "../../assets";
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Navbar */}
      <nav className="flex items-center gap-2 justify-between w-full">
            {/* Left Side */}
            <div>
              <Link to={"/"} className="flex items-center gap-2">
                <img src={court} alt="Logo" className="w-10 h-10 bg-blue-700 border-[1px] rounded-3xl"/>
                <h3 className="text-[rgb(0,0,128)]">NyaySetu</h3>
              </Link>
            </div>
            {/* Right Side */}
            <div className="flex items-center gap-3 m-4">
              <Link to={"/login"}>
                <button>Login</button>
              </Link>
              <Link to={"/register"}>
                <button>Register</button>
              </Link>
            </div>
          </nav>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer (optional) */}
      <footer className="text-center text-sm text-gray-500 py-3 border-t">
        © 2026 NyaySetu
      </footer>
    </div>
  );
}