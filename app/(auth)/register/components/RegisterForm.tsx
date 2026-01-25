"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoginInput from "@/components/ui/LoginInput";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mendaftar");

      toast.success("Registrasi Berhasil! Silakan Login.");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="mb-10 text-3xl font-normal text-white">Sign up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <LoginInput
          name="name"
          type="text"
          placeholder="Username"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <LoginInput
          name="email"
          type="email"
          placeholder="Gmail"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <LoginInput
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button 
          type="submit" 
          disabled={isLoading}
          className="hidden"
        >
          Daftar
        </button>
      </form>

      <div className="mt-12 text-sm text-white">
        Already have an account?{" "}
        <Link href="/login" className="font-bold underline hover:text-gray-200">
          Login here
        </Link>
      </div>
    </div>
  );
}