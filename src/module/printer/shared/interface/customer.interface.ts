export interface ICustomer {
  name: string;
  phoneNumber: string;
  email: string;
  dob: string;
  address: string;
  company: string;
  note: string;
  level: string;
}

export class Customer implements ICustomer {
  name: string;
  phoneNumber: string;
  email: string;
  dob: string;
  address: string;
  company: string;
  note: string;
  level: string;

  constructor(customer: ICustomer) {
    this.name = customer.name;
    this.phoneNumber = customer.phoneNumber;
    this.email = customer.email;
    this.dob = customer.dob;
    this.address = customer.address;
    this.company = customer.company;
    this.note = customer.note;
    this.level = customer.level;
  }
}