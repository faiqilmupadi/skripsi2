"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login gagal");

      localStorage.setItem("user_session", JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      }));

      toast.success(`Selamat datang, ${data.name}!`);
      
      if (data.role === "manager_gudang") {
        router.push("/managergudang/dashboardrealtime");
      } else if (data.role === "admin_gudang") {
        router.push("/admingudang/stockbarang");
      } else {
        router.push("/beranda");
      }
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50/50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        <div className="flex justify-center mb-6">
           {/* Logo Image */}
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Selamat Datang Kembali</h2>
        <p className="text-center text-slate-500 mb-8 text-sm">Silakan masuk untuk mengakses sistem.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="nama@waskita.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-600">
              <input type="checkbox" className="mr-2 rounded text-blue-600 focus:ring-blue-500" />
              Ingat Saya
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
              Lupa Password?
            </Link>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full py-3 shadow-lg shadow-blue-200">
            MASUK
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-blue-600 hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}