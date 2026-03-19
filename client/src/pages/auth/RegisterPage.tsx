import { useState } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import {citizen, court} from "../../assets/index.ts";
import { register } from "../../services/authService.ts";


export default function RegisterPage() {
  const navigate = useNavigate()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [name,setName] = useState("")
  const [roleParam,setRoleParam] = useState("")

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e:React.FormEvent) =>{
    e.preventDefault();
    const total = await register(name,email,password,roleParam)
    const data = total.data

    if(!total.ok){
        alert("Registration Failed")
        return;
    }
    const roleIt = roleParam.toLowerCase().trim()
    const role = roleIt==="user"?"citizen":"lawyer"
    localStorage.setItem("role",role)
    localStorage.setItem("token",data.token)
    alert(data.message)
    navigate(`/${role}/dashboard`)
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1b3e] px-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-500 opacity-10 blur-3xl rounded-full top-[-100px] right-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-yellow-500 opacity-10 blur-3xl rounded-full bottom-[-100px] left-[-100px]"></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-[#f5f0e8] rounded-2xl shadow-2xl p-8 m-2">

        {/* Logo */}
        <div className="w-12 h-12 bg-[#0d1b3e] rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-yellow-400 font-bold text-lg">
            <img src={court} alt="logo" />
          </span>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-[#0d1b3e]">
          Register as <span className="text-yellow-600 italic">{roleParam}</span>
        </h2>

        <p className="text-center text-gray-500 text-sm mt-1">
          Create your account to get started
        </p>

        <hr className="my-5 border-gray-300" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-[#0d1b3e] uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e)=>setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-[#0d1b3e] uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          {/* Role */}
          <div>
            <label className="text-xs font-medium text-[#0d1b3e] uppercase tracking-wide">
              Role
            </label>
            <input
              type="text"
              placeholder="User/Lawyer"
              onChange={(e)=>setRoleParam(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
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
                onChange={(e)=>setPassword(e.target.value)}
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


          {/* Confirm Password */}
          <div>
            <label className="text-xs font-medium text-[#0d1b3e] uppercase tracking-wide">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0d1b3e] text-white py-2 rounded-lg hover:bg-[#162447] transition transform hover:-translate-y-0.5"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/login" className="text-gray-500 hover:underline">
            Already have an account?
          </Link>

          <Link to="/login" className="text-yellow-600 hover:underline">
            Login →
          </Link>
        </div>
      </div>
    </div>
  );
}