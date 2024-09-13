import { OrderStatus } from "src/constant/status.constant";
import { TPaymentMethod } from "./payment.interface";

export type TOrderStatus = `${OrderStatus}`;

export interface IOrder {
  orderCode: string;
  orderItems: IOrderItem[];
  status: TOrderStatus;
  total: number;
  paymentMethod?: TPaymentMethod;
  note?: string;
}

export interface IOrderItem {
  productName: string;
  quantity: number;
  unit: string;
  price: number;
}