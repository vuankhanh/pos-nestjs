import { Module } from '@nestjs/common';
import { ProductService } from './supplier_product.service';
import { SupplierProductController } from './supplier_product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier_Product, supplierProductSchema } from './schema/supplier_product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Supplier_Product.name,
        schema: supplierProductSchema,
        collection: Supplier_Product.name.toLowerCase()
      }
    ]),
  ],
  controllers: [
    SupplierProductController
  ],
  providers: [ProductService]
})
export class ProductModule { }
