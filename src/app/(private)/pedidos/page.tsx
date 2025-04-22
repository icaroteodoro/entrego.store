"use client";
import CardOrderDefault from "@/components/card-order-default";
import { AccordionContent } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { iOrder, useOrders } from "@/hooks/use-order";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Building2,
  CalendarIcon,
  CreditCard,
  FileText,
  Hash,
  HomeIcon,
  MapPin,
  MapPinned,
  User,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { DateRange } from "react-day-picker";
import { addDays, format, isAfter, isBefore, isEqual, startOfDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const paymentMethodMap = {
  CREDITO: "Crédito",
  DEBITO: "Débito",
  PIX: "Pix",
};

const groupOrdersByDay = (pedidos: iOrder[]): Record<string, iOrder[]> => {
  const grouped = pedidos.reduce((acc: Record<string, iOrder[]>, pedido) => {
    const data = new Date(pedido.deliveryTime).toLocaleDateString("pt-BR");
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(pedido);
    return acc;
  }, {});

  const sorted = Object.entries(grouped)
    .sort((a, b) => {
      const [dayA] = a;
      const [dayB] = b;

      const dateA = new Date(dayA.split("/").reverse().join("-"));
      const dateB = new Date(dayB.split("/").reverse().join("-"));

      return dateB.getTime() - dateA.getTime();
    });

  return Object.fromEntries(sorted);
};

export default function Pedidos() {
  const { isLoading, orders, orderView, setOrderView } = useOrders(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const resetDateFilter = () => {
    setDate({
      from: undefined,
      to: undefined,
    });
  }

  // Filter orders based on date range
  const filteredOrders = useMemo(() => {
    if (!date?.from) {
      return orders;
    }

    return orders.filter((order) => {
      const orderDate = startOfDay(new Date(order.deliveryTime));
      const fromDate = date.from ? startOfDay(date.from) : null;
      const toDate = date.to ? startOfDay(date.to) : fromDate;
      
      if (fromDate && toDate) {
        return (
          (isAfter(orderDate, fromDate) || isEqual(orderDate, fromDate)) && 
          (isBefore(orderDate, toDate) || isEqual(orderDate, toDate))
        );
      }
      return false;
    });
  }, [orders, date]);

  function getDeliveryTime(date: any): string {
    const dateTime = new Date(date);

    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  }
  const { setPageTitle } = useSidebar();
  useEffect(() => {
    setPageTitle("Pedidos");
  }, []);

  // Use filteredOrders instead of orders for grouping
  const ordersPerDay = groupOrdersByDay(filteredOrders);

  const getPaymentMethodDisplayName = (paymentMethodCode: string) => {
    return (
      paymentMethodMap[paymentMethodCode as keyof typeof paymentMethodMap] ||
      paymentMethodCode
    );
  };

  function formatToBRL(value?: number): string {
    if (typeof value !== "number" || isNaN(value)) {
      return "R$ 0,00";
    }

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <section className="flex items-center justify-center">
      <div className="container">
        <h2 className="text-3xl font-semibold mb-5">Todos os pedidos</h2>
        <Card className="w-full flex flex-row rounded-sm py-0 gap-0 h-[80vh]">
          <ScrollArea className="w-2/6 h-full px-3 py-4 border-r">
          <div className="flex justify-between mb-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[73%] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button onClick={() => resetDateFilter()} className="w-[25%] hover:cursor-pointer">Zerar</Button>

          </div>
            {Object.entries(ordersPerDay).length > 0 ? (
              Object.entries(ordersPerDay).map(([data, ordersOfDay]) => (
                <Accordion
                  type="single"
                  className="w-full py-2 gap-0"
                  defaultValue={data}
                  key={data}
                >
                  <AccordionItem
                    value={data}
                    data-state="open"
                    className="bg-zinc-100 rounded-2xl px-3 py-2 border-none mb-1"
                  >
                    <AccordionTrigger>{data}</AccordionTrigger>
                    <AccordionContent>
                      {ordersOfDay.map((order) => (
                        <CardOrderDefault
                          onClick={() => setOrderView(order)}
                          numberOrder={"#" + order.numberOrder}
                          clientName={order.clientName}
                          deliveryTime={getDeliveryTime(order.deliveryTime)}
                          key={order.numberOrder}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nenhum pedido encontrado para este período
              </div>
            )}
          </ScrollArea>
          {isLoading ? (
            <div className="w-full flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : orderView ? (
            <div className="w-4/6 relative">
              {/* HEADER */}
              <div className="absolute bg-white top-0 left-0 h-16 w-full border-b flex items-center justify-between px-4 gap-5">
                <h2 className="text-xl font-semibold">
                  Número do pedido:{" "}
                  <span className="text-primary">#{orderView.numberOrder}</span>
                </h2>
              </div>
              {/* HEADER */}
              <div className="flex pt-16 w-full h-full">
                <ScrollArea className="w-2/4 h-full border-l border-r p-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-zinc-500">Nome do Cliente</p>
                        <p className="font-medium">{orderView.clientName}</p>
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-3 rounded-lg space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <MapPin className="w-5 h-5" />
                        <p className="font-medium">Endereço de Entrega</p>
                      </div>

                      <div className="space-y-3 pl-7">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500">Cidade</p>
                            <p className="font-medium">
                              {orderView.address.city}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPinned className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500">Bairro</p>
                            <p className="font-medium">
                              {orderView.address.neighborhood}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <HomeIcon className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500">Logradouro</p>
                            <p className="font-medium">
                              {orderView.address.street}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500">Número</p>
                            <p className="font-medium">
                              {orderView.address.number}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500">Complemento</p>
                            <p className="font-medium">
                              {orderView.address.complement || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-lg">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-zinc-500">
                          Forma de pagamento
                        </p>
                        <p className="font-medium">
                          {getPaymentMethodDisplayName(orderView.paymentMethod)}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                {/* LISTA DE ITENS */}
                <ScrollArea className="w-2/4 h-full border-l border-r">
                  {orderView.items.map((item, index) => (
                    <div
                      className="w-full py-3 border-b flex items-center justify-between px-2"
                      key={index}
                    >
                      <div className="flex items-center gap-2">
                        <Card className="p-2 w-9 h-9 rounded-sm flex items-center justify-center">
                          {item.quantity}
                        </Card>
                        {item.name}
                      </div>
                      <div>{formatToBRL(item.price)}</div>
                    </div>
                  ))}
                </ScrollArea>
                {/* LISTA DE ITENS */}
              </div>
              {/* FOOTER */}
              <div className="absolute bg-white bottom-0 left-0 h-16 w-full border-t flex items-center justify-end px-4">
                <div>
                  <h2 className="font-semibold">
                    Total: {formatToBRL(orderView.total)}
                  </h2>
                </div>
              </div>
              {/* FOOTER */}
            </div>
          ) : filteredOrders.length === 0 && isLoading === false ? (
            <div className="flex justify-center items-center w-full flex-col">
              <h2 className="text-2xl font-bold text-primary">
                Sentimos muito,
              </h2>
              <h2>mas não há pedidos para o período selecionado</h2>
            </div>
          ) : (
            <></>
          )}
        </Card>
      </div>
    </section>
  );
}