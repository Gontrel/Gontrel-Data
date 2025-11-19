"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { errorToast, successToast } from "@/utils/toast";
import { trpc } from "@/lib/trpc-client";

const ForgetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const { mutate: forgetPassword, isPending: isLoading } =
    trpc.auth.forgetPassword.useMutation({
      onSuccess: () => {
        successToast("Password reset email sent successfully!");
        router.push(`/reset-password?email=${email}`);
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorToast("Please enter a valid email address.");
      return;
    }
    forgetPassword({ email });
  };
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <section className="flex flex-col items-center w-full max-w-md sm:max-w-lg">
        {/* Header section */}
        <div className="flex flex-col  items-center bg-white">
          <Image
            src={"/images/logo.png"}
            width={100}
            height={100}
            alt="Gontrel Logo"
            className="mx-auto"
          />
          <h1 className="pt-6 text-2xl sm:text-3xl leading-[100%] tracking-[0px] font-semibold">
            Forgot password
          </h1>
          <p className="pt-3 text-center text-base sm:text-lg font-medium">
            Let’s get you back into your account
          </p>
        </div>

        {/* Form section */}
        <section className="mt-8 sm:mt-12 w-full">
          <form className="" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="mb-6">
              <label className="text-base sm:text-lg font-medium text-[#444]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full border border-[#D5D5D5] rounded-[20px] mt-4 px-4 py-3 sm:px-5 sm:py-4 placeholder-[#8A8A8A] placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              className={`cursor-pointer my-8 w-full bg-blue-500 h-12 sm:h-14 border rounded-[20px] font-semibold text-base sm:text-lg text-white`}
            >
              Continue
            </Button>
          </form>

          <Link href="/" passHref>
            <p className="text-blue-500 font-medium leading-[100%] text-center transition-all duration-300 ease-out cursor-pointer hover:underline">
              Back to sign in
            </p>
          </Link>
        </section>
      </section>
    </main>
  );
};

export default ForgetPassword;
