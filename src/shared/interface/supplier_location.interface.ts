import { IAddress } from "./address.interface";
import { IBankPayment } from "./bank-payment.interface";

export interface ISupplierLocation {
  bankTransfer?: IBankPayment;
  name: string; // Name of the supplier
  address: IAddress;
  telephone: string; // Contact phone number
  debt?: ISupplierDebt; // Optional field for supplier debt
  email?: string; // Contact email
  position?: {
    lat: string | number; // Latitude for geolocation
    lng: string | number; // Longitude for geolocation
  },
  url?: string; // Website URL (optional)
  taxID?: string; // Tax identification number (optional)
  contactPoint?: {
    contactType: string; // Type of contact (e.g., Customer Support)
    name: string; // Name of the contact person
    telephone: string; // Contact phone number
    email: string; // Contact email
  };
  logo?: string; // URL to the supplier's logo (optional)
  sameAs?: string[]; // URLs to social media or related profiles (optional)
}

export interface ISupplierDebt {
  amount: number; // Amount owed to the supplier
  note: string; // Additional notes (optional)
}