import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { VnPublicApisModule } from '../vn-public-apis/vn-public-apis.module';
import { CustomLoggerModule } from '../custom_logger/custom_logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, supplierSchema } from './schema/supplier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Supplier.name,
        schema: supplierSchema,
        collection: Supplier.name.toLowerCase()
      }
    ]),
    CustomLoggerModule,
    VnPublicApisModule
  ],
  controllers: [SupplierController],
  providers: [SupplierService]
})
export class SupplierModule { }
