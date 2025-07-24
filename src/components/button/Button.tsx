import React from "react";
import { Loader } from "lucide-react";

interface ButtonProps {
  clickFunc?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  clickFunc,
  type = "button",
  disabled = false,
  children = "Sign Up",
  className = "",
  loading = false,
}) => {
  return (
    <button
      onClick={clickFunc}
      disabled={disabled || loading}
      type={type}
      className={`${className} flex items-center justify-center`}
    >
      {loading ? (
        <>
          <Loader className="animate-spin mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
