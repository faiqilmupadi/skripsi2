// app/components/sidebar/SidebarManager.tsx
"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import SidebarButton from "./SidebarButton";
import { MANAGER_MENU_ITEMS, MenuItem } from "./SidebarItems";

interface SidebarManagerProps {
  onSignOut?: () => void;
  defaultCollapsed?: boolean;
}

export default function SidebarManager({
  onSignOut,
  defaultCollapsed = false,
}: SidebarManagerProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const SIDEBAR_WIDTH = isCollapsed ? "80px" : "280px";

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <aside
      style={{
        ...styles.sidebar,
        width: SIDEBAR_WIDTH,
        padding: isCollapsed ? "24px 12px" : "24px 16px",
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          {isCollapsed ? "WG" : "Warehouse Gudang"}
        </div>
      </div>

      {/* Role Badge - Tanpa gelembung */}
      {!isCollapsed && (
        <div style={styles.roleBadge}>
          <span>Manager Panel</span>
        </div>
      )}

      {/* Navigation - Scroll dihilangkan */}
      <nav style={styles.nav}>
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

      {/* Footer - Toggle button di bawah */}
      <div style={styles.footer}>
        <button
          onClick={handleSignOut}
          style={{
            ...styles.signOutButton,
            justifyContent: isCollapsed ? "center" : "flex-start",
            padding: isCollapsed ? "14px 12px" : "14px 16px",
          }}
          title={isCollapsed ? "Sign out" : ""}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>

        {/* Toggle Button - Pindah ke bawah */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={styles.toggleButton}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    backgroundColor: "#1e5fdc",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    left: 0,
    top: 0,
    borderRadius: "0 24px 24px 0",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
  header: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 0",
  },
  logo: {
    color: "white",
    fontWeight: 700,
    fontSize: "18px",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  roleBadge: {
    color: "white",
    padding: "10px 12px",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "20px",
    textAlign: "center",
  },
  nav: {
    marginTop: "10px",
    flex: 1,
    overflowY: "hidden", // Hilangkan scroll
    overflowX: "hidden",
  },
  footer: {
    marginTop: "auto",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  signOutButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 500,
    transition: "all 0.3s ease",
  },
  toggleButton: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    width: "100%",
  },
};