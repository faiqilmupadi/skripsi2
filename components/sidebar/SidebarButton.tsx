// app/components/sidebar/SidebarButton.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SidebarButtonProps {
  label: string;
  href: string;
  icon: React.ElementType;
  isActive: boolean;
  isCollapsed: boolean;
}

export default function SidebarButton({
  label,
  href,
  icon: Icon,
  isActive,
  isCollapsed,
}: SidebarButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    marginBottom: "8px",
    padding: isCollapsed ? "14px 12px" : "14px 16px",
    border: "none",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    textAlign: "left",
    position: "relative",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: isActive
      ? "rgba(255,255,255,0.2)"
      : isHovered
      ? "rgba(255,255,255,0.1)"
      : "transparent",
    fontWeight: isActive ? 600 : 400,
    justifyContent: isCollapsed ? "center" : "flex-start",
    transform: isHovered && !isActive ? "translateX(4px)" : "translateX(0)",
    textDecoration: "none",
  };

  const labelStyles: React.CSSProperties = {
    whiteSpace: "nowrap",
    opacity: isCollapsed ? 0 : 1,
    transition: "opacity 0.2s ease",
    overflow: "hidden",
  };

  const activeIndicatorStyles: React.CSSProperties = {
    position: "absolute",
    right: "12px",
    width: "4px",
    height: "20px",
    backgroundColor: "white",
    borderRadius: "2px",
  };

  return (
    <Link
      href={href}
      title={isCollapsed ? label : ""}
      style={buttonStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon size={20} />
      <span style={labelStyles}>{label}</span>
      {isActive && !isCollapsed && <div style={activeIndicatorStyles} />}
    </Link>
  );
}