"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut, UserCircle } from "lucide-react";
import SidebarButton from "./SidebarButton";
import { MANAGER_MENU_ITEMS, MenuItem } from "./SidebarItems";
import { jwtDecode } from "jwt-decode"; // ✅ IMPORT INI

interface SidebarManagerProps {
  onSignOut?: () => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function SidebarManager({
  onSignOut,
  isCollapsed,
  toggleSidebar,
}: SidebarManagerProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Manager");

  const SIDEBAR_WIDTH = isCollapsed ? "80px" : "260px";

  useEffect(() => {
    // ✅ UPDATE: Ambil dari Token JWT
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Pastikan properti 'name' sesuai dengan payload di route.ts login
        if (decoded.name) setUserName(decoded.name);
      } catch (error) {
        console.error("Gagal decode token sidebar", error);
      }
    }
  }, []);

  return (
    <aside
      style={{
        width: SIDEBAR_WIDTH,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 50,
        padding: "16px",
        boxShadow: "2px 0 10px rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "32px",
          paddingLeft: isCollapsed ? "4px" : "8px",
          justifyContent: isCollapsed ? "center" : "flex-start",
          height: "40px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#2563eb",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "white", fontWeight: 700, fontSize: "18px" }}>W</span>
        </div>
        {!isCollapsed && (
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>
            Warehouse
          </span>
        )}
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        {!isCollapsed && (
          <div style={{ padding: "0 8px 8px 8px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Menu Manager
          </div>
        )}
        {MANAGER_MENU_ITEMS.map((item: MenuItem) => (
          <SidebarButton
            key={item.id}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "16px", marginTop: "16px" }}>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px",
            backgroundColor: isCollapsed ? "transparent" : "#f8fafc",
            borderRadius: "12px",
            marginBottom: "12px",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <div style={{ 
            width: "32px", height: "32px", 
            borderRadius: "50%", backgroundColor: "#dcfce7", 
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#16a34a", flexShrink: 0 
          }}>
            <UserCircle size={18} />
          </div>
          {!isCollapsed && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{userName}</span>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Head of Warehouse</span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "8px",
            marginBottom: "8px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "white",
            color: "#6b7280",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <button
          onClick={onSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#fef2f2",
            color: "#ef4444",
            cursor: "pointer",
            justifyContent: isCollapsed ? "center" : "flex-start",
            transition: "all 0.2s",
            fontSize: "14px",
            fontWeight: 500,
          }}
          title={isCollapsed ? "Sign Out" : ""}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}