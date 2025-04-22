import React from "react";
import { Button } from "./ui/button";
import AlertDot from "./alert-dot";
import { useOrders } from "@/hooks/use-order";

export interface iCardOrder extends React.HTMLAttributes<HTMLDivElement> {
  numberOrder: string;
  clientName: string;
  deliveryTime: string;
}

export default function CardOrderDefault(order: iCardOrder) {
  const {updateStatusOrder} = useOrders(true);
  return (
    <div className="bg-white rounded-xl p-4 mb-3 hover:cursor-pointer" onClick={order.onClick}>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <h2 className={`text-xl font-semibold text-primary`}>
            {order.numberOrder}
          </h2>
          <h3 className="text-lg font-normal">{order.clientName}</h3>
        </div>
      </div>
      <div className="mt-3">
        <h4 className="text-base">Pedido feito ás: {order.deliveryTime}</h4>
      </div>
    </div>
  );
}
