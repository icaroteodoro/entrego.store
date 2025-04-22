import api from "@/lib/axios";
import { getEmailByToken } from "./token-service";
import { getStore } from "./store-service";

export interface iProductCategory {
  id: string;
  name: string;
}

export interface iProduct {
  id: string;
  name: string;
  price: number;
  discount: number;
  productCategory: iProductCategory;
  urlImage: string
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
      storeId,
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

export async function updateProduct(
  productId: string,
  productName: string,
  productPrice: number,
  productDiscount: number,
  product: iProduct
) {
  // console.log(productId);
  const productUpdated = await api.put(`/product/update/${productId}`, {
    name: productName,
    price: productPrice,
    discount: productDiscount,
    productCategoryId: product.productCategory.id,
  });
  if (!productUpdated) {
    return false;
  }
  return productUpdated;
}

export async function updateImageProduct(newFile:File, productId: string) {
  try {
    const formData = new FormData();
    formData.append('file', newFile);
    await api.post(`/product/update-image/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }catch (error) {
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
