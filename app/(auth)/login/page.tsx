"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login gagal");

      // ✅ SIMPAN TOKEN KE LOCALSTORAGE
      localStorage.setItem("token", data.token);
      
      alert("Login Berhasil!");
      
      // Redirect
      if (data.role === "admin_gudang") {
        router.push("/admingudang/stockbarang");
      } else {
        router.push("/managergudang/dashboardrealtime");
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login (JWT)</h1>
        {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email" required 
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required 
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({...form, password: e.target.value})}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Masuk</button>
        </form>
      </div>
    </div>
  );
}