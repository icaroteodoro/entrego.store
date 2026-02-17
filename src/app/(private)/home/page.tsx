"use client";
import { iItems, useOrders } from "@/hooks/use-order";
import CardOrder from "@/components/card-order";
import { ChartOrders } from "@/components/chart-orders";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  User,
  CreditCard,
  Building2,
  MapPinned,
  Home as HomeIcon,
  Hash,
  FileText,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useCallback, useEffect, useState } from "react";
import websocketService from "@/services/websocket-service";
import { toast } from "sonner";

const paymentMethodMap = {
  CREDITO: "Crédito",
  DEBITO: "Débito",
  PIX: "Pix",
};

export default function Home() {
  const {
    isLoading,
    orders,
    orderView,
    newOrders,
    inPreparationOrders,
    onTheWayOrders,
    deliveredOrders,
    canceledOrders,
    setOrderView,
    refreshOrders,
    updateStatusOrder,
  } = useOrders(true);

  const { setPageTitle } = useSidebar();

  useEffect(() => {
    setPageTitle("Home");
    websocketService.connect();

    websocketService.addOrderListener(receivedOrder);

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio("/sounds/notification-sound.m4a");
      audio.play().catch((error) => {
        if (error.name === "NotAllowedError") {
          toast("Ativar sons de notificação?", {
            action: {
              label: "Ativar",
              onClick: () => {
                const audio = new Audio("/sounds/notification-sound.m4a");
                audio.play();
              },
            },
            duration: Infinity,
          });
        } else {
          console.error("Erro ao reproduzir som de notificação:", error);
        }
      });
    } catch (e) {
      console.error("Erro ao criar elemento de áudio:", e);
    }
  }, []);

  const receivedOrder = async () => {
    await refreshOrders();
    toast("Você tem um novo pedido!");
    playNotificationSound();
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

  function getDay() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("pt-BR");
    return formattedDate;
  }

  // Função para obter o nome amigável da categoria
  const getPaymentMethodDisplayName = (paymentMethodCode: string) => {
    return (
      paymentMethodMap[paymentMethodCode as keyof typeof paymentMethodMap] ||
      paymentMethodCode
    );
  };

  function getDeliveryTime(date: any): string {
    const dateTime = new Date(date);

    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function calculateItemPrice(item: iItems): number {
    return item.price;
  }

  function handleTotalForOrder(items: iItems[]): string {
    if (!items || items.length === 0) {
      return "";
    }

    const total = items.reduce((sum, item) => sum + calculateItemPrice(item) * item.quantity, 0);
    return formatToBRL(total);
  }

  function handleTotalForDay(): string {
    const total = orders.reduce((orderTotal, order) => {
      const orderSum = order.items.reduce(
        (itemTotal, item) => itemTotal + calculateItemPrice(item) * item.quantity,
        0
      );
      return orderTotal + orderSum;
    }, 0);

    return formatToBRL(total);
  }

  // Calculate chart data from orders
  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    return last7Days.map((date) => {
      const dayName = date.toLocaleDateString("pt-BR", { weekday: "long" });
      const dateStr = date.toLocaleDateString("pt-BR");

      const count = orders.filter((order) => {
        const orderDate = new Date(order.deliveryTime); // Assuming deliveryTime is the order date/time
        return orderDate.toLocaleDateString("pt-BR") === dateStr;
      }).length;

      return {
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        orders: count,
      };
    });
  };

  const realChartData = getChartData();
  const totalOrdersWeek = realChartData.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <section className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] bg-zinc-50/30 py-8">
      <div className="container w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Pedidos do dia</h2>
        <Card className="w-full flex flex-col lg:flex-row rounded-xl shadow-sm border overflow-hidden bg-white h-[80vh]">
          {/* ORDER LIST */}
          <div className={`${orderView ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 border-r-0 lg:border-r h-full bg-zinc-50/50 flex flex-col`}>
            <div className="p-4 border-b bg-white">
              <h3 className="font-semibold text-zinc-700">Painel de Pedidos</h3>
            </div>
            <ScrollArea className="border-r-1 h-full pb-10">
              <Accordion
                type="multiple"
                className="w-full py-2 gap-0 px-2"
                defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]}
              >
                <AccordionItem
                  value="item-1"
                  data-state="open"
                  className="bg-white rounded-xl shadow-sm border mb-3 overflow-hidden data-[state=closed]:bg-transparent data-[state=closed]:shadow-none data-[state=closed]:border-transparent"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline font-semibold text-zinc-700 data-[state=open]:border-b data-[state=open]:bg-zinc-50/50">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" /> Novos
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 bg-zinc-50/30">
                    <div className="w-full p-2">
                      {newOrders.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">Nenhum pedido novo</p>
                      )}
                      {newOrders.map((order) => (
                        <CardOrder
                          onClick={() => setOrderView(order)}
                          isSelected={orderView?.id === order.id}
                          status={order.status}
                          numberOrder={"#" + order.numberOrder}
                          clientName={order.clientName}
                          deliveryTime={getDeliveryTime(order.deliveryTime)}
                          key={order.numberOrder}
                          updateStatusOrder={() =>
                            updateStatusOrder("ACCEPTED", order.id)
                          }
                          cancelOrder={() =>
                            updateStatusOrder("CANCELED", order.id)
                          }
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-2"
                  className="bg-white rounded-xl shadow-sm border mb-3 overflow-hidden data-[state=closed]:bg-transparent data-[state=closed]:shadow-none data-[state=closed]:border-transparent"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline font-semibold text-zinc-700 data-[state=open]:border-b data-[state=open]:bg-zinc-50/50">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" /> Em preparação
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 bg-zinc-50/30">
                    <div className="w-full p-2">
                      {inPreparationOrders.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">Nenhum pedido em preparação</p>
                      )}
                      {inPreparationOrders.map((order) => (
                        <CardOrder
                          onClick={() => setOrderView(order)}
                          isSelected={orderView?.id === order.id}
                          status={order.status}
                          numberOrder={"#" + order.numberOrder}
                          clientName={order.clientName}
                          deliveryTime={getDeliveryTime(order.deliveryTime)}
                          key={order.numberOrder}
                          updateStatusOrder={() =>
                            updateStatusOrder("SENT", order.id)
                          }
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-3"
                  className="bg-white rounded-xl shadow-sm border mb-3 overflow-hidden data-[state=closed]:bg-transparent data-[state=closed]:shadow-none data-[state=closed]:border-transparent"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline font-semibold text-zinc-700 data-[state=open]:border-b data-[state=open]:bg-zinc-50/50">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" /> À caminho
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 bg-zinc-50/30">
                    <div className="w-full p-2">
                      {onTheWayOrders.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">Nenhum pedido à caminho</p>
                      )}
                      {onTheWayOrders.map((order) => (
                        <CardOrder
                          onClick={() => setOrderView(order)}
                          isSelected={orderView?.id === order.id}
                          status={order.status}
                          numberOrder={"#" + order.numberOrder}
                          clientName={order.clientName}
                          deliveryTime={getDeliveryTime(order.deliveryTime)}
                          key={order.numberOrder}
                          updateStatusOrder={() =>
                            updateStatusOrder("FINISHED", order.id)
                          }
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-4"
                  className="bg-white rounded-xl shadow-sm border mb-3 overflow-hidden data-[state=closed]:bg-transparent data-[state=closed]:shadow-none data-[state=closed]:border-transparent"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline font-semibold text-zinc-700 data-[state=open]:border-b data-[state=open]:bg-zinc-50/50">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" /> Finalizados
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 bg-zinc-50/30">
                    <div className="w-full p-2">
                      {deliveredOrders.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">Nenhum pedido finalizado</p>
                      )}
                      {deliveredOrders.map((order) => (
                        <CardOrder
                          onClick={() => setOrderView(order)}
                          isSelected={orderView?.id === order.id}
                          status={order.status}
                          numberOrder={"#" + order.numberOrder}
                          clientName={order.clientName}
                          deliveryTime={getDeliveryTime(order.deliveryTime)}
                          key={order.numberOrder}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-5"
                  className="bg-white rounded-xl shadow-sm border mb-3 overflow-hidden data-[state=closed]:bg-transparent data-[state=closed]:shadow-none data-[state=closed]:border-transparent"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline font-semibold text-zinc-700 data-[state=open]:border-b data-[state=open]:bg-zinc-50/50">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-500" /> Cancelados
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 bg-zinc-50/30">
                    <div className="w-full p-2">
                      {canceledOrders.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">Nenhum pedido cancelado</p>
                      )}
                      {canceledOrders.map((order) => (
                        <CardOrder
                          onClick={() => setOrderView(order)}
                          isSelected={orderView?.id === order.id}
                          status={order.status}
                          numberOrder={"#" + order.numberOrder}
                          clientName={order.clientName}
                          deliveryTime={getDeliveryTime(order.deliveryTime)}
                          key={order.numberOrder}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </div>

          {/* ORDER DETAILS */}
          {isLoading ? (
            <div className="w-full lg:w-2/3 flex justify-center items-center h-[50vh] lg:h-full bg-zinc-50/30">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-sm animate-pulse">Carregando pedidos...</p>
              </div>
            </div>
          ) : orderView ? (
            <div className={`${orderView ? 'block' : 'hidden lg:block'} w-full lg:w-2/3 relative h-full bg-white flex flex-col`}>
              {/* HEADER */}
              <div className="bg-white border-b flex items-center justify-between px-6 py-4 gap-5 shrink-0 h-16">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden shrink-0"
                    onClick={() => setOrderView(undefined)}
                  >
                    <span className="sr-only">Voltar</span>
                    ←
                  </Button>
                  <div className="bg-primary/10 text-primary p-2 rounded-lg shrink-0">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pedido</p>
                    <h2 className="text-xl font-bold text-zinc-900 truncate">
                      #{orderView.numberOrder}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {orderView.status === 'FINISHED' && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                      Finalizado
                    </span>
                  )}
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full">
                {/* INFO */}
                <ScrollArea className="w-full lg:w-1/2 p-0 border-b lg:border-b-0 lg:border-r h-1/2 lg:h-full bg-zinc-50/30">
                  <div className="p-6 space-y-6">
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
                            <p className="text-xs text-zinc-500">Cliente</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Endereço de Entrega
                      </h3>
                      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPinned className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-zinc-800">
                              {orderView.address?.street}, {orderView.address?.number}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {orderView.address?.neighborhood}, {orderView.address?.city}
                            </p>
                            {orderView.address?.complement && (
                              <p className="text-xs text-zinc-400 mt-1 bg-zinc-50 p-2 rounded border inline-block">
                                Obs: {orderView.address.complement}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

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

                {/* ITEMS */}
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-white">
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
                        <div
                          className="w-full py-4 hover:bg-zinc-50/50 transition-colors flex items-center justify-between px-4"
                          key={index}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 border flex items-center justify-center font-bold text-sm text-zinc-700 shadow-sm shrink-0">
                              {item.quantity}x
                            </div>
                            <span className="text-sm font-medium text-zinc-700 line-clamp-2">{item.name}</span>
                          </div>
                          <div className="font-bold text-zinc-900 whitespace-nowrap ml-2">{formatToBRL(calculateItemPrice(item) * item.quantity)}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* FOOTER ACTIONS */}
                  <div className="p-6 bg-zinc-50 border-t mt-auto">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-end pt-2">
                        <div>
                          <p className="text-sm text-zinc-500">Total a pagar</p>
                        </div>
                        <span className="text-2xl font-bold text-zinc-900">{formatToBRL(orderView.total)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full">
                      {orderView?.status === "FINISHED" ||
                        orderView.status === "SENT" ||
                        orderView.status === "CANCELED" ? (
                        <></>
                      ) : (
                        <Button
                          className={`${orderView?.status === "MADE" ? "w-1/2" : "w-full"
                            } bg-green-600 hover:bg-green-700 hover:cursor-pointer shadow-sm`}
                          onClick={
                            orderView.status === "MADE"
                              ? () => updateStatusOrder("ACCEPTED", orderView.id)
                              : () => updateStatusOrder("SENT", orderView.id)
                          }
                        >
                          {orderView?.status === "MADE"
                            ? "Aceitar Pedido"
                            : orderView?.status === "ACCEPTED"
                              ? "Saiu para Entrega"
                              : "Finalizar Pedido"}
                        </Button>
                      )}
                      {orderView?.status === "MADE" ? (
                        <Button
                          onClick={() =>
                            updateStatusOrder("CANCELED", orderView.id)
                          }
                          variant="destructive"
                          className="w-1/2 hover:cursor-pointer shadow-sm"
                        >
                          Rejeitar
                        </Button>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : orders.length === 0 && isLoading === false ? (
            <div className="hidden lg:flex justify-center items-center w-full flex-col h-full text-center p-8 bg-zinc-50/20">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <Hash className="w-12 h-12 text-zinc-200" />
              </div>
              <h2 className="text-xl font-bold text-zinc-800 mb-2">
                Tudo tranquilo por aqui
              </h2>
              <p className="text-muted-foreground">Você ainda não recebeu nenhum pedido para hoje.</p>
            </div>
          ) : (
            <div className="hidden lg:flex justify-center items-center w-full flex-col h-full text-center p-8 bg-zinc-50/20">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <Hash className="w-12 h-12 text-zinc-200" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                Selecione um pedido
              </h3>
              <p className="text-muted-foreground">Selecione um pedido da lista para ver os detalhes e ações disponíveis.</p>
            </div>
          )}
        </Card>

        <Separator className="mt-12 mb-8 opacity-50" />

        {/* PERFORMANCE */}
        <h2 className="text-3xl font-bold tracking-tight mb-6">Performance</h2>
        <Card className="w-full p-6 shadow-sm border-zinc-200 rounded-xl overflow-hidden mb-8">
          <CardTitle className="text-xl mb-6 flex items-center justify-between">
            <span>Métricas em Tempo Real</span>
            <span className="text-xs font-normal bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Ao vivo
            </span>
          </CardTitle>
          <CardContent className="px-0 flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-1 p-5 bg-gradient-to-br from-zinc-50 to-white rounded-xl border w-full md:w-1/2 shadow-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText size={80} />
              </div>
              <h4 className="text-zinc-500 font-medium text-sm z-10">Hoje ({getDay()})</h4>
              <div className="flex justify-between items-end mt-4 z-10">
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Pedidos</p>
                  <p className="text-3xl font-bold text-zinc-900">{orders.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Faturamento</p>
                  <p className="text-3xl font-bold text-primary">{handleTotalForDay()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 p-5 bg-gradient-to-br from-zinc-50 to-white rounded-xl border w-full md:w-1/2 shadow-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 size={80} />
              </div>
              <h4 className="text-zinc-500 font-medium text-sm z-10">Total da Semana</h4>
              <div className="flex justify-between items-end mt-4 z-10">
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Pedidos</p>
                  <p className="text-3xl font-bold text-zinc-900">{totalOrdersWeek}</p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        <Card className="w-full p-6 shadow-sm border-zinc-200 rounded-xl">
          <CardTitle className="text-xl mb-6 flex items-center justify-between">
            <span>Visão Geral de Vendas</span>
            <span className="text-xs font-normal text-zinc-500">Últimos 7 dias</span>
          </CardTitle>
          <CardContent className="px-0 w-full">
            <ChartOrders
              day="Semana"
              chartData={realChartData}
              countOrders={totalOrdersWeek}
            />
          </CardContent>
        </Card>
        {/* PERFORMANCE */}
      </div>
    </section>
  );
}
