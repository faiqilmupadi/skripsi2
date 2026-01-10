// app/fsn/components/FSNSummaryCards.tsx
"use client";

import React from "react";
import { FSNSummary } from "@/types/fsn";

interface FSNSummaryCardsProps {
  data: FSNSummary;
}

export function FSNSummaryCards({ data }: FSNSummaryCardsProps) {
  const cards = [
    { label: "Barang Fast Moving", value: data.fastMoving },
    { label: "Barang Slow Moving", value: data.slowMoving },
    { label: "Barang Non Moving", value: data.nonMoving },
    { label: "Total Barang", value: data.totalItems },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "14px",
      }}
    >
      {cards.map(({ label, value }) => (
        <div
          key={label}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "#777" }}>{label}</span>
          <span style={{ fontSize: 32, fontWeight: 700 }}>{value}</span>
        </div>
      ))}
    </div>
  );
}