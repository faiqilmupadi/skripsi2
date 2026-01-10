// components/TimeFilterButtons.tsx
"use client";

import React from "react";
import { TimeFilter } from "@/types/realtime";

interface TimeFilterButtonsProps {
  filters: TimeFilter[];
  activeFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}

export function TimeFilterButtons({
  filters,
  activeFilter,
  onFilterChange,
}: TimeFilterButtonsProps) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          style={{
            padding: "6px 18px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: activeFilter === filter ? "#2563eb" : "white",
            color: activeFilter === filter ? "white" : "#555",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}