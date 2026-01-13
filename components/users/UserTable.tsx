import React from "react";
import { User } from "@/types/auth";
import { FaEdit, FaTrash, FaCopy } from "react-icons/fa"; // Pastikan install react-icons

interface UserTableProps {
  data: User[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-slate-100">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-blue-600 text-white uppercase font-semibold">
          <tr>
            <th className="px-6 py-4 rounded-tl-xl">Action</th>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Nama</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4 rounded-tr-xl">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((user) => (
            <tr key={user.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-6 py-4 flex space-x-2">
                <button 
                  onClick={() => onEdit(user.id)}
                  className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700 font-medium bg-yellow-100 px-2 py-1 rounded"
                >
                  <FaEdit /> <span>Ubah</span>
                </button>
                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium bg-blue-100 px-2 py-1 rounded">
                  <FaCopy /> <span>Salin</span>
                </button>
                <button 
                   onClick={() => onDelete(user.id)}
                   className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium bg-red-100 px-2 py-1 rounded"
                >
                  <FaTrash /> <span>Hapus</span>
                </button>
              </td>
              <td className="px-6 py-4 font-mono text-slate-500">{user.id}</td>
              <td className="px-6 py-4 font-semibold text-slate-800">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'admin_gudang' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                }`}>
                  {user.role.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">{user.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};