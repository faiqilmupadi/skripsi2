"use client";

import React from "react";
import { StockSummary } from "@/types/realtime";
import { Card } from "@/components/ui/Card";
import { FaBox, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface StockSummaryCardsProps {
  data: StockSummary;
}

export function StockSummaryCards({ data }: StockSummaryCardsProps) {
  const cards = [
    { 
      label: "Total Item", 
      value: data.totalStok, 
      icon: <FaBox className="text-blue-500" />, 
      bg: "bg-blue-50" 
    },
    { 
      label: "Stok Aman", 
      value: data.stokAman, 
      icon: <FaCheckCircle className="text-green-500" />, 
      bg: "bg-green-50" 
    },
    { 
      label: "Perlu Perhatian", 
      value: data.stokMenipis, 
      icon: <FaExclamationTriangle className="text-yellow-500" />, 
      bg: "bg-yellow-50" 
    },
    { 
      label: "Kritis / Kosong", 
      value: data.stokKritis, 
      icon: <FaTimesCircle className="text-red-500" />, 
      bg: "bg-red-50" 
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((item, idx) => (
        <Card key={idx} className="flex items-center p-4 border-none shadow-sm">
          <div className={`p-3 rounded-full mr-4 ${item.bg} text-xl`}>
            {item.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{item.label}</p>
            <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}