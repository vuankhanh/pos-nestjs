import { Types } from "mongoose";
import { SupplierProductUnit } from "src/constant/product.constant";

export interface ISupplierProduct {
  name: string;
  price: number;
  unit: `${SupplierProductUnit}`;
  description?: string;
  supplierId: Types.ObjectId | string;
}