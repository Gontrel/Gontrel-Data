"use client";

import logo from "../assets/images/logo.png";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Button from "../components/ui/Button";
import { useRouter } from "next/navigation";
import { errorToast, successToast } from "@/utils/toast";
import { trpc } from "@/lib/trpc-client";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const togglePassword = () => setShowPassword((prev) => !prev);

  const { mutate: login, isPending: isLoading } = trpc.auth.login.useMutation({
    onSuccess: () => {
      successToast("Login successful!");
      router.push("/restaurants");
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <main className=" flex min-h-screen items-center justify-center ">
      <section className="flex flex-col items-center min-w-[559px] min-h-[697px]">
        {/* Header section */}
        <div className="flex flex-col  items-center bg-white">
          <Image
            src={logo}
            width={100}
            height={100}
            alt="Gontrel Logo"
            className="mx-auto"
          />
          <h1 className="pt-[27px] text-[40px] leading-[100%] tracking-[0px] font-semibold">
            Welcome back
          </h1>
          <p className="pt-[12px] text-center text-[20px] font-medium">
            Let’s get you signed in
          </p>
        </div>

        {/* Form section */}
        <section className="mt-[60px] min-w-[559px] md:w-1/2">
          <form className="" onSubmit={handleLogin}>
            {/* Email field */}
            <div className="mb-[30px]">
              <label className="text-xl font-medium text-[#444]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full border border-[#D5D5D5] rounded-[20px] mt-[19px] px-[22px] py-[28px] placeholder-[#8A8A8A] placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex flex-row justify-between">
                <label className="text-xl font-medium text-[#444]">
                  Password
                </label>
                <Link href="/forget-password">
                  <p className="text-blue-500 font-medium text-[20px]">
                    Forgot Password?
                  </p>
                </Link>
              </div>

              <div className="relative mt-[19px]">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full border border-[#D5D5D5] rounded-[20px] px-[22px] py-[28px]
                      placeholder-[#8A8A8A] placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 pr-12"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="cursor-pointer absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="cursor-pointer mt-[50px] w-full bg-blue-500 h-[80px] border rounded-[20px] font-semibold text-[20px] text-white"
              disabled={isLoading}
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </section>
      </section>
    </main>
  );
}
