"use client";

import React from "react";
import Image from "next/image";
import logo from "../../../assets/images/reset-logo.png";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/button/Button";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const [userEmail, setUserEmail] = useState("brianxcode21@gmail.com"); // TODO:

  const maskEmail = (email: string) => {
    if (!email || !email.includes("@")) return "*****@*****";

    const [username, domain] = email.split("@");
    const firstChar = username.charAt(0);
    return `${firstChar}*****@${domain}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation using Zod

    try {
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
    }
  };
  return (
    <main className=" flex min-h-screen items-center justify-center ">
      <section className="flex flex-col items-center max-w-[559px] h-full">
        {/* Header section */}
        <div className="flex flex-col flex-wrap items-center w-[413px] bg-white">
          <Image
            src={logo}
            width={100}
            height={100}
            alt="Reset Logo"
            className="mx-auto"
          />
          <h1 className="pt-[27px] text-[40px] leading-[100%] tracking-[0px] font-semibold">
            Email Sent
          </h1>
          <p className="pt-[12px] text-center text-[22px] font-medium">
            We have sent a 4-digit code to your email{" "}
            <span className="font-semibold text-[22px]">
              {maskEmail(userEmail)}
            </span>
            . Use it to confirm password change
          </p>
        </div>

        {/* Form section */}
        <section className="mt-[60px] min-w-[559px] md:w-1/2 ">
          <form className="" onSubmit={handleSubmit}>
            {/*  New Password field */}
            <div className="mb-[30px]">
              <label className="text-xl font-medium text-[#444] ">
                New Password
              </label>

              <div className="relative mt-[19px]">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="w-full border border-[#D5D5D5] rounded-[20px] px-[22px] h-[80px] py-[28px] 
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

            {/* Confirm new Password field */}
            <div>
              <label className="text-xl font-medium text-[#444]">
                Confirm new Password
              </label>

              <div className="relative mt-[19px]">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="w-full border border-[#D5D5D5] rounded-[20px] px-[22px] py-[28px]
                   placeholder-[#8A8A8A] placeholder:text-lg 
                  placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 pr-12"
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

            <div className="w-full mt-[30px]">
              <div className="flex flex-row items-center justify-between ">
                <p className="text-[#444] font-medium text-[20px]">
                  Enter code
                </p>
                <button
                  //   onSubmit={}
                  className="text-[#0070F3] font-medium text-[20px] cursor-pointer transition-all duration-300 ease-out hover:underline"
                >
                  <p> Resend code</p>
                </button>
              </div>

              <div className="relative mt-[19px]">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your code"
                  className="w-full border border-[#D5D5D5] rounded-[20px] px-[22px] py-[28px]
                   placeholder-[#8A8A8A] placeholder:text-lg 
                  placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 pr-12"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="cursor-pointer my-[70px] w-full bg-[#0070F3] h-[80px] border rounded-[20px] font-semibold text-[20px] text-white "
            >
              Continue
            </Button>
          </form>

          <Link href="/" passHref>
            <p className="text-[#0070F3] font-medium text-center text-[22px] leading-[100%] transition-all duration-300 ease-out cursor-pointer hover:underline">
              Back to sign in
            </p>
          </Link>
        </section>
      </section>
    </main>
  );
};

export default ResetPassword;
