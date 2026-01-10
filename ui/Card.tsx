// ui/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}