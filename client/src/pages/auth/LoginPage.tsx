import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { court } from "../../assets/index.ts";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roleParam = params.get("role") || "citizen";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  localStorage.setItem("role", roleParam);

  if (roleParam === "citizen") {
    navigate("/dashboard/citizen");
  } else {
    navigate("/dashboard/lawyer");
  }
};
  const role = roleParam.charAt(0).toUpperCase() + roleParam.slice(1);

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setTimeout(() => setLoading(false), 2000);
  //   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1b3e] px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-500 opacity-10 blur-3xl rounded-full top-[-100px] right-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-yellow-500 opacity-10 blur-3xl rounded-full bottom-[-100px] left-[-100px]"></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-[#f5f0e8] rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="w-12 h-12 bg-[#0d1b3e] rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-yellow-400 font-bold text-lg">
            <img src={court} alt="logo" />
          </span>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-[#0d1b3e]">
          Sign in as <span className="text-yellow-600 italic">{role}</span>
        </h2>

        <p className="text-center text-gray-500 text-sm mt-1">
          Welcome back — enter your credentials
        </p>

        <hr className="my-5 border-gray-300" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="text-xs font-medium text-[#0d1b3e] uppercase tracking-wide">
              Email
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-[#0d1b3e] uppercase tracking-wide">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0d1b3e] text-white py-2 rounded-lg hover:bg-[#162447] transition transform hover:-translate-y-0.5"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-500 cursor-pointer hover:underline">
            Forgot password?
          </span>

          <Link
            to={`/register?role=${roleParam}`}
            className="text-yellow-600 hover:underline"
          >
            Create account →
          </Link>
        </div>
      </div>
    </div>
  );
}
