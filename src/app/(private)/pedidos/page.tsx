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
  XIcon,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { DateRange } from "react-day-picker";
import { addDays, format, isAfter, isBefore, isEqual, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
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
  DINHEIRO: "Dinheiro",
};

const statusMap = {
  MADE: { label: "Novo", color: "bg-blue-100 text-blue-700 border-blue-200" },
  ACCEPTED: {
    label: "Aceito",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  SENT: {
    label: "Enviado",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  FINISHED: {
    label: "Finalizado",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  CANCELED: {
    label: "Cancelado",
    color: "bg-red-100 text-red-700 border-red-200",
  },
};


const groupOrdersByDay = (pedidos: iOrder[]): Record<string, iOrder[]> => {
  const grouped = pedidos.reduce((acc: Record<string, iOrder[]>, pedido) => {
    const data = format(new Date(pedido.deliveryTime), "yyyy-MM-dd");
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
      return dayB.localeCompare(dayA);
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
    <section className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] bg-zinc-50/30 py-8">
      <div className="container w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Todos os pedidos</h2>
        <Card className="w-full flex flex-col lg:flex-row rounded-xl shadow-sm border overflow-hidden bg-white h-[calc(100vh-12rem)] min-h-[600px]">
          {/* SIDEBAR LIST */}
          <div className="w-full lg:w-1/3 h-full border-r bg-zinc-50/50 flex flex-col">
            <div className="p-4 border-b bg-white">
              <div className="flex justify-between gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "dd/MM/yyyy")} -{" "}
                            {format(date.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(date.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Filtrar por data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                {date?.from && (
                  <Button onClick={() => resetDateFilter()} variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive">
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-3">
                {Object.entries(ordersPerDay).length > 0 ? (
                  Object.entries(ordersPerDay).map(([data, ordersOfDay]) => (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      defaultValue={data}
                      key={data}
                    >
                      <AccordionItem
                        value={data}
                        className="border-none mb-2"
                      >
                        <AccordionTrigger className="hover:no-underline py-2 px-3 bg-white border rounded-lg mb-2 shadow-sm data-[state=open]:rounded-b-none data-[state=open]:mb-0 data-[state=open]:border-b-0">
                          <span className="font-medium text-sm text-zinc-700">
                            {format(parseISO(data), "d 'de' MMMM 'de' yyyy", { locale: ptBR }).replace(
                              /de (\w)/,
                              (match, p1) => `de ${p1.charAt(0).toUpperCase() + p1.slice(1)}`
                            )}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="p-0 bg-zinc-50/50 border-x border-b rounded-b-lg">
                          <div className="p-2 space-y-2">
                            {ordersOfDay.map((order) => (
                              <div key={order.numberOrder} onClick={() => setOrderView(order)}>
                                <CardOrderDefault
                                  numberOrder={"#" + order.numberOrder}
                                  clientName={order.clientName}
                                  deliveryTime={getDeliveryTime(order.deliveryTime)}
                                  isSelected={orderView?.numberOrder === order.numberOrder}
                                />
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <div className="bg-zinc-100 p-4 rounded-full mb-3">
                      <FileText className="h-8 w-8 text-zinc-300" />
                    </div>
                    <p className="font-medium">Nenhum pedido encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros de data.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* DETAIL VIEW */}
          {isLoading ? (
            <div className="w-full lg:w-2/3 flex justify-center items-center bg-zinc-50/30">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-sm animate-pulse">Carregando pedidos...</p>
              </div>
            </div>
          ) : orderView ? (
            <div className="w-full lg:w-2/3 relative flex flex-col h-full bg-white">
              {/* HEADER */}
              <div className="h-16 w-full border-b flex items-center justify-between px-6 bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pedido</p>
                    <h2 className="text-xl font-bold text-zinc-900">
                      #{orderView.numberOrder}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold border",
                      statusMap[orderView.status as keyof typeof statusMap]?.color ||
                      "bg-zinc-100 text-zinc-700 border-zinc-200"
                    )}
                  >
                    {statusMap[orderView.status as keyof typeof statusMap]?.label ||
                      orderView.status}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                {/* INFO COLUMN */}
                <ScrollArea className="w-full lg:w-1/2 h-full border-b lg:border-b-0 lg:border-r bg-zinc-50/30">
                  <div className="p-6 space-y-6">

                    {/* CLIENT INFO */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4" /> Cliente
                      </h3>
                      <div className="bg-white p-4 rounded-xl border shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-800">{orderView.clientName}</p>
                            <p className="text-xs text-zinc-500">Cliente frequente</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ADDRESS INFO */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Endereço de Entrega
                      </h3>
                      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPinned className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-zinc-800">
                              {orderView.address.street}, {orderView.address.number}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {orderView.address.neighborhood}, {orderView.address.city}
                            </p>
                            {orderView.address.complement && (
                              <p className="text-xs text-zinc-400 mt-1 bg-zinc-50 p-2 rounded border inline-block">
                                Obs: {orderView.address.complement}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PAYMENT INFO */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Pagamento
                      </h3>
                      <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">
                        <div className="bg-green-50 p-2 rounded-lg text-green-600">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-800">
                            {getPaymentMethodDisplayName(orderView.paymentMethod)}
                          </p>
                          <p className="text-xs text-zinc-500">Pagamento na entrega</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* ITEMS COLUMN */}
                <div className="w-full lg:w-1/2 h-full flex flex-col bg-white">
                  <div className="p-4 border-b bg-white flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                      Itens do Pedido
                    </h3>
                    <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full font-medium">
                      {orderView.items.length} itens
                    </span>
                  </div>
                  <ScrollArea className="flex-1 p-0">
                    <div className="divide-y">
                      {orderView.items.map((item, index) => (
                        <div className="p-4 hover:bg-zinc-50/50 transition-colors flex items-center justify-between group" key={index}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 border flex items-center justify-center font-bold text-sm text-zinc-700 shadow-sm group-hover:bg-white group-hover:border-primary/50 group-hover:text-primary transition-all">
                              {item.quantity}x
                            </div>
                            <span className="font-medium text-zinc-700">{item.name}</span>
                          </div>
                          <span className="font-semibold text-zinc-900">{formatToBRL(item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* TOTAL FOOTER */}
                  <div className="p-6 bg-zinc-50 border-t mt-auto">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Subtotal</span>
                        <span>{formatToBRL(orderView.total)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Taxa de entrega</span>
                        <span>Grátis</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t border-zinc-200">
                      <div>
                        <p className="text-sm text-zinc-500">Total a pagar</p>
                      </div>
                      <span className="text-2xl font-bold text-zinc-900">{formatToBRL(orderView.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full lg:w-2/3 flex flex-col items-center justify-center h-full bg-zinc-50/30 text-center p-8">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <Hash className="w-12 h-12 text-zinc-200" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                Selecione um pedido
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Escolha um pedido da lista ao lado para ver os detalhes completos, endereço e itens.
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}