// components/ui/LoginInput.tsx
import React from "react";

interface LoginInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function LoginInput({ className, ...props }: LoginInputProps) {
  return (
    <input
      className={`w-full rounded-full border-none bg-white px-6 py-3 text-sm text-gray-800 shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
      {...props}
    />
  );
}