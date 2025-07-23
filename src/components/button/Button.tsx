import React from "react";

interface ButtonProps {
  clickFunc?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean
  children?: React.ReactNode;
  className?: string; 
}

const Button: React.FC<ButtonProps> = ({
  clickFunc,
  type = "button",
  disabled= false,
  children = "Sign Up",
  className = "",
}) => {
  return (
    <button
      onClick={clickFunc}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
