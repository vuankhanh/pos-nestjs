import { Module } from '@nestjs/common';
import { ProductModule } from './module/product/product.module';
import { CustomerModule } from './module/customer/customer.module';
import { OrderModule } from './module/order/order.module';
import { PaymentModule } from './module/payment/payment.module';
import { MongodbProvider } from './provider/database/mongodb.provider';
import { PrinterModule } from './module/printer/printer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbProvider,
    }),
    ProductModule,
    CustomerModule,
    OrderModule,
    PaymentModule,
    PrinterModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number;
  constructor(
    private configService: ConfigService
  ) {
    AppModule.port = this.configService.get<number>('app.port');
  }
}
