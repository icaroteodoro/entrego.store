import { parseCookies } from "nookies";
import api from "@/lib/axios";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";

export interface iItems {
  name: string;
  price: number;
  quantity: number;
}

export interface iOrder {
  id: string,
  numberOrder: string;
  clientName: string;
  deliveryTime: string;
  status: "MADE" | "ACCEPTED" | "CANCELED" | "SENT" | "FINISHED";
  items: iItems[];
  address: {
    city: string;
    street: string;
    neighborhood: string;
    number: string;
    complement: string;
  };
  paymentMethod: string;
}

export function useOrders(today: boolean) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [orders, setOrders] = useState<iOrder[]>([]);
  const [orderView, setOrderView] = useState<iOrder>();
  const newOrders = orders.filter((order) => order.status === "MADE");
  const inPreparationOrders = orders.filter((order) => order.status === "ACCEPTED");
  const onTheWayOrders = orders.filter((order) => order.status === "SENT");
  const deliveredOrders = orders.filter((order) => order.status === "FINISHED");
  const canceledOrders = orders.filter((order) => order.status === "CANCELED");

  useEffect(() => {
    getAllOrders();
  }, [isUpdating]);

  async function getAllOrders() {
    setIsLoading(true)
    const res = await getOrders();
    if(!res){
      console.log('Nenhum pedido para hoje') 
      return false;
    } 
    setOrders(res);
    setOrderView(res[0]);
    setIsLoading(false)
  }

  // Função para obter o token
  function getToken(ctx = null) {
    const cookies = parseCookies(ctx);
    return cookies.token;
  }

  // Função para obter os pedidos
  async function getOrders() {
    const token = getToken();

    if (!token) {
      return;
    }

    const email = jwt.decode(token)?.sub;

    try {
      if(today){
        const response = await api.get(`/order/store/today/${email}`);
        return response.data;
      }else{
        const response = await api.get(`/order/store/${email}`);
        return response.data;
      }
    } catch (error) {
      console.log('Erro ao recuperar os pedidos');
    }
  }

  async function updateStatusOrder(status: "MADE" | "ACCEPTED" | "CANCELED" | "SENT" | "FINISHED", orderId:string){
    setIsUpdating(true)
    try{
      const response = await api.put('/order/update', {
        orderId,
        status
      });
      
      // Atualiza o estado local
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order.id === orderId) {
            return { ...order, status };
          }
          return order;
        });
      });

      // Atualiza o orderView se necessário
      setOrderView(prevOrderView => {
        if (prevOrderView?.id === orderId) {
          return { ...prevOrderView, status };
        }
        return prevOrderView;
      });

      setIsUpdating(false)
      return response.data
    }catch (error) {
      setIsUpdating(false)
      return error;
    }
  }

  return {
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
  };
}
