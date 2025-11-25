"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useRouter } from "next/navigation";
import { errorToast, successToast } from "@/utils/toast";
import { trpc } from "@/lib/trpc-client";
import { useAuthStore } from "@/stores/authStore";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuthStore();

  const router = useRouter();
  const togglePassword = () => setShowPassword((prev) => !prev);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: login, isPending: isLoading } = trpc.auth.login.useMutation({
    // Add timeout to prevent infinite loading
    retry: false, // Disable retries to prevent infinite loops
    retryDelay: 0,
    onSuccess: (data) => {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      successToast("Login successful!");
      // Store User details
      setUser(data.user);

      router.push("/restaurants");
    },
    onError: (error) => {

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Enhanced error handling - extract message from various possible locations
      let errorMessage = "Login failed. Please try again.";

      // tRPC errors have the message directly on the error object
      if (error?.message) {
        errorMessage = error.message;
      }
      // Check error.data for nested message (tRPC error format)
      else if (error?.data) {
        if (typeof error.data === "string") {
          errorMessage = error.data;
        } else if (typeof error.data === "object") {
          const errorData = error.data as Record<string, unknown>;
          if (typeof errorData.message === "string") {
            errorMessage = errorData.message;
          } else if (typeof errorData.error === "string") {
            errorMessage = errorData.error;
          }
        }
      }
      // Check error.shape for tRPC error shape
      else if (error?.shape?.message) {
        errorMessage = error.shape.message;
      }
      errorToast(errorMessage);
    },
    onSettled: () => {
      // Always clear timeout when mutation completes (success or error)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    },
    // Add mutation timeout
    gcTime: 0, // Don't cache failed mutations
  });

  // Add client-side timeout as a safety net
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate email and password
    if (!email || !email.trim()) {
      errorToast("Please enter your email address");
      return;
    }

    if (!password || !password.trim()) {
      errorToast("Please enter your password");
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a timeout to prevent infinite loading (safety net)
    timeoutRef.current = setTimeout(() => {
      errorToast(
        "Request is taking too long. Please check your connection and try again."
      );
      timeoutRef.current = null;
    }, 35000); // 35 seconds (slightly longer than server timeout)

    login({ email: email.trim(), password });
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <section className="flex flex-col items-center w-full max-w-md sm:max-w-lg">
        {/* Header section */}
        <div className="flex flex-col items-center bg-white">
          <Image
            src={"/images/logo.png"}
            width={100}
            height={100}
            alt="Gontrel Logo"
            // className="mx-auto block"
          />

          <h1 className="pt-6 text-2xl sm:text-3xl leading-[100%] tracking-[0px] font-semibold">
            Welcome back
          </h1>
          <p className="pt-3 text-center text-base sm:text-lg font-medium">
            Let’s get you signed in
          </p>
        </div>

        {/* Form section */}
        <section className="mt-8 sm:mt-12 w-full">
          <form className="" onSubmit={handleLogin}>
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

            {/* Password field */}
            <div>
              <div className="flex flex-row justify-between">
                <label className="text-base sm:text-lg font-medium text-[#444]">
                  Password
                </label>
                <Link href="/forget-password">
                  <p className="text-blue-500 font-medium text-base sm:text-lg">
                    Forgot Password?
                  </p>
                </Link>
              </div>

              <div className="relative mt-4">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full border border-[#D5D5D5] rounded-[20px] px-4 py-3 sm:px-5 sm:py-4 placeholder-[#8A8A8A] placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 pr-12"
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
              className="cursor-pointer mt-8 w-full bg-blue-500 h-12 sm:h-14 border rounded-[20px] font-semibold text-base sm:text-lg text-white"
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
