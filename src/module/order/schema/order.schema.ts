import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OrderStatus } from "src/constant/status.constant";
import { Customer } from "src/module/customer/schema/customer.schema";
import { IOrder, IOrderItem, TOrderStatus } from "src/shared/interface/order.interface";
import { TPaymentMethod } from "src/shared/interface/payment.interface";
import { ObjectId } from "mongodb";

export type OrderDocument = HydratedDocument<Order>;

export class Order implements IOrder {
  @Prop({ type: String, required: true, unique: true, immutable: true })
  orderCode: string;

  @Prop({ type: Array, required: true })
  orderItems: IOrderItem[];

  @Prop({ type: String, required: true, default: OrderStatus.PENDING })
  status: TOrderStatus;
  
  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ type: String })
  paymentMethod?: TPaymentMethod;

  @Prop({ type: String })
  customerName?: string;

  @Prop({ type: String })
  customerPhoneNumber?: string;

  @Prop({ type: String })
  customerAddress?: string;

  @Prop({ type: Types.ObjectId, ref: Customer.name })
  customerId?: Types.ObjectId | string;

  @Prop({ type: String })
  note?: string;

  constructor(order: IOrder) {
    this.orderCode = order.orderCode;
    this.orderItems = order.orderItems;
    this.status = order.status;
    this.total = this.calculateTotal(order.orderItems);
    this.paymentMethod = order.paymentMethod;
    this.note = order.note;
  }
  
  private calculateTotal(orderItems: IOrderItem[]): number {
    return orderItems.reduce((total: number, item: IOrderItem) => total + item.price * item.quantity, 0);
  }

  set updateAlbumId(customerId: string) {
    this.customerId = ObjectId.createFromHexString(customerId);
  }

  set updateCustomerInfo(customer: Partial<Customer>) {
    this.customerName = customer.name;
    this.customerPhoneNumber = customer.phoneNumber;
    this.customerAddress = customer.address;
  }
}

export const orderSchema = SchemaFactory.createForClass(Order);