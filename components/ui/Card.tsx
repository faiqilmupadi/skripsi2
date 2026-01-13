import React from "react";

// Kita "extend" HTMLAttributes agar Card bisa terima className, onClick, style, dll.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div 
      // Gabungkan style default dengan className yang dikirim dari luar
      className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className || ""}`} 
      {...props}
    >
      {children}
    </div>
  );
};