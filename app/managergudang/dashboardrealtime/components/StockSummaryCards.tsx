"use client";
import React from "react";
import { StockSummary } from "@/types/realtime";
import { Card } from "@/components/ui/Card";

export function StockSummaryCards({ data }: { data: StockSummary }) {
  // Desain Simple Metrics
  const items = [
    { label: "Total SKU", val: data.totalStok, color: "text-gray-800", sub: "Item terdaftar" },
    { label: "Siap Distribusi", val: data.stokAman, color: "text-emerald-600", sub: "Stok Aman" },
    { label: "Perlu Perhatian", val: data.stokMenipis, color: "text-amber-600", sub: "> Safety Stock" },
    { label: "Kritis", val: data.stokKritis, color: "text-rose-600", sub: "< Safety Stock" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <Card key={i} className="p-4 bg-white border border-gray-100 shadow-none rounded-lg flex flex-col justify-center">
            <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">{item.label}</span>
            <div className={`text-2xl font-bold mt-1 mb-1 ${item.color}`}>{item.val}</div>
            <span className="text-[10px] text-gray-400">{item.sub}</span>
        </Card>
      ))}
    </div>
  );
}