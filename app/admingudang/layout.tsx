"use client";

import React, { useState } from "react";
import SidebarManager from "@/components/sidebar/SidebarAdmin";
import { useRouter } from "next/navigation";

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = () => {
    console.log("Manager signed out");
    router.push("/login");
  };

  const SIDEBAR_WIDTH = isCollapsed ? "80px" : "280px";

  return (
    <div style={styles.container}>
      <SidebarManager
        onSignOut={handleSignOut}
        defaultCollapsed={isCollapsed}
      />

      <main
        style={{
          ...styles.mainContent,
          marginLeft: SIDEBAR_WIDTH,
        }}
      >
        <div style={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  mainContent: {
    flex: 1,
    minHeight: "100vh",
    transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  contentWrapper: {
    padding: "24px",
    maxWidth: "100%",
  },
};
