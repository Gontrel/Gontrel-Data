"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../assets/images/logo.png";
import Link from "next/link";
import Button from "@/components/button/Button";
import { useRouter } from "next/navigation"; 

const ForgetPassword = () => {

   const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Request to reset password for:", email);
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsLoading(false);
      return;
    }

    try {
      //TODO:  API call
      console.log("Request to reset password for:", email);
        router.push("/reset-password"); 
    } catch (error) {

      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className=" flex min-h-screen items-center justify-center ">
      <section className="flex flex-col items-center min-w-[559px] min-h-[640px]">
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
            Forgot password
          </h1>
          <p className="pt-[12px] text-center text-[20px] font-medium">
            Let’s get you back into your account
          </p>
        </div>

        {/* Form section */}
        <section className="mt-[60px] min-w-[559px] md:w-1/2 ">
          <form className="" onSubmit={handleSubmit}>
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
                className="w-full border border-[#D5D5D5] rounded-[20px] mt-[19px] px-[22px] py-[28px] placeholder-gray-400 placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`cursor-pointer my-[70px] w-full bg-[#0070F3] h-[80px] border rounded-[20px] font-semibold text-[20px] text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } `}
            >
              Continue
            </Button>
          </form>

          <Link href="/" passHref>
            <p className="text-[#0070F3] font-medium text-center transition-all duration-300 ease-out cursor-pointer hover:underline">
              Back to sign in
            </p>
          </Link>
        </section>
      </section>
    </main>
  );
};

export default ForgetPassword;
