// app/components/sidebar/SidebarItems.tsx
import React from "react";
import {
  Clock,
  Home,
  Package,
  Truck,
  BookOpen,
  Users,
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    id: "stokbarang",
    label: "Stok Barang",
    icon: Package,
    href: `${BASE_PATH}/admingudang/stockbarang`,
  },
  {
    id: "pengambilanbarang",
    label: "Pengambilan Barang",
    icon: Truck,
    href: `${BASE_PATH}/admingudang/pengambilanbarang`,
  },
];

export const MANAGER_MENU_ITEMS: MenuItem[] = [
  {
    id: "dashboardrealtime",
    label: "Dashboard Realtime",
    icon: Clock,
    href: `${BASE_PATH}/managergudang/dashboardrealtime`,
  },
  {
    id: "dashboardfsn",
    label: "Dashboard FSN",
    icon: Home,
    href: `${BASE_PATH}/managergudang/dashboardfsn`,
  },
  {
    id: "stokbarang",
    label: "Stok Barang",
    icon: Package,
    href: `${BASE_PATH}/managergudang/stockbarang`,
  },
  {
    id: "pengambilanbarang",
    label: "Pengambilan Barang",
    icon: Truck,
    href: `${BASE_PATH}/managergudang/pengambilanbarang`,
  },
  {
    id: "laporanbarang",
    label: "Laporan Barang",
    icon: BookOpen,
    href: `${BASE_PATH}/managergudang/laporanbarang`,
  },
    {
    id: "ManagementUser",
    label: "Management User",
    icon: Users,
    href: `${BASE_PATH}/managergudang/managementuser`,
  },
];