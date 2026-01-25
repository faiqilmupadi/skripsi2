import React, { useState, useEffect } from "react";
import { User, UserRole } from "@/types/managementUser";

interface EditRoleModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (role: UserRole) => void;
  isSaving: boolean;
}

export default function EditRoleModal({ isOpen, user, onClose, onSave, isSaving }: EditRoleModalProps) {
  const [role, setRole] = useState<UserRole>("admin_gudang");

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200">
        
        <h3 className="text-xl font-bold text-gray-800 mb-6">Edit User Role</h3>
        
        <div className="space-y-4">
          {/* Username (Read Only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-sm font-semibold text-gray-600">Username :</label>
            <div className="col-span-3 bg-gray-100 px-4 py-2 rounded-lg text-gray-500 text-sm">
              {user.nama}
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-sm font-semibold text-gray-600">Gmail :</label>
            <div className="col-span-3 bg-gray-100 px-4 py-2 rounded-lg text-gray-500 text-sm">
              {user.email}
            </div>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-sm font-semibold text-gray-600">Role :</label>
            <div className="col-span-3 relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8"
              >
                <option value="admin_gudang">ADMIN GUDANG</option>
                <option value="manager_gudang">MANAGER GUDANG</option>
              </select>
              {/* Chevron Icon for Select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(role)}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

      </div>
    </div>
  );
}