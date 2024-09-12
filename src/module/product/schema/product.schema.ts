import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IProduct } from '../../../shared/interface/product.interface';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product implements IProduct {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: true, unique: true })
  sku: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Boolean, required: true })
  availability: boolean;
  
  @Prop({ type: String, required: true })
  image: string;
  
  @Prop({ type: String, required: true })
  thumbnail: string;
  
  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  usageInstructions: string;

  @Prop({ type: String })
  brand?: string;

  @Prop({ type: Number })
  rating?: number;

  @Prop({ type: Number })
  reviews?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);