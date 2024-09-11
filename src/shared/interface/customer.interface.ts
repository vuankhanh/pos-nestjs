import { CustomerLevel } from "src/constant/customer.constant";

export interface ICustomer {
  name: string;
  phoneNumber: string;
  address: string;
  email?: string;
  dob?: string;
  company?: string;
  note?: string;
  level?: ICustomerLevel;
}

export type ICustomerLevel = `${CustomerLevel}`;

export class Customer implements ICustomer {
  name: string;
  phoneNumber: string;
  address: string;
  email?: string;
  dob?: string;
  company?: string;
  note?: string;
  level?: ICustomerLevel;

  constructor(customer: ICustomer) {
    this.name = customer.name;
    this.phoneNumber = customer.phoneNumber;
    this.address = customer.address;
    this.email = customer.email;
    this.dob = customer.dob;
    this.company = customer.company;
    this.note = customer.note;
    this.level = customer.level;
  }
}