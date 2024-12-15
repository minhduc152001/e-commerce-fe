import { EOrderStatus } from "./enum";

export type TWard = {
  Id?: string;
  Name?: string;
  Level: string;
};
export type TDistrict = {
  Id: string;
  Name: string;
  Wards: TWard[];
};
export type TCity = {
  Id: string;
  Name: string;
  Districts: TDistrict[];
};

export type TProductTier = {
  id: string;
  productId: string;
  quantity: number;
  description: string;
  price: number;
  shippingFee: number;
};

export type TCartItem = {
  id: string;
  productId: string;
  quantity: number;
  attributeId: string;
};

export type TSize = {
  sizeName: string;
  weight: string;
  height: string;
};

export type TOrder = {
  id?: string;
  productId: string;
  customerName: string;
  phoneNumber: string;
  shippingAddress: string;
  shippingFee?: number;
  totalPrice?: number;
  tiers?: string[];
  sizes?: string[];
  codes?: string[];
  colors?: string[];
  note: string | null;
  quantity?: number | null;
  status?: EOrderStatus;
  createdAt?: Date;
  canceledAt?: Date | null;
  deliveryAt?: Date | null;
  completedAt?: Date | null;
};

export type TOrderAndProductName = TOrder & {
  productName: string;
};
