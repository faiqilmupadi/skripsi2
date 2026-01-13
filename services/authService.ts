import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";
// ❌ Hapus import bcrypt di sini juga

export const registerUser = async (name: string, email: string, pass: string, role: string = 'user') => {
  const db = getDb();
  
  const [existing] = await db.query<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) throw new Error("Email sudah terdaftar");

  // ❌ JANGAN DI HASH
  // const hashedPassword = await bcrypt.hash(pass, 12); 

  // ✅ Simpan password apa adanya (pass)
  await db.query(
    "INSERT INTO users (nama, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
    [name, email, pass, role] // <-- Pakai variable 'pass' langsung
  );
  
  return true;
};