"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { FSNSummary } from "@/types/fsn";

export function FSNSummaryCards({ data }: { data: FSNSummary }) {
  // Definisi kartu dengan warna border dan teks yang elegan
  const summaryItems = [
    {
      title: "Fast Moving",
      value: data.fast,
      desc: "Perputaran tinggi",
      borderClass: "border-emerald-500",
      textClass: "text-emerald-700",
    },
    {
      title: "Slow Moving",
      value: data.slow,
      desc: "Perputaran rendah",
      borderClass: "border-amber-500",
      textClass: "text-amber-700",
    },
    {
      title: "Non Moving",
      value: data.non,
      desc: "Tidak ada pergerakan",
      borderClass: "border-rose-500",
      textClass: "text-rose-700",
    },
    {
      title: "Total SKU",
      value: data.totalItems,
      desc: "Item terdaftar",
      borderClass: "border-indigo-500",
      textClass: "text-indigo-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryItems.map((item, index) => (
        <Card
          key={index}
          // Desain: Border tebal di kiri sebagai aksen warna pengganti ikon
          className={`p-6 border-l-[6px] ${item.borderClass} shadow-sm hover:shadow-md transition-shadow bg-white`}
        >
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {item.title}
            </p>
            <div className="mt-2 flex items-baseline">
              <h3 className={`text-4xl font-bold leading-none ${item.textClass}`}>
                {item.value}
              </h3>
              {/* <span className="ml-2 text-sm text-gray-500">Item</span> */}
            </div>
            <p className="mt-3 text-xs font-medium text-gray-400">
              {item.desc}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}