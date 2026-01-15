"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { ItemWithStatus } from "@/types/realtime";

interface DetailedStockTableProps {
  title: string;
  subtitle?: string;
  items: ItemWithStatus[];
  type: "critical" | "warning" | "aman"; // TAMBAHKAN 'aman' DI SINI
}

export function DetailedStockTable({ title, subtitle, items, type }: DetailedStockTableProps) {
  // Styling Logic
  let accentColor = "";
  let softBg = "";
  let textColor = "";
  let barColor = "";

  if (type === "critical") {
    accentColor = "bg-rose-500";
    softBg = "bg-rose-50";
    textColor = "text-rose-700";
    barColor = "bg-rose-500";
  } else if (type === "warning") {
    accentColor = "bg-amber-400";
    softBg = "bg-amber-50";
    textColor = "text-amber-700";
    barColor = "bg-amber-400";
  } else {
    // LOGIKA WARNA UNTUK AMAN (HIJAU)
    accentColor = "bg-emerald-500";
    softBg = "bg-emerald-50";
    textColor = "text-emerald-700";
    barColor = "bg-emerald-500";
  }

  return (
    <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white flex flex-col h-full">
      <div className={`px-6 py-5 border-b border-gray-100 flex justify-between items-start ${softBg}`}>
        <div>
            <h3 className={`font-bold text-lg ${textColor} flex items-center gap-2`}>
                {/* Animasi Ping hanya untuk Critical */}
                {type === "critical" && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
                {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <span className={`text-sm font-bold px-3 py-1 bg-white rounded-lg shadow-sm ${textColor}`}>
          {items.length} Item
        </span>
      </div>
      
      <div className="overflow-auto flex-1 max-h-[400px]"> {/* Tambah max-h agar bisa scroll jika panjang */}
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-white border-b sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 font-semibold">Nama Barang</th>
              <th className="px-6 py-3 font-semibold w-1/3">Ketersediaan</th>
              <th className="px-6 py-3 font-semibold text-right">Sisa Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length > 0 ? (
              items.map((item) => {
                // Kalkulasi visual bar
                // Jika Aman, biasanya stok jauh diatas ROP, jadi kita batasi max 100% biar bar ga tembus layar
                const percentage = Math.min((item.stok_saat_ini / (item.rop * 2)) * 100, 100);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{item.nama_barang}</div>
                      <div className="text-xs text-gray-400">Min: {item.rop} {item.satuan}</div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                            <div 
                                className={`h-2.5 rounded-full ${barColor}`} 
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`text-lg font-bold ${textColor}`}>
                         {item.stok_saat_ini}
                       </span>
                       <span className="text-xs text-gray-400 ml-1">{item.satuan}</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                   <p className="text-gray-400 italic">Tidak ada data untuk kategori ini.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}