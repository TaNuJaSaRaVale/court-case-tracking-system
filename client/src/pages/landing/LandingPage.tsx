import { Link } from "react-router-dom";
import { alarm, book, citizen , court , handshake, lawyer, magnify } from "../../assets";
export default function LandingPage() {
  return (
    <div>
      <div className="pb-16">
        <div className="m-1 w-full flex gap-2">
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
        </div>
        <hr></hr>
        <main className="min-h-[70vh] w-full bg-[#08108a] flex flex-col justify-center items-center gap-4 px-4 text-center">
          <div>
            <p className="text-blue-800 bg-white border m-1 my-4 rounded-2xl inline-block px-3 py-1 text-sm">
              India's Legal Companion
            </p>

            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
              Legal help, made Simple
            </h2>

            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
              for every citizen
            </h2>

            <p className="max-w-lg mx-auto mt-3 text-white text-sm sm:text-base">
              Track your court cases, understand legal steps in plain language,
              and connect with the right lawyers — all in one place.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/login?role=citizen">
              <div className="border border-blue-900 flex gap-2 rounded-2xl items-center px-4 py-2">
                <img src={citizen} className="w-6" />
                <p className="text-white">I'm a Citizen</p>
              </div>
            </Link>

            <Link to="/login?role=lawyer">
              <div className="border border-blue-900 flex gap-2 rounded-2xl items-center px-4 py-2">
                <img src={lawyer} className="w-6" />
                <p className="text-white">I'm a Lawyer</p>
              </div>
            </Link>
          </div>
        </main>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-6">
          <div className="flex border-[2px] rounded-2xl  flex-col h-56 p-4 justify-between hover:shadow-lg hover:scale-105 transition duration-300">
            <img src={magnify} alt="trackCase" className="m-1 w-10 h-10 mb-2" />
            <h4>Track Cases</h4>
            <p>
              Search any court case by number. Get real-time status, hearing
              dates & updates.
            </p>
          </div>
          <div className="flex border-[2px] rounded-2xl flex-col h-56 p-4 justify-between hover:shadow-lg hover:scale-105 transition duration-300">
            <img src={book} alt="language" className="m-1 w-10 h-10 mb-2" />
            <h4>Plain Language</h4>
            <p>
              Legal jargon explained simply. Know exactly what each stage means
              for you.
            </p>
          </div>
          <div className="flex border-[2px] rounded-2xl flex-col h-56 p-4 justify-between hover:shadow-lg hover:scale-105 transition duration-300">
            <img src={alarm} alt="reminders" className="m-1 w-10 h-10 mb-2" />
            <h4>Smart Reminders</h4>
            <p>
              Never miss a hearing. Get reminders before your next court date.
            </p>
          </div>
          <div className="flex border-[2px] rounded-2xl flex-col h-56 p-4 justify-between hover:shadow-lg hover:scale-105 transition duration-300">
            <img src={handshake} alt="lawyers" className="m-1 w-10 h-10 mb-2" />
            <h4>Find Lawyers</h4>
            <p>
              Connect with verified advocates who match your case type and
              language.
            </p>
          </div>
        </div>
        <div className="flex flex-col h-[70vh] w-full items-center text-center justify-center gap-1">
          <h6 className="text-[rgb(156,149,149)]">CHOOSE YOUR PATH</h6>
          <h2>
            Built for <i className="text-[rgb(248,114,3)]">everyone</i>
          </h2>
          <h2>in the courtroom</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-6 gap-6">
            <div className="flex flex-col border-[2px] h-56 rounded-2xl justify-center text-left gap-1 p-4">
              <h1 className="text-[rgb(219,206,206)] m-1 text-5xl">01</h1>
              <h2 className="m-1">Citizens</h2>
              <p className="m-1">
                Track Your case Progress,understand legal stages,prepare
                documents and find right lawyers.
              </p>
            </div>
            <div className="flex flex-col border-[2px] h-56 rounded-2xl justify-center text-left gap-1 p-4">
              <h1 className="text-[rgb(219,206,206)] m-1 text-5xl">02</h1>
              <h2 className="m-1">Lawyers</h2>
              <p className="m-1">
                Manage your cases efficiently, track client progress, get hearing updates, and connect with potential clients seamlessly.
              </p>
            </div>
            <div className="flex flex-col border-[2px] h-56 rounded-2xl justify-center text-left gap-1 p-4">
              <h1 className="text-[rgb(219,206,206)] m-1 text-5xl">03</h1>
              <h2 className="m-1">Administrator</h2>
              <p className="m-1">
                Monitor case workflows, manage records, and ensure smooth coordination between citizens and legal professionals.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center m-1 h-[78vh] gap-1">
          <h1>How it Works</h1>

          <div className="relative flex justify-between w-full px-44 my-10">
            {/* LINE */}
            <div className="absolute top-5 left-[20%] right-[20%] h-[2px] bg-gray-300"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white">
                1
              </div>
              <h5 className="font-light">Search Your Case</h5>
              <p className="text-gray-500">Enter your case number</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white">
                2
              </div>
              <h5 className="font-light">Understand the status</h5>
              <p className="text-gray-500">See it in simple terms</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white">
                3
              </div>
              <h5 className="font-light">Get Reminders</h5>
              <p className="text-gray-500">Stay informed always</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white">
                4
              </div>
              <h5 className="font-light">Find a Lawyer</h5>
              <p className="text-gray-500">Book a consultation</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-900 text-white py-12 text-center px-4">
          <h2 className="text-3xl font-bold text-[rgb(255,255,255)]">
            Get clarity on your case today
          </h2>
          <p className="mt-3 text-gray-200">
            Track your case, understand legal steps, and connect with lawyers in
            minutes.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link to={'/login'}>
            <button className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold">
              Track Your Case
            </button>
            </Link>
            <Link to={'/login'}>
            <button className="border border-white px-6 py-2 rounded-lg">
              Find a Lawyer
            </button>
            </Link>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white text-xs sm:text-sm py-2 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 z-50">
          <p>© 2026 NyaySetu</p>

          <div className="flex gap-4">
            <Link to={'/privacy'}><span className="cursor-pointer hover:underline">Privacy</span></Link>
            <Link to={'/terms'}><span className="cursor-pointer hover:underline">Terms</span></Link>
            <Link to={'/contact'}><span className="cursor-pointer hover:underline">Contact</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
