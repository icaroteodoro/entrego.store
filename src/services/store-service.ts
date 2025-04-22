import api from "@/lib/axios";

import { destroyCookie } from "nookies";
import { getEmailByToken, saveRefreshToken, saveToken } from "./token-service";
import { redirect } from "next/navigation";
import { StoreStatus } from "@/context/store-context";

interface iCreateStore {
  name: string;
  document: string;
  email: string;
  password: string;
}

export interface iStore {
  id: string;
  name: string;
  document: string;
  email: string;
  description: string;
  category: string;
  statusLive: StoreStatus;
  urlProfileImage: string;
  urlCoverImage: string;
}

export interface iAddress {
  id: string;
  cep: string;
  number: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  country: string;
}

export async function createStore(data: iCreateStore) {
  try {
    const response = await api.post("/auth/store/register", {
      name: data.name,
      document: data.document,
      email: data.email,
      password: data.password,
      address: {}, // Garante que address não será undefined
    });

    saveToken(response.data.token);
    saveRefreshToken("refreshToken", response.data.refresh_token);
    window.location.href= "/home";
  } catch (error: any) {
    throw error;
  }
}

export async function loginStore(email: string, password: string) {
  try {
    const response = await api.post("/auth/store/login", {
      email,
      password,
    });

    saveToken(response.data.token);
    saveRefreshToken(response.data.refreshToken);
  } catch (error: any) {
    throw error;
  }
  window.location.href = "/home";
}

export async function getStore(): Promise<iStore> {
  const email = getEmailByToken();

  const store = await api.get(`/store/${email}`);

  return store.data;
}

export async function changeStoreStatus(newStatus: any) {
  const email = getEmailByToken();

  try {
    await api.put("/store/update-status", {
      email,
      status: newStatus,
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function updateStore(editValues: iStore) {
  const email = getEmailByToken();

  try {
    await api.put(`/store/update/${email}`, {
      name: editValues.name,
      description: editValues.description,
      category: editValues.category,
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function getStoreAddress() {
  const email = getEmailByToken();

  const address = await api.get(`/store/address/${email}`);

  return address.data;
}

export async function updateStoreAddress(editValues: iAddress) {
  const email = getEmailByToken();

  try {
    await api.put(`/address/store/update/${editValues.id}`, {
      cep: editValues.cep,
      number: editValues.number,
      street: editValues.street,
      neighborhood: editValues.neighborhood,
      city: editValues.city,
      country: editValues.country,
      complement: editValues.complement,
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function updateStoreProfileImage(file: File) {
  try{
    const storeEmail = getEmailByToken();
    const formData = new FormData();
  
    formData.append("file", file);
  
    const newUrlProfileImage = await api.put(
      `/store/update-profile/${storeEmail}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return newUrlProfileImage;
  }catch(error) {
    throw error;
  }
}
export async function updateStoreCoverImage(file: File) {
  try{
    const storeEmail = getEmailByToken();
    const formData = new FormData();
  
    formData.append("file", file);
  
    const newUrlCoverImage = await api.put(
      `/store/update-cover/${storeEmail}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return newUrlCoverImage;
  }catch(error) {
    throw error;
  }
}



export async function verifyAddressStore() {
  const address:iAddress = await getStoreAddress();

  if(!address || !address.city || !address.country || !address.street || !address.cep || !address.neighborhood) {
    return false
  }

  return true;
}

export async function verifyImagesStore() {
  const store = await getStore();

  if(!store.urlCoverImage || !store.urlProfileImage){
    return false;
  }

  return true;
}

export async function logout() {
  if (await changeStoreStatus("CLOSED")) {
    destroyCookie(null, "token");
    destroyCookie(null, "refreshToken");
    window.location.href = "/";
  }
}
