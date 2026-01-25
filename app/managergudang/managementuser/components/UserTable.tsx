import React from "react";
import { User } from "@/types/managementUser";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
}

export default function UserTable({ users, isLoading, onEdit }: UserTableProps) {
  if (isLoading) return <div className="p-4 text-center">Loading data users...</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold">Role</th>
            <th className="px-6 py-4 font-semibold">Created At</th>
            <th className="px-6 py-4 font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                Tidak ada data user.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{user.nama}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin_gudang"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.role === "admin_gudang" ? "Admin Gudang" : "Manager Gudang"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(user.created_at).toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Role"
                  >
                    {/* Icon Edit SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}