export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin_gudang" | "manager_gudang" | "user"; // Sesuai gambar
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}