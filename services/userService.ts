export interface User {
  id: number;
  nama: string; // <-- UBAH DARI 'username' KE 'nama'
  role: string; // isinya 'admin_gudang' / 'manager_gudang'
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const res = await fetch("/api/users", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Gagal ambil users:", error);
    return [];
  }
}