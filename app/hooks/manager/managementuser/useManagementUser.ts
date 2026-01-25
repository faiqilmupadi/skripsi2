import { useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/types/managementUser";
import { fetchUsers, updateUserRole } from "@/services/managementUserService";
import { toast } from "react-toastify";

export const useManagementUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load Data
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle Edit Click
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle Save Role
  const handleSaveRole = async (newRole: UserRole) => {
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      await updateUserRole({ id: selectedUser.id, role: newRole });
      toast.success("Role berhasil diperbarui!");
      handleCloseModal();
      loadUsers(); // Refresh table
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    users,
    isLoading,
    isModalOpen,
    selectedUser,
    isSaving,
    handleEditClick,
    handleCloseModal,
    handleSaveRole,
  };
};