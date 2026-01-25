"use client";

import React from "react";
import { useManagementUser } from "@/app/hooks/manager/managementuser/useManagementUser";
import UserTable from "./components/UserTable";
import EditRoleModal from "./components/EditRoleModal";

export default function ManagementUserPage() {
  const {
    users,
    isLoading,
    isModalOpen,
    selectedUser,
    isSaving,
    handleEditClick,
    handleCloseModal,
    handleSaveRole,
  } = useManagementUser();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header Page */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Management User</h1>
          <p className="text-sm text-gray-500">Kelola role pengguna aplikasi gudang.</p>
        </div>
      </div>

      {/* Main Table */}
      <UserTable 
        users={users} 
        isLoading={isLoading} 
        onEdit={handleEditClick} 
      />

      {/* Popup / Modal */}
      <EditRoleModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={handleCloseModal}
        onSave={handleSaveRole}
        isSaving={isSaving}
      />
    </div>
  );
}