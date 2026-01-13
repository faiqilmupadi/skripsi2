import { NextResponse } from "next/server";
import { registerUser } from "@/services/authService";

export async function POST(req: Request) {
  try {
    // 1. Ambil data dari Frontend
    const body = await req.json();
    const { name, email, password, role } = body;

    console.log("👉 Data Register Masuk:", body); // Debugging: Cek data di terminal

    // 2. Validasi sederhana
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama, Email, dan Password wajib diisi!" },
        { status: 400 }
      );
    }

    // 3. Panggil Service untuk simpan ke DB
    // Role default kita set 'user' jika tidak dipilih, atau ambil dari body jika ada
    await registerUser(name, email, password, role || "user");

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil" },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Register Error:", error.message);
    
    // Jika error karena email duplikat (dari authService)
    return NextResponse.json(
      { message: error.message || "Gagal mendaftar" },
      { status: 400 }
    );
  }
}