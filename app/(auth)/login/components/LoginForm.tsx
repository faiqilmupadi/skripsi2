"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginInput from "@/components/ui/LoginInput";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login gagal");

      localStorage.setItem("token", data.token);

      if (data.role === "admin_gudang") {
        router.push("/admingudang/stockbarang");
      } else {
        router.push("/managergudang/dashboardrealtime");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="mb-10 text-3xl font-normal text-white">Sign in first!</h1>

      {error && (
        <div className="mb-4 rounded bg-red-500/80 p-2 text-sm text-white backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <LoginInput
          type="email"
          placeholder="Gmail"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <LoginInput
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" className="hidden" disabled={loading}>Login</button> 
      </form>

      <div className="mt-12 text-sm text-white">
        don't have an account?{" "}
        <Link href="/register" className="font-bold underline hover:text-gray-200">
          Sign up first
        </Link>
      </div>
    </div>
  );
}