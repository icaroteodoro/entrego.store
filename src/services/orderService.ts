import api from "@/lib/axios";
import { getEmailByToken } from "./tokenService";


// Função para obter os pedidos
export async function getOrders() {
  const email = getEmailByToken();

  const response = await api.get(`/order/store/${email}`);
  return response.data;
}
