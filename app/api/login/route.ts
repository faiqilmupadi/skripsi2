import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken"; 

// ✅ PERBAIKAN: Gunakan process.env untuk mengakses variabel .env
// Kita kasih "fallback" (|| 'rahasia...') buat jaga-jaga kalau file .env gagal terbaca
const JWT_SECRET = process.env.JWT_TOKEN || "rahasia-skripsi-faiq-2026"; 

export async function POST(req: Request) {
  // ... (sisa kode sama seperti sebelumnya) ...
  try {
    const body = await req.json();
    const { email, password } = body;

    const db = getDb();
    const [users] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 401 });
    }

    const user = users[0];

    if (password !== user.password) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // --- BAGIAN JWT ---
    const token = jwt.sign(
      { 
        id: user.id, 
        name: user.nama || user.name, 
        role: user.role,
        email: user.email 
      },
      JWT_SECRET, // Sekarang variabel ini sudah benar isinya
      { expiresIn: "1d" } 
    );

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      token: token,
      role: user.role
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}