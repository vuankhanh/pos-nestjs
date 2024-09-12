import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IProduct } from '../../../shared/interface/product.interface';
import { Album } from 'src/module/album/schema/album.schema';
import { ObjectId } from 'mongodb';
export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product implements IProduct {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: true, unique: true, immutable: true })
  sku: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Boolean, required: true })
  availability: boolean;
  
  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Album.name })
  albumId: Types.ObjectId | string;

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

  constructor(product: IProduct) {
    this.name = product.name;
    this.category = product.category;
    this.sku = product.sku;
    this.price = product.price;
    this.availability = product.availability;
    this.unit = product.unit;
    this.description = product.description;
    this.usageInstructions = product.usageInstructions;
    this.brand = product.brand;
    this.rating = product.rating;
    this.reviews = product.reviews;
  }

  set updateAlbumId(albumId: string) {
    this.albumId = ObjectId.createFromHexString(albumId);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);