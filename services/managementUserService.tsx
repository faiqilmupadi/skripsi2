import { User, UpdateUserRolePayload } from "@/types/managementUser";

const API_URL = "/api/managementuser";

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Gagal mengambil data user");
  const data = await res.json();
  return data.users; // Asumsi response { users: [...] }
};

export const updateUserRole = async (payload: UpdateUserRolePayload): Promise<void> => {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengupdate role");
  }
};