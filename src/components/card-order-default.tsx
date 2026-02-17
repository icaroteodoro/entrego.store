import { cn } from "@/lib/utils";
import React from "react";

export interface iCardOrder extends React.HTMLAttributes<HTMLDivElement> {
  numberOrder: string;
  clientName: string;
  deliveryTime: string;
  isSelected?: boolean;
}

export default function CardOrderDefault({
  clientName,
  deliveryTime,
  numberOrder,
  isSelected,
  onClick,
  className
}: iCardOrder) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full bg-white border rounded-xl p-4 mb-2 cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all group relative overflow-hidden",
        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-zinc-200",
        className
      )}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      )}

      <div className="flex justify-between items-start mb-2 pl-2">
        <span className={cn(
          "font-bold text-sm px-2 py-0.5 rounded-md",
          isSelected ? "bg-primary text-white" : "bg-zinc-100 text-zinc-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
        )}>
          {numberOrder}
        </span>
        <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
          {deliveryTime}
        </span>
      </div>

      <div className="flex items-center gap-3 pl-2">
        <div className={cn(
          "w-2 h-2 rounded-full shrink-0",
          isSelected ? "bg-primary" : "bg-zinc-300 group-hover:bg-primary/50"
        )} />
        <h4 className={cn(
          "font-medium text-sm truncate",
          "text-zinc-700"
        )}>
          {clientName}
        </h4>
      </div>
    </div>
  );
}
