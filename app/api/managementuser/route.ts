import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
// GET: Ambil semua user
export async function GET() {
  try {
    // Sesuaikan query dengan nama tabel di gambar (users)
    const users = await query("SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC");
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ message: "Database Error" }, { status: 500 });
  }
}

// PUT: Update Role User
export async function PUT(req: Request) {
  try {
    const { id, role } = await req.json();

    if (!id || !role) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    await query("UPDATE users SET role = ? WHERE id = ?", [role, id]);

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Database Error" }, { status: 500 });
  }
}