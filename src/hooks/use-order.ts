import { parseCookies } from "nookies";
import api from "@/lib/axios";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { getToken } from "@/services/token-service";

export interface iItems {
  name: string;
  price: number;
  quantity: number;
}

export interface iOrder {
  id: string,
  numberOrder: string;
  clientName: string;
  total: number;
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
    try {
      const res = await getOrders();
      if (!res) {
        setIsLoading(false)
        return false;
      }
      setOrders(res);
      setOrderView(prev => prev || (res.length > 0 ? res[0] : undefined));
      setIsLoading(false)
      return res;
    } catch (error) {
      console.error('Erro ao obter pedidos:', error);
      setIsLoading(false)
      return false;
    }
  }


  async function getOrders() {
    const token = getToken();

    if (!token) {
      return;
    }

    const email = jwt.decode(token)?.sub;

    try {
      if (today) {
        const response = await api.get(`/order/store/today/${email}`);
        return response.data;
      } else {
        const response = await api.get(`/order/store/${email}`);
        return response.data;
      }
    } catch (error) {
      console.log('Erro ao recuperar os pedidos');
    }
  }

  async function refreshOrders() {
    try {
      const token = getToken();
      if (!token) {
        console.warn('Token não disponível para atualizar pedidos');
        return false;
      }

      const email = jwt.decode(token)?.sub;
      if (!email) {
        console.warn('Email não disponível no token');
        return false;
      }
      setIsLoading(true);

      try {

        let apiResponse: { data: iOrder[] } | undefined;
        if (today) {
          apiResponse = await api.get<iOrder[]>(`/order/store/today/${email}`);
        } else {
          apiResponse = await api.get<iOrder[]>(`/order/store/${email}`);
        }

        if (apiResponse && apiResponse.data) {
          setOrders(apiResponse.data);
          setOrderView(prev => prev || (apiResponse.data.length > 0 ? apiResponse.data[0] : undefined));
          setIsLoading(false);
          return apiResponse.data;
        }
      } catch (error) {
        console.error('Erro ao atualizar pedidos:', error);
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Erro na atualização de pedidos:', error);
      setIsLoading(false);
      return false;
    }
  }

  async function updateStatusOrder(status: "MADE" | "ACCEPTED" | "CANCELED" | "SENT" | "FINISHED", orderId: string) {
    setIsUpdating(true)
    try {
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
    } catch (error) {
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
    refreshOrders,
    updateStatusOrder
  };
}
