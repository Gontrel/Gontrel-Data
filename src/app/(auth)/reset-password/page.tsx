"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import logo from "../../../assets/images/reset-logo.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import { errorToast, successToast } from "@/utils/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc-client";

const ResetPasswordContent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const [userEmail, setUserEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate: resetPassword, isPending: isLoading } =
    trpc.auth.resetPassword.useMutation({
      onSuccess: () => {
        successToast("Password reset successful!");
        router.push("/");
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  const { mutate: resendCode, isPending: isResending } =
    trpc.auth.forgetPassword.useMutation({
      onSuccess: async () => {
        successToast("A new code has been sent.");
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setUserEmail(email);
    }
  }, [searchParams]);

  const maskEmail = (email: string) => {
    if (!email || !email.includes("@")) return "*****@*****";

    const [username, domain] = email.split("@");
    const firstChar = username.charAt(0);
    return `${firstChar}*****@${domain}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setOtpCode(numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword || !otpCode) {
      errorToast("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      errorToast("Passwords do not match.");
      return;
    }
    resetPassword({ newPassword, otpCode });
  };

  const handleResendCode = () => {
    if (userEmail) {
      resendCode({ email: userEmail });
    } else {
      errorToast("Email is not available to resend the code.");
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
          <h1 className="pt-[27px] text-[40px] leading-[100%] tracking-[0px] font-semibold ">
            Email Sent
          </h1>
          <p className="pt-[12px] text-center text-[22px] font-medium ">
            We have sent a 4-digit code to your email{" "}
            <span className="font-semibold text-[22px] ">
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[#D5D5D5] rounded-[20px] px-[22px] h-[80px] py-[28px]
                  placeholder-[#8A8A8A] placeholder:font-placeholder:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 pr-12"
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
              <label className="text-xl font-medium text-[#444] ">
                Confirm new Password
              </label>

              <div className="relative mt-[19px]">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <p className="text-[#444] font-medium text-[20px] ">
                  Enter code
                </p>
                <Button
                  clickFunc={handleResendCode}
                  disabled={isResending}
                  loading={isResending}
                  loadingText="Resending..."
                  className="text-[#0070F3] font-medium text-[20px] cursor-pointer transition-all duration-300 ease-out hover:underline  disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Resend code
                </Button>
              </div>

              <div className="relative mt-[19px]">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter your code"
                  value={otpCode}
                  onChange={handleOtpChange}
                  className="w-full border border-[#D5D5D5] rounded-[20px] px-[22px] py-[28px] placeholder-[#8A8A8A] placeholder:text-lg
                  placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 pr-12"
                />
              </div>
            </div>
            <Button
              type="submit"
              loading={isLoading}
              className="cursor-pointer my-[70px] w-full bg-blue-500 h-[80px] border rounded-[20px] font-semibold text-[20px] text-white"
            >
              Continue
            </Button>
          </form>

          <Link href="/" passHref>
            <p className="text-blue-500 font-medium text-center text-[22px] leading-[100%] transition-all duration-300 ease-out cursor-pointer hover:underline">
              Back to sign in
            </p>
          </Link>
        </section>
      </section>
    </main>
  );
};

const ResetPassword = () => {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center max-w-[559px] h-full">
          <div className="flex flex-col flex-wrap items-center w-[413px] bg-white">
            <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
            <div className="pt-[27px] w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="pt-[12px] w-80 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;
