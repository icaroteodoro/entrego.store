import api from "@/lib/axios";
import { getEmailByToken } from "./token-service";
import { getStore } from "./store-service";

export interface iProductCategory {
  id: string;
  name: string;
}

export interface iProductOption {
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
}

export interface iProductOptionGroup {
  name: string;
  minSelection: number;
  maxSelection: number;
  options: iProductOption[];
}

export interface iProduct {
  id: string;
  name: string;
  price: number;
  discount: number;
  productCategory: iProductCategory;
  urlImage: string;
  minPrice?: number;
  optionGroups?: iProductOptionGroup[];
}

export async function getProductCategories(): Promise<iProductCategory[]> {
  const email = getEmailByToken();

  const productCategories: iProductCategory[] = (
    await api.get(`/product-category/store/${email}`)
  ).data;
  return productCategories;
}

export async function createCategory(name: string): Promise<iProductCategory> {
  const store = await getStore();
  const storeId = store.id;
  const category: iProductCategory = await api.post(
    "/product-category/create",
    {
      name,
      storeId,
    }
  );
  return category;
}

export async function deleteCategory(categoryId: string) {
  try {
    await api.delete(`/product-category/delete/${categoryId}`);
  } catch (error) {
    throw error;
  }
}

export async function getAllProducts(): Promise<iProduct[]> {
  const email = getEmailByToken();
  const products: iProduct[] = (await api.get(`/product/store/${email}`)).data;
  return products;
}

export async function createProduct(product: iProduct, file: File) {
  try {
    const store = await getStore();
    const storeId = store.id;
    const productRequest = {
      name: product.name,
      price: product.price,
      productCategoryId: product.productCategory.id,
      discount: product.discount,
      minPrice: product.minPrice,
      storeId,
      optionGroups: product.optionGroups,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(productRequest));
    formData.append("file", file);
    await api.post("/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function updateProduct(product: iProduct) {
  const store = await getStore();
  const storeId = store.id;

  const productUpdated = await api.put(`/product/update/${product.id}`, {
    name: product.name,
    price: product.price,
    discount: product.discount,
    minPrice: product.minPrice,
    productCategoryId: product.productCategory.id,
    optionGroups: product.optionGroups,
  });

  if (!productUpdated) {
    return false;
  }
  return productUpdated;
}

export async function updateImageProduct(newFile: File, productId: string) {
  try {
    const formData = new FormData();
    formData.append('file', newFile);
    await api.post(`/product/update-image/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    await api.delete(`/product/delete/${productId}`);
  } catch (error) {
    throw error;
  }
}
