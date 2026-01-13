"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  // Tambah field nama untuk register
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Hit API Register, bukan Login
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mendaftar");

      toast.success("Registrasi Berhasil! Silakan Login.");
      
      // Redirect ke halaman login setelah daftar
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
    <div className="min-h-screen flex items-center justify-center bg-blue-50/50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Buat Akun Baru</h2>
        <p className="text-center text-slate-500 mb-8 text-sm">Daftar untuk mulai mengelola gudang.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama Wajib Ada di Register */}
          <Input
            label="Nama Lengkap"
            name="name"
            type="text"
            placeholder="Nama Anda"
            value={formData.name}
            onChange={handleChange}
            required
          />
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

          <Button type="submit" isLoading={isLoading} className="w-full py-3 shadow-lg shadow-blue-200 mt-4">
            DAFTAR AKUN
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}