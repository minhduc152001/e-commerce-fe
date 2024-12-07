import axios from "axios";
import { TProduct, TReview } from "../constants/type";
import { TProductTier } from "../types/type";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:6789",
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
