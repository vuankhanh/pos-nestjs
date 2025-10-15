import { Controller, Get, Header, HttpStatus, Query, Res, StreamableFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { VietQrApiService } from './viet-qr-api.service';
import { GenerateQrCodeDto } from './dto/viet-qr-api.dto';
// import { AxiosResponse } from 'axios';
import { Response } from 'express';

@Controller('viet-qr-api')
@UseGuards(AuthGuard)
export class VietQrApiController {
  constructor(
    private readonly vietQrApiService: VietQrApiService
  ) { }

  // @Get('banks')
  // @UseInterceptors(FormatResponseInterceptor)
  // async getBanks() {
  //   return this.vietQrApiService.getBanks();
  // }

  @Get('banks')
  @UseInterceptors(FormatResponseInterceptor)
  async getBank() {
    return this.vietQrApiService.getBanks();
  }

  // @Get('generate-qr-code')
  // async generateQrCode(
  //   @Res() res: Response,
  //   @Query(new ValidationPipe({ transform: true })) generateQrCodeDto: GenerateQrCodeDto,
  // ) {
  //   const { bankBin, accountNumber, accountName, amount, addInfo } = generateQrCodeDto;
  //   const imageResponse: AxiosResponse = await this.vietQrApiService.generateQrCode(
  //     bankBin,
  //     accountNumber,
  //     accountName,
  //     amount,
  //     addInfo
  //   );
  //   const buffer = Buffer.from(imageResponse.data); // Convert ArrayBuffer to Buffer
  //   const contentType = imageResponse.headers['content-type'] || 'application/octet-stream';

  //   res.set('Content-Type', contentType);
  //   res.status(200).send(buffer); // Express sends the buffer directly
  // }

  @Get('generate-qr-code')
  async generateQrCodeTest(
    @Res() res: Response,
    @Query(new ValidationPipe({ transform: true })) generateQrCodeDto: GenerateQrCodeDto,
  ) {
    const { bankBin, accountNumber, accountName, amount, addInfo } = generateQrCodeDto;
    const qrCode = await this.vietQrApiService.generateQrCode(
      bankBin,
      accountNumber,
      accountName,
      amount,
      addInfo
    );

    const base64StringWithPrefix = qrCode.qrDataURL;

    // Tách MIME type và dữ liệu
    const parts = base64StringWithPrefix.split(',');
    if (parts.length !== 2) {
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid Base64 format');
    }

    const mimeTypeInfo = parts[0];
    const base64Data = parts[1];

    const contentTypeMatch = mimeTypeInfo.match(/data:(.*?);/);
    const contentType = contentTypeMatch ? contentTypeMatch[1] : null;

    if (!contentType || !contentType.startsWith('image/')) {
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid image MIME type');
    }
    try {
      const imageBuffer = Buffer.from(base64Data, 'base64');

      res.set({
        'Content-Type': contentType,
        'Content-Length': imageBuffer.length,
      });

      res.status(HttpStatus.OK).send(imageBuffer);

    } catch (error) {
      console.error('Error decoding Base64 image:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error processing image');
    }
  }
}
