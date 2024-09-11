import { ICustomer } from "./customer.interface";
import { IOrder } from "./order.interface";

export interface ITemplate {
  customer: ICustomer;
  order: IOrder;
  footer: IFooterTemplate;
}

export interface IFooterTemplate {
  brandName: string;
  address: string;
  phoneNumber: string;
  email: string;
  fanpage: string;
  website: string;
}

export class Template implements ITemplate {
  customer: ICustomer;
  order: IOrder;
  footer: IFooterTemplate;

  constructor(customer: ICustomer, order: IOrder, footer: IFooterTemplate) {
    this.customer = customer;
    this.order = order;
    this.footer = footer;
  }
}