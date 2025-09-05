import React from "react";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils"; // utility to join Tailwind classes if you’re using shadcn

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
  loadingText?: string;
  variant?: "default" | "ghost" | "outline" | "destructive"; // 👈 add supported variants
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  type = "button",
  disabled = false,
  children = "Sign Up",
  className = "",
  loading = false,
  loadingText = "Loading...",
  variant = "default",
}) => {
  const variantClasses: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={cn(
        "flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        className
      )}
    >
      {loading ? (
        <>
          <Loader className="animate-spin mr-2 h-4 w-4" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};
