// C:\Faiq\skripsi\skripsi2\services\reportService.ts

import { ReportData, ReportFilterType } from "@/types/laporanBarang";

export async function fetchReportData(filter: ReportFilterType): Promise<ReportData | null> {
  try {
    const res = await fetch(`/api/laporanBarang?filter=${filter}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil data laporan");
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}