import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// ❌ HAPUS import bcrypt
// import bcrypt from "bcryptjs"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log("==========================================");
    console.log("👉 [LOGIN DEBUG] Email:", email);
    console.log("👉 [LOGIN DEBUG] Pass Input:", password);

    const db = getDb();

    // 1. Cari user
    const [users] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      console.log("❌ [LOGIN DEBUG] Email tidak ditemukan.");
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 401 });
    }

    const user = users[0];
    console.log("👉 [LOGIN DEBUG] Pass di DB:", user.password);

    // 2. CEK PASSWORD (PLAIN TEXT)
    // Kita bandingkan langsung string vs string
    if (password !== user.password) {
      console.log("❌ [LOGIN DEBUG] Password salah (Tidak sama persis).");
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    console.log("✅ [LOGIN DEBUG] Login Sukses!");
    console.log("==========================================");

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      id: user.id,
      // Pastikan ini sesuai kolom DB kamu (nama atau name)
      name: user.nama || user.name, 
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error("❌ SERVER ERROR:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}