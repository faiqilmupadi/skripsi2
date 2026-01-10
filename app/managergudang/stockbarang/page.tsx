"use client";

import { useState, useEffect } from "react";
import {
  Item,
  ItemComplete,
  TimeFilter,
  Notification,
  StockMovement,
} from "@/types/stock";
import { getStockStatus, getStatusColor, generateNotifications } from "@/services/stockService";
import {
  calculateTotalMovement,
  calculateTurnoverRate,
  getFSNCategory,
  getCategoryColor,
  getDaysFromFilter,
} from "@/services/fsnService";
import StockTable from "./components/StockTable";
import NotificationCards from "./components/NotificationCards";
import { AddModal, EditModal, OrderModal } from "./components/StockModals";

export default function StokBarangPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  
  // Mock data stok items
  const [stockItems, setStockItems] = useState<Item[]>([
    {
      id: "1",
      name: "Baut A",
      rop: 100,
      jumlah: 90,
      safetyStock: 50,
      createdAt: "1/13/2025, 2:21:56 PM",
    },
    {
      id: "2",
      name: "Mur B",
      rop: 80,
      jumlah: 70,
      safetyStock: 40,
      createdAt: "1/13/2025, 2:21:56 PM",
    },
    {
      id: "3",
      name: "Ring C",
      rop: 120,
      jumlah: 150,
      safetyStock: 60,
      createdAt: "1/13/2025, 2:21:56 PM",
    },
  ]);

  // Mock data pergerakan stok untuk menghitung FSN
  const [stockMovements] = useState<StockMovement[]>([
    // Baut A - Fast Moving (banyak keluar dalam 7 hari)
    { id: "m1", item_id: "1", tanggal: "2025-01-09", tipe: "OUT", qty: 30 },
    { id: "m2", item_id: "1", tanggal: "2025-01-08", tipe: "OUT", qty: 25 },
    { id: "m3", item_id: "1", tanggal: "2025-01-07", tipe: "OUT", qty: 20 },
    { id: "m4", item_id: "1", tanggal: "2025-01-06", tipe: "OUT", qty: 15 },
    
    // Mur B - Slow Moving (sedikit keluar)
    { id: "m5", item_id: "2", tanggal: "2025-01-09", tipe: "OUT", qty: 5 },
    { id: "m6", item_id: "2", tanggal: "2025-01-05", tipe: "OUT", qty: 3 },
    
    // Ring C - Non Moving (tidak ada yang keluar)
  ]);

  const [enrichedItems, setEnrichedItems] = useState<ItemComplete[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemComplete | null>(null);

  const [orderForm, setOrderForm] = useState({
    supplier: "",
    jumlahOrder: "",
  });

  const [addForm, setAddForm] = useState({
    name: "",
    jumlah: "",
    rop: "",
    safetyStock: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    rop: "",
    safetyStock: "",
    jumlah: "",
  });

  // Enrich items dengan status stok dan FSN category
  useEffect(() => {
    const days = getDaysFromFilter(timeFilter);
    
    const enriched: ItemComplete[] = stockItems.map((item) => {
      // Hitung status stok
      const status = getStockStatus(item);
      const statusColor = getStatusColor(status);

      // Hitung FSN category
      const totalMovement = calculateTotalMovement(item.id, stockMovements, days);
      const turnoverRate = calculateTurnoverRate(totalMovement, days);
      const category = getFSNCategory(totalMovement, days);
      const categoryColor = getCategoryColor(category);

      return {
        ...item,
        status,
        statusColor,
        category,
        categoryColor,
        totalMovement,
        turnoverRate,
      };
    });

    setEnrichedItems(enriched);

    // Generate notifications
    const newNotifications = generateNotifications(enriched);
    setNotifications(newNotifications);
  }, [stockItems, timeFilter, stockMovements]);

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowOrderModal(true);
  };

  const handleOrderSubmit = () => {
    console.log("Order submitted:", orderForm);
    alert(`Pesanan untuk ${selectedNotification?.itemName} telah diproses!`);
    setShowOrderModal(false);
    setOrderForm({ supplier: "", jumlahOrder: "" });
  };

  const handleAddSubmit = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: addForm.name,
      rop: parseInt(addForm.rop),
      jumlah: parseInt(addForm.jumlah),
      safetyStock: parseInt(addForm.safetyStock),
      createdAt: new Date().toLocaleString(),
    };
    setStockItems([...stockItems, newItem]);
    setShowAddModal(false);
    setAddForm({ name: "", jumlah: "", rop: "", safetyStock: "" });
  };

  const handleEditClick = (item: ItemComplete) => {
    setSelectedItem(item);
    setEditForm({
      name: item.name,
      rop: item.rop.toString(),
      safetyStock: item.safetyStock.toString(),
      jumlah: item.jumlah.toString(),
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    if (selectedItem) {
      setStockItems(
        stockItems.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                name: editForm.name,
                rop: parseInt(editForm.rop),
                safetyStock: parseInt(editForm.safetyStock),
                jumlah: parseInt(editForm.jumlah),
              }
            : item
        )
      );
    }
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      setStockItems(stockItems.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
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

      {/* Table */}
      <StockTable
        items={enrichedItems}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {/* Notification Cards */}
      <NotificationCards
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />

      {/* Modals */}
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

      <OrderModal
        show={showOrderModal}
        notification={selectedNotification}
        form={orderForm}
        onChange={(field, value) => setOrderForm({ ...orderForm, [field]: value })}
        onSubmit={handleOrderSubmit}
        onClose={() => setShowOrderModal(false)}
      />
    </div>
  );
}