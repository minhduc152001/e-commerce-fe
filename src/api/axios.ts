import axios from "axios";
import { TProduct, TReview } from "../constants/type";
import { TOrder, TOrderAndProductName, TProductTier } from "../types/type";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT || "http://14.225.207.134:6789",
  timeout: 90000,
  maxBodyLength: Infinity,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const listProductsAPI = async (): Promise<TProduct[]> => {
  const response = await axiosInstance.get("/products"); // Replace with your axiosInstance if needed
  return response.data.products;
};

export const getProductAPI = async (id: string): Promise<TProduct> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data.product;
};

export const updateProduct = async (
  id: string,
  updateData: Partial<TProduct>
) => {
  const response = await axiosInstance.put(`/products/${id}`, updateData);
  return response.data.product;
};

export const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(`products/${id}`);
  return response.data.product;
};

export const listReviewsByProductAPI = async (
  productId: string
): Promise<TReview[]> => {
  const response = await axiosInstance.get(`/reviews/product/${productId}`);
  return response.data.reviews;
};

export const listTiersByProductAPI = async (
  productId: string
): Promise<TProductTier[]> => {
  const response = await axiosInstance.get(
    `/product-tiers/product/${productId}`
  );
  return response.data.productTiers;
};

export const createOrder = async (arg: TOrder): Promise<TOrder> => {
  const response = await axiosInstance.post(`/orders`, arg);
  return response.data.order;
};

export const updateOrder = async (
  id: string,
  updateData: Partial<TOrder>
): Promise<TOrder> => {
  const response = await axiosInstance.put(`/orders/${id}`, updateData);
  return response.data.order;
};

export const fetchOrders = async (): Promise<TOrderAndProductName[]> => {
  const response = await axiosInstance.get(`/orders`);
  return response.data.orders;
};
