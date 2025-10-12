import { Controller, Get, Header, Query, Res, StreamableFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { VietQrApiService } from './viet-qr-api.service';
import { GenerateQrCodeDto } from './dto/viet-qr-api.dto';
import { AxiosResponse } from 'axios';
import { Response } from 'express';

@Controller('viet-qr-api')
@UseGuards(AuthGuard)
export class VietQrApiController {
  constructor(
    private readonly vietQrApiService: VietQrApiService
  ) { }

  @Get('banks')
  @UseInterceptors(FormatResponseInterceptor)
  async getBanks() {
    return this.vietQrApiService.getBanks();
  }

  @Get('generate-qr-code')
  async generateQrCode(
    @Res() res: Response,
    @Query(new ValidationPipe({ transform: true })) generateQrCodeDto: GenerateQrCodeDto,
  ) {
    const { bankBin, accountNumber, accountName, amount, addInfo } = generateQrCodeDto;
    const imageResponse: AxiosResponse = await this.vietQrApiService.generateQrCode(
      bankBin,
      accountNumber,
      accountName,
      amount,
      addInfo
    );
    const buffer = Buffer.from(imageResponse.data); // Convert ArrayBuffer to Buffer
    const contentType = imageResponse.headers['content-type'] || 'application/octet-stream';

    res.set('Content-Type', contentType);
    res.status(200).send(buffer); // Express sends the buffer directly
  }
}
