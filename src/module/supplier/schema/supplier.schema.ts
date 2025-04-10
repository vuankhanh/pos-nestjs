import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ISupplier } from "src/shared/interface/supplier.interface";
import { IProvince, IDistrict } from "src/shared/interface/vn-public-apis.interface";

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true })
export class Supplier implements ISupplier {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Object })
  address: { province: IProvince; district: IDistrict; ward: string; street: string; };

  @Prop({ type: String })
  telephone: string;

  @Prop({
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: false,
  })
  email?: string;

  @Prop({ type: Object })
  position?: { lat: number; lng: number; };

  @Prop({ type: String })
  url?: string;

  @Prop({ type: String })
  taxID?: string;

  @Prop({ type: Object })
  contactPoint?: { contactType: string; name: string; telephone: string; email: string; };

  @Prop({ type: String })
  logo?: string;

  @Prop({ type: [String] })
  sameAs?: string[];
}

export const supplierSchema = SchemaFactory.createForClass(Supplier);