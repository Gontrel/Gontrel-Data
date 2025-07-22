import images from "../constant/images";
import logo from "../assets/icons/logo.svg";
import googleIcon from "../assets/icons/google-icon.svg";
import Image from "next/image";

export default function Home() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-row items-center justify-center w-full max-w-4xl bg-white rounded-[16px] shadow-xl overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-8">
          <Image
            src={images.LandingScreen.src}
            alt="Login"
            width={320}
            height={320}
            className="w-[320px] h-[320px]"
          />
        </div>

        {/*Vertical Divider*/}
        <div className="flex flex-col bg-[#EFEFEF] w-[1px] h-[264px] rounded-[32px]"></div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 gap-1 flex items-center flex-row">
            <Image src={logo.src} alt="" width={107} height={24} className="w-[107px] h-[24px]" />
            <p className="text-[#3D3D3D] font-semibold pl-4">Admin</p>
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-black mb-1">Enter email</label>
              <input
                type="email"
                placeholder="Email here..."
                className="w-full px-4 py-3 border border-[#C2C3C4] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-black mb-1">Password</label>
              <input
                type="password"
                placeholder="Password here..."
                className="w-full px-4 py-3 border border-[#C2C3C4] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-left">
              <a href="#" className="text-sm text-[#0070F3] hover:underline">
                Forgot password
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0070F3] text-white py-3 rounded-full hover:bg-blue-700 transition"
            >
              <span className="font-medium">Login</span>
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6D7378] font-medium">
            Or continue with
          </div>

          <div className="mt-4">
            <button className="w-full border border-[#F0F1F2] py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition" title="Google Sign In">
              <Image src={googleIcon.src} alt="Google" width={20} height={20} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
