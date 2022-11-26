export interface ProductBrief {
  id: number;
  appearanceOrder: number;
  name: string;
  shortDescription: string;
  price: number;
  image: string | undefined | null;
}

export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  isDeleted: number;
  images: string[] | null;
}
