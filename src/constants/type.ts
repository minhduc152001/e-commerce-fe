import { TSize } from "../types/type";
import { EAttributeType } from "./enum";

export type TAttribute = {
  id: string;
  name: string;
  type: EAttributeType;
  image: string;
};

export type TProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  discountPercentage: number;
  stockQuantity: number;
  productImage: string;
  subImages: string[];
  sizes: TSize[] | null;
  externalLink?: string;
  attributes?: TAttribute[];
};

export type TReview = {
  id: string;
  productId: string;
  attributeId: string | null;
  userId: string | null;
  reviewerImage: string | null;
  reviewerName: string | null;
  rating: number;
  content: string;
  images: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
};
