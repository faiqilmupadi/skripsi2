"use client";

import { useState, useEffect } from "react";
import {
  Item,
  ItemComplete,
  TimeFilter,
  Notification,
  StockMovement,
} from "@/types/stock";
import { getStockStatus, getStatusColor, generateNotifications } from "@/services/stockAdminService";
import {
  enrichItemsWithFSN,
  getDaysFromFilter,
} from "@/services/fsnService";
import { fetchStockMovements } from "@/lib/fsn"; 
import { 
  fetchStockItems, 
  createStockItem, 
  updateStockItem, 
  deleteStockItem,
  fetchNotifiedItemIds, 
  saveNotificationDB    
} from "@/lib/stockAdmin";

import StockTable from "./components/StockTable";
import NotificationCards from "./components/NotificationCards";
import { AddModal, EditModal } from "./components/StockModals"; 

export default function StokBarangPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  const [stockItems, setStockItems] = useState<Item[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [enrichedItems, setEnrichedItems] = useState<ItemComplete[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const [notifiedIds, setNotifiedIds] = useState<number[]>([]);
  const [tempReadIds, setTempReadIds] = useState<string[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ItemComplete | null>(null);

  const [addForm, setAddForm] = useState({ nama_barang: "", stok_saat_ini: "", rop: "", safety_stock: "", satuan: "" });
  const [editForm, setEditForm] = useState({ nama_barang: "", stok_saat_ini: "", rop: "", safety_stock: "", satuan: "" });

  async function loadData() {
    setLoading(true);
    try {
      const [itemsData, movementsData, dbNotificationData] = await Promise.all([
        fetchStockItems(),
        fetchStockMovements(),
        fetchNotifiedItemIds()
      ]);

      setStockItems(itemsData);
      const outMovements = movementsData.filter((m: any) => m.tipe === "OUT");
      setStockMovements(outMovements);
      setNotifiedIds(dbNotificationData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (stockItems.length === 0) return;

    const days = getDaysFromFilter(timeFilter);
    const fsnItems = enrichItemsWithFSN(stockItems, stockMovements, days);

    const completeItems: ItemComplete[] = fsnItems.map((item: any) => {
      const status = getStockStatus(item);
      const statusColor = getStatusColor(status);
      return { ...item, status, statusColor };
    });

    setEnrichedItems(completeItems);

    const allNotifications = generateNotifications(completeItems);
    
    const activeNotifications = allNotifications.filter(
      (n) => !notifiedIds.includes(n.itemId) && !tempReadIds.includes(n.id)
    );
    
    setNotifications(activeNotifications);

  }, [stockItems, stockMovements, timeFilter, notifiedIds, tempReadIds]);

  const handleMarkAsRead = (id: string) => {
    setTempReadIds((prev) => [...prev, id]); 
  };

  const handleMarkAsOrdered = async (notificationId: string, itemId: number, itemName: string) => {
    try {
      setNotifiedIds((prev) => [...prev, itemId]);
      await saveNotificationDB(itemId, itemName);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSubmit = async () => {
    try {
      const payload = {
        nama_barang: addForm.nama_barang,
        stok_saat_ini: parseInt(addForm.stok_saat_ini),
        rop: parseInt(addForm.rop),
        safety_stock: parseInt(addForm.safety_stock),
        satuan: addForm.satuan,
      };

      await createStockItem(payload);
      await loadData();
      setShowAddModal(false);
      setAddForm({ nama_barang: "", stok_saat_ini: "", rop: "", safety_stock: "", satuan: "" });
      alert("Barang berhasil ditambahkan!");
    } catch (error) {
      alert("Gagal menyimpan data.");
    }
  };

  const handleEditClick = (item: ItemComplete) => {
    setSelectedItem(item);
    setEditForm({
      nama_barang: item.nama_barang,
      stok_saat_ini: item.stok_saat_ini.toString(),
      rop: item.rop.toString(),
      safety_stock: item.safety_stock.toString(),
      satuan: item.satuan,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedItem) return;

    try {
      const payload = {
        nama_barang: editForm.nama_barang,
        stok_saat_ini: parseInt(editForm.stok_saat_ini),
        rop: parseInt(editForm.rop),
        safety_stock: parseInt(editForm.safety_stock),
        satuan: editForm.satuan,
      };

      await updateStockItem(selectedItem.id, payload);
      await loadData();
      setShowEditModal(false);
      setSelectedItem(null);
      alert("Data berhasil diperbarui!");
    } catch (error) {
      alert("Gagal update data.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      try {
        await deleteStockItem(id);
        await loadData();
        alert("Barang dihapus.");
      } catch (error) {
        alert("Gagal menghapus.");
      }
    }
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-lg font-semibold text-gray-500">Memuat Data Stok...</p>
        </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {(["24H", "7D", "1M", "3M", "CUSTOM"] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                timeFilter === filter
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Tambah Data
        </button>
      </div>

      <StockTable
        items={enrichedItems}
        onEdit={handleEditClick}
        onDelete={(item: any) => handleDelete(item.id)}
      />

      <NotificationCards
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAsOrdered={(id) => {
            const notif = notifications.find(n => n.id === id);
            if (notif) {
                handleMarkAsOrdered(id, notif.itemId, notif.itemName);
            }
        }}
      />

      <AddModal
        show={showAddModal}
        form={addForm}
        onChange={(field, value) => setAddForm({ ...addForm, [field]: value })}
        onSubmit={handleAddSubmit}
        onClose={() => setShowAddModal(false)}
      />

      <EditModal
        show={showEditModal}
        form={editForm}
        onChange={(field, value) => setEditForm({ ...editForm, [field]: value })}
        onSubmit={handleEditSubmit}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}