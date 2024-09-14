import { Prop, Schema } from "@nestjs/mongoose";
import { IOrderItem } from "src/shared/interface/order.interface";

@Schema({ timestamps: true })
export class OrderItem implements IOrderItem {
  @Prop({ type: String, required: true })
  productCode: string;

  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: Number, required: true })
  price: number;
}