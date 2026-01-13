"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { ItemWithStatus } from "@/types/realtime";

interface DetailedStockTableProps {
  title: string;
  items: ItemWithStatus[];
  type: "critical" | "warning";
}

export function DetailedStockTable({ title, items, type }: DetailedStockTableProps) {
  const headerColor = type === "critical" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700";
  const badgeColor = type === "critical" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";

  return (
    <Card className="p-0 border-none shadow-sm overflow-hidden h-full">
      <div className={`px-6 py-4 border-b border-gray-100 flex justify-between items-center ${headerColor}`}>
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="text-xs font-semibold px-2 py-1 bg-white bg-opacity-50 rounded-lg">
          {items.length} Item
        </span>
      </div>
      
      <div className="overflow-auto max-h-[300px]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3">Nama Barang</th>
              <th className="px-6 py-3">Sisa Stok</th>
              <th className="px-6 py-3">Batas Aman (ROP)</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.nama_barang}
                  </td>
                  <td className="px-6 py-4 font-bold">
                    {item.stok_saat_ini} {item.satuan}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    &lt; {item.rop}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${badgeColor}`}>
                      {type === "critical" ? "Kritis" : "Menipis"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">
                  Tidak ada barang dalam kondisi ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}