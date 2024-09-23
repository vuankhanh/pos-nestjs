import { Module } from '@nestjs/common';
import { ProductModule } from './module/product/product.module';
import { CustomerModule } from './module/customer/customer.module';
import { OrderModule } from './module/order/order.module';
import { PaymentModule } from './module/payment/payment.module';
import { MongodbProvider } from './provider/database/mongodb.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumModule } from './module/album/album.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './module/auth/auth.module';
import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: path.join(__dirname, '.env'), //Phải định nghĩa mặc định ở đây vì khi chạy pm2 thì location (the project root directory) sẽ khác
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbProvider,
    }),
    JwtModule.register({ global: true }),
    AlbumModule,
    ProductModule,
    CustomerModule,
    OrderModule,
    PaymentModule,
    AuthModule
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
