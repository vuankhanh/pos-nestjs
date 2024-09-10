import { TPaymentMethod } from "./payment.interface";
import { TOrderStatus } from "./status.interface";

export interface IOrder {
  orderCode: string;
  orderDate: Date;
  deliveryDate: Date;
  orderItems: IOrderItem[];
  status: TOrderStatus;
  total: number;
  paymentMethod: TPaymentMethod;
}

export interface IOrderItem {
  productName: string;
  quantity: number;
  unit: string;
  price: number;
}

export class Order implements IOrder {
  orderCode: string;
  orderDate: Date;
  deliveryDate: Date;
  orderItems: IOrderItem[];
  status: TOrderStatus;
  total: number;
  paymentMethod: TPaymentMethod;
  
  constructor(order: IOrder) {
    this.orderCode = order.orderCode;
    this.orderDate = order.orderDate;
    this.deliveryDate = order.deliveryDate;
    this.orderItems = order.orderItems;
    this.status = order.status;
    this.total = this.calculateTotal(order.orderItems);
    this.paymentMethod = order.paymentMethod;
  }

  private calculateTotal(orderItems: IOrderItem[]): number {
    return orderItems.reduce((total: number, item: IOrderItem) => total + item.price * item.quantity, 0);
  }

}