"use client";

import React, { useState } from "react";
import SidebarAdmin from "@/components/sidebar/SidebarAdmin";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = () => {
    // ✅ UPDATE: Hapus token
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const SIDEBAR_WIDTH = isCollapsed ? "80px" : "260px";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <SidebarAdmin
        onSignOut={handleSignOut}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <main
        style={{
          flex: 1,
          marginLeft: SIDEBAR_WIDTH,
          minHeight: "100vh",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: `calc(100% - ${SIDEBAR_WIDTH})`,
        }}
      >
        <div style={{ padding: "32px", maxWidth: "1600px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}