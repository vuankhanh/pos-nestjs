export interface IProduct {
  name: string;
  category: string;
  sku: string;
  price: number;
  availability: boolean;
  unit: string;
  description?: string;
  usageInstructions?: string;
  brand?: string;
  rating?: number;
  reviews?: number;
}