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

  return (
    <div style={{ position: "relative", width: "100%", marginBottom: "4px" }}>
      <Link
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          cursor: "pointer",
          textDecoration: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          justifyContent: isCollapsed ? "center" : "flex-start",
          backgroundColor: isActive
            ? "#eff6ff" // Blue-50
            : isHovered
            ? "#f9fafb" // Gray-50
            : "transparent",
          color: isActive ? "#2563eb" : isHovered ? "#1f2937" : "#6b7280", // Blue-600 / Gray-800 / Gray-500
          position: "relative",
        }}
      >
        {/* Active Indicator Line (Left) */}
        {isActive && (
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "4px",
              height: "24px",
              backgroundColor: "#2563eb",
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
          />
        )}

        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        
        {!isCollapsed && (
          <span
            style={{
              fontSize: "14px",
              fontWeight: isActive ? 600 : 500,
              whiteSpace: "nowrap",
              opacity: isCollapsed ? 0 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {label}
          </span>
        )}
      </Link>

      {/* Tooltip Hover saat Collapsed */}
      {isCollapsed && isHovered && (
        <div
          style={{
            position: "absolute",
            left: "100%",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "12px",
            padding: "6px 10px",
            backgroundColor: "#1f2937",
            color: "white",
            fontSize: "12px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            zIndex: 50,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            pointerEvents: "none",
          }}
        >
          {label}
          {/* Arrow Tooltip */}
          <div
            style={{
              position: "absolute",
              left: "-4px",
              top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
              width: "8px",
              height: "8px",
              backgroundColor: "#1f2937",
            }}
          />
        </div>
      )}
    </div>
  );
}