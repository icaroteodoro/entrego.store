'use client'
import { changeStoreStatus, getStore, iStore } from '@/services/storeService';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type StoreStatus = 'OPEN' | 'CLOSED' | "CLOSING";

type Store = {
  id: string;
  name: string;
  description: string;
  status: StoreStatus;
  deliveryFee: number;
};

interface StoreContextType {
  store: iStore | null;
  storeStatus: StoreStatus | null;
  setStore: (store: iStore) => void;
  updateStatus: (status: StoreStatus) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<iStore | null>(null);
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      const store: iStore = await getStore();
      setStore(store);
      setStoreStatus(store.statusLive)
    };
    fetchStore();
  }, []);

  const updateStatus = async (status: StoreStatus) => {
    if (!store) return;
    setStoreStatus(status);
    changeStoreStatus(status);
  };

  return (
    <StoreContext.Provider value={{ store, storeStatus, setStore, updateStatus }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de StoreProvider');
  }
  return context;
};
