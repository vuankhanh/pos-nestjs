import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IAddress } from "src/shared/interface/address.interface";
import { ICoordinates } from "src/shared/interface/coordinates.interface";
import { ISupplier } from "src/shared/interface/supplier.interface";
import { IProvince, IDistrict, IWard } from "src/shared/interface/vn-public-apis.interface";

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true })
export class Supplier implements ISupplier {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: Object })
  address: IAddress;

  @Prop({ type: String })
  telephone: string;

  @Prop({
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: false,
  })
  email?: string;

  @Prop({ type: Object })
  position?: ICoordinates;
}

export const supplierSchema = SchemaFactory.createForClass(Supplier);