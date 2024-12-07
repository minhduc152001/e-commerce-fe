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
