export type UserRole = "admin_gudang" | "manager_gudang";

export interface User {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface UpdateUserRolePayload {
  id: number;
  role: UserRole;
}