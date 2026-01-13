// components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "outline" | "danger";
}

// PERHATIKAN KATA "export" DI BAWAH INI
export const Button: React.FC<ButtonProps> = ({ 
  children, isLoading, variant = "primary", className, ...props 
}) => {
  // ... (sisa kodingan sama seperti sebelumnya)
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex justify-center items-center";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button 
      {...props} 
      disabled={isLoading || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? "Memproses..." : children}
    </button>
  );
};