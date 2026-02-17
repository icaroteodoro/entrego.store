import React from "react";
import { Button } from "./ui/button";
import AlertDot from "./alert-dot";
import { useOrders } from "@/hooks/use-order";

import { cn } from "@/lib/utils";

export interface iCardOrder extends React.HTMLAttributes<HTMLDivElement> {
  numberOrder: string;
  clientName: string;
  deliveryTime: string;
  status: "MADE" | "ACCEPTED" | "CANCELED" | "SENT" | "FINISHED";
  updateStatusOrder?: () => void;
  cancelOrder?: () => void;
  isSelected?: boolean;
}

export default function CardOrder(order: iCardOrder) {
  const { updateStatusOrder } = useOrders(true);
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-4 mb-3 hover:cursor-pointer border-2 transition-all",
        order.isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-zinc-100 hover:border-zinc-300 shadow-sm"
      )}
      onClick={order.onClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <h2 className={`text-xl font-semibold ${order.status === 'FINISHED' ? 'text-green-800' : 'text-primary'}`}>
            {order.numberOrder}
          </h2>
          <h3 className="text-lg font-normal">{order.clientName}</h3>
        </div>
        {
          order.status === 'MADE' ? <AlertDot className="mb-2" /> : ''
        }

      </div>
      <div className="my-3">
        <h4 className="text-base">Pedido feito às {order.deliveryTime}</h4>
      </div>
      <div className="flex justify-between">
        {order.status === "FINISHED" || order.status === 'SENT' || order.status === 'CANCELED' ? (
          <></>
        ) : (
          <Button
            onClick={order.updateStatusOrder}
            className={`${order.status === "MADE" ? "w-[48%]" : "w-full"
              } bg-green-600 hover:bg-green-700 hover:cursor-pointer`}
          >
            {order.status === "MADE"
              ? "Aceitar pedido"
              : order.status === "ACCEPTED"
                ? "Enviar pedido"
                : "Finalizar pedido"}
          </Button>
        )}
        {order.status === "MADE" ? (
          <Button onClick={order.cancelOrder} className="w-[48%] bg-red-600 hover:bg-red-700 hover:cursor-pointer">
            Rejeitar pedido
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
