// app/dashboard/components/StockSummaryCards.tsx
"use client";

import React from "react";
import { StockSummary } from "@/types/realtime";

interface StockSummaryCardsProps {
  data: StockSummary;
}

export function StockSummaryCards({ data }: StockSummaryCardsProps) {
  const cards = [
    { label: "Stok Aman", value: data.stokAman },
    { label: "Stok Menipis", value: data.stokMenipis },
    { label: "Stok Kritis", value: data.stokKritis },
    { label: "Total Stok", value: data.totalStok },
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