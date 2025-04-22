import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getStore } from "./store-service";
import { resolve } from "path";

const WEBSOCKET_API_URL = "http://localhost:8080/ws";

const ORDER_TOPIC_URL = "/topic/orders";

class WebSocketService {
  private client: Client | null = null;
  private storeId: string | null = null;
  private listeners: ((order: any) => void)[] = [];

  async connect() {
    try {
      if (this.client?.connectedVersion) {
        return;
      }

      try {
        const store = await getStore();
        this.storeId = store.id;
      } catch (error) {
        console.error("Não foi possível obter o ID da loja!!");
      }

      if (!this.storeId) {
        console.error("ID da loja não disponível");
        return;
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(WEBSOCKET_API_URL),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = (frame) => {
        const sub = this.client?.subscribe(
          `${ORDER_TOPIC_URL}/${this.storeId}`,
          (message) => {
            if (message.body) {
              try {
                const newOrder = JSON.parse(message.body);
                this.notifyListeners(newOrder);
              } catch (error) {
                console.error("Erro ao processar mensagem recebida:", error);
              }
            }
          }
        );
      };

      this.client.activate();
    } catch (error) {
      console.log("Não foi possível fazer a conexão!");
    }
  }

  disconnect(): void { 
    if (this.client && this.client.connected) {
      try {
        this.client.deactivate();
      } catch (error) {
        console.error("Erro ao desativar cliente STOMP:", error);
      }
      this.client = null;
    }
  }

  isConnected(): boolean {
    return !!this.client?.connected;
  }

  addOrderListener(callback: (order: any) => void): void {
    this.listeners.push(callback);
  }

  removeOrderListener(callback: (order: any) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  // Notifica todos os listeners sobre o novo pedido
  notifyListeners(order: any): void {
    console.log(
      `Notificando ${this.listeners.length} listeners sobre novo pedido`
    );
    this.listeners.forEach((listener) => {
      try {
        listener(order);
      } catch (error) {
        console.error("Erro ao notificar listener:", error);
      }
    });
  }
}

const websocketService: WebSocketService = new WebSocketService();

export default websocketService;
