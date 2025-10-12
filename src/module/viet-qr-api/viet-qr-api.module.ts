import { Module } from '@nestjs/common';
import { VietQrApiService } from './viet-qr-api.service';
import { VietQrApiController } from './viet-qr-api.controller';
import { CustomLoggerModule } from '../custom_logger/custom_logger.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CustomLoggerModule
  ],
  providers: [
    ConfigService,
    VietQrApiService
  ],
  controllers: [VietQrApiController]
})
export class VietQrApiModule {}
