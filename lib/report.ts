// lib/report.ts
import { WeeklyReportData } from "@/types/report";

export async function fetchWeeklyReport(): Promise<WeeklyReportData | null> {
  try {
    const res = await fetch("/api/reports/weekly", { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil laporan");
    return await res.json();
  } catch (error) {
    console.error("Fetch Report Error:", error);
    return null;
  }
}