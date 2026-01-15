import { ReactNode } from "react";

interface SummaryCardProps {
    title: string;
    value: number | string;
    icon: ReactNode;
    color: string;
}

export default function SummaryCard({ title, value, icon, color }: SummaryCardProps) {
  return (
    <div className={`p-5 rounded-xl border ${color} shadow-sm flex flex-col justify-between h-full print:border-gray-200 print:bg-white print:shadow-none`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-bold uppercase tracking-wider opacity-70">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}