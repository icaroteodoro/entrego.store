"use client";
import { iItems, iOrder, useOrders } from "@/hooks/useOrder";
import CardOrder from "@/components/CardOrder";
import { ChartOrders } from "@/components/ChartOrders";
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
import { MapPin, User, CreditCard, Building2, MapPinned, Home as HomeIcon, Hash, FileText } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

const chartData = [
  { day: "Domingo", orders: 214 },
  { day: "Segunda", orders: 186 },
  { day: "Terça", orders: 305 },
  { day: "Quarta", orders: 237 },
  { day: "Quinta", orders: 73 },
  { day: "Sexta", orders: 209 },
  { day: "Sábado", orders: 214 },
];

const paymentMethodMap = {
  'CREDITO': 'Crédito',
  'DEBITO': 'Débito',
  'PIX': 'Pix',
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
    updateStatusOrder
  } = useOrders(false);

  const {setPageTitle} = useSidebar();

  useEffect(() => {
    setPageTitle("Home");
  }, []);

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
    return paymentMethodMap[paymentMethodCode as keyof typeof paymentMethodMap] || paymentMethodCode;
  };

  function getDeliveryTime(date: any): string {
    const dateTime = new Date(date);

    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function handleTotalForOrder(items: iItems[]): string {
    if (!items || items.length === 0) {
        return "";
    }

    const total = items.reduce((sum, item) => sum + item.price, 0);
    return formatToBRL(total);
}

  function handleTotalForDay(): string {
    const total = orders.reduce((orderTotal, order) => {
      const orderSum = order.items.reduce(
        (itemTotal, item) => itemTotal + item.price,
        0
      );
      return orderTotal + orderSum;
    }, 0);

    return formatToBRL(total);
  }

  return (
    <section className="flex items-center justify-center">
      <div className="container">
        <h2 className="text-3xl font-semibold mb-5">Pedidos do dia</h2>
        <Card className="w-full flex flex-row rounded-sm py-0 gap-0 h-[80vh]">
          <ScrollArea className="w-2/6 px-2 border-r-1 h-full">
            <Accordion
              type="multiple"
              className="w-full py-2 gap-0"
              defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]}
            >
              <AccordionItem
                value="item-1"
                data-state="open"
                className="bg-zinc-100 rounded-2xl px-3 py-2 border-none mb-1"
              >
                <AccordionTrigger>Novos</AccordionTrigger>
                <AccordionContent>
                  {newOrders.map((order) => (
                    <CardOrder
                      onClick={() => setOrderView(order)}
                      status={order.status}
                      numberOrder={"#" + order.numberOrder}
                      clientName={order.clientName}
                      deliveryTime={getDeliveryTime(order.deliveryTime)}
                      key={order.numberOrder}
                      updateStatusOrder={() => updateStatusOrder('ACCEPTED', order.id)}
                      cancelOrder={() => updateStatusOrder('CANCELED', order.id)}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-2"
                className="bg-zinc-100 rounded-2xl px-3 py-2 border-none mb-1"
              >
                <AccordionTrigger>Em preparação</AccordionTrigger>
                <AccordionContent>
                  {inPreparationOrders.map((order) => (
                    <CardOrder
                      onClick={() => setOrderView(order)}
                      status={order.status}
                      numberOrder={"#" + order.numberOrder}
                      clientName={order.clientName}
                      deliveryTime={getDeliveryTime(order.deliveryTime)}
                      key={order.numberOrder}
                      updateStatusOrder={() => updateStatusOrder('SENT', order.id)}
                      
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-3"
                className="bg-zinc-100 rounded-2xl px-3 py-2 border-none mb-1"
              >
                <AccordionTrigger>À caminho</AccordionTrigger>
                <AccordionContent>
                  {onTheWayOrders.map((order) => (
                    <CardOrder
                      onClick={() => setOrderView(order)}
                      status={order.status}
                      numberOrder={"#" + order.numberOrder}
                      clientName={order.clientName}
                      deliveryTime={getDeliveryTime(order.deliveryTime)}
                      key={order.numberOrder}
                      updateStatusOrder={() => updateStatusOrder('FINISHED', order.id)}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-4"
                className="bg-zinc-100 rounded-2xl px-3 py-2 border-none mb-1"
              >
                <AccordionTrigger>Finalizados</AccordionTrigger>
                <AccordionContent>
                  {deliveredOrders.map((order) => (
                    <CardOrder
                      onClick={() => setOrderView(order)}
                      status={order.status}
                      numberOrder={"#" + order.numberOrder}
                      clientName={order.clientName}
                      deliveryTime={getDeliveryTime(order.deliveryTime)}
                      key={order.numberOrder}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-5"
                className="bg-zinc-100 rounded-2xl px-3 py-2 border-none"
              >
                <AccordionTrigger>Pedidos Cancelados</AccordionTrigger>
                <AccordionContent>
                  {canceledOrders.map((order) => (
                    <CardOrder
                      onClick={() => setOrderView(order)}
                      status={order.status}
                      numberOrder={"#" + order.numberOrder}
                      clientName={order.clientName}
                      deliveryTime={getDeliveryTime(order.deliveryTime)}
                      key={order.numberOrder}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
          {isLoading ? (
            <div className="w-full flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : orderView ? (
            <div className="w-4/6 relative">
              {/* HEADER */}
              <div className="absolute bg-white top-0 left-0 h-16 w-full border-b flex items-center justify-between px-4 gap-5">
                <h2 className="text-xl font-semibold">Número do pedido: <span className="text-primary">#{orderView.numberOrder}</span></h2>
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
                            <p className="font-medium">{orderView.address.city}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPinned className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500">Bairro</p>
                            <p className="font-medium">{orderView.address.neighborhood}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <HomeIcon className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500">Logradouro</p>
                            <p className="font-medium">{orderView.address.street}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500">Número</p>
                            <p className="font-medium">{orderView.address.number}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500">Complemento</p>
                            <p className="font-medium">{orderView.address.complement || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-lg">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-zinc-500">Forma de pagamento</p>
                        <p className="font-medium">{getPaymentMethodDisplayName(orderView.paymentMethod)}</p>
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
              <div className="absolute bg-white bottom-0 left-0 h-16 w-full border-t flex items-center justify-between px-4">
                <div>
                  <h2 className="font-semibold">
                    {handleTotalForOrder(orderView.items)}
                  </h2>
                </div>
                <div className="flex gap-5">
                  {orderView?.status === "FINISHED" || orderView.status === 'SENT' ? (
                    <></>
                  ) : (
                    <Button
                      className={`${
                        orderView?.status === "MADE" ? "w-[48%]" : "w-full"
                      } bg-green-600 hover:bg-green-700 hover:cursor-pointer`}
                    >
                      {orderView?.status === "MADE"
                        ? "Aceitar pedido"
                        : orderView?.status === "CANCELED"
                        ? "Realizar entrega"
                        : "Finalizar pedido"}
                    </Button>
                  )}
                  {orderView?.status === "MADE" ? (
                    <Button onClick={() => updateStatusOrder("CANCELED", orderView.id)} className="w-[48%] bg-red-600 hover:bg-red-700 hover:cursor-pointer">
                      Rejeitar pedido
                    </Button>
                  ) : (
                    <></>
                  )}
                  {orderView?.status === "FINISHED" ? (
                    <span className="bg-zinc-500 text-white px-2 py-1a rounded-2xl">
                      Pedido Finalizado
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {/* FOOTER */}
            </div>
          ) :
          orders.length === 0 && isLoading === false ?
          (
            <div className="flex justify-center items-center w-full flex-col">
              <h2 className="text-2xl font-bold text-primary">
                Sentimos muito,
              </h2>
              <h2>mas você ainda não recebeu nenhum pedido para hoje</h2>
            </div>
          ):
          <></>
          }
        </Card>
        <Separator className="mt-5" />
        {/* PERFORMANCE */}
        <h2 className="text-3xl font-semibold my-5">Performance da loja</h2>
        <Card className="w-full p-5">
          <CardTitle className="text-2xl">
            Acompanhamento
            <span className="text-sm font-normal text-zinc-600 ml-2">
              Tempo real
            </span>
          </CardTitle>
          <CardContent className="px-0 flex space-x-10">
            {/* Card da perfomance do dia */}
            <Card className="px-3 border-t-8 border-primary border-b-0 border-l-0 border-r-0 w-max">
              <CardTitle className="px-3">
                Hoje
                <span className="text-xs font-normal text-zinc-600 ml-2">
                  - {getDay()}
                </span>
              </CardTitle>
              <CardContent className="flex px-3 gap-5">
                <div>
                  <h4>Pedidos de hoje</h4>
                  <p className="mt-2">
                    <span className="text-3xl">{orders.length}</span>
                    {orders.length == 1 ? " pedido" : " pedidos"}
                  </p>
                </div>
                <div>
                  <h4>Saldo de hoje</h4>
                  <p className="mt-2 text-3xl">{handleTotalForDay()}</p>
                </div>
              </CardContent>
            </Card>
            {/* Card da perfomance do dia */}
            <Card className="px-3 border-t-8 border-primary border-b-0 border-l-0 border-r-0 w-max">
              <CardTitle className="px-3">Março</CardTitle>
              <CardContent className="flex px-3 gap-5">
                <div>
                  <h4>Pedidos de março</h4>
                  <p className="mt-2">
                    <span className="text-3xl">0</span> pedidos
                  </p>
                </div>
                <div>
                  <h4>Saldo de março</h4>
                  <p className="mt-2 text-3xl">R$ 0,00</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card className="w-full p-5 mt-5">
          <CardTitle className="text-2xl">
            Gráficos
            <span className="text-sm font-normal text-zinc-600 ml-2">
              Tempo real
            </span>
          </CardTitle>
          <CardContent className="px-0 flex space-x-10">
            <ChartOrders
              day="Janeiro"
              chartData={chartData}
              countOrders={489}
            />
          </CardContent>
        </Card>
        {/* PERFORMANCE */}
      </div>
    </section>
  );
}
