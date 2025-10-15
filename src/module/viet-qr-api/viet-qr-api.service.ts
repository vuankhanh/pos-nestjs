import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../custom_logger/custom_logger.service';
import { ConfigService } from '@nestjs/config';
import { IBank, IBankResponse, IQrCode, IQrCodeResponse } from 'src/shared/interface/vietqr.interface';
import axios, { AxiosResponse } from 'axios';
import { VietQR } from 'vietqr';
@Injectable()
export class VietQrApiService {
  // private vietQrApi: string;
  private readonly vietQR: VietQR;
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly configService: ConfigService
  ) {
    const vietQrApi = this.configService.get('vietQrApi');
    // this.vietQrApi = `${vietQrApi.protocol}://${vietQrApi.host}:${vietQrApi.port}`;
    const clientID = vietQrApi.clientId;
    const apiKey = vietQrApi.apiKey;
    this.vietQR = new VietQR({
      clientID,
      apiKey
    });
  }

  // async getBanks(): Promise<IBank[]> {
  //   const url = `${this.vietQrApi}/v2/banks`;
  //   return axios.get<IBankResponse>(url).then(res => res.data).then(res => res.data);
  // }

  async getBanks(): Promise<IBank[]> {
    return this.vietQR.getBanks().then((data: IBankResponse) => data.data);
  }

  // async generateQrCode(
  //   bankBin: string,
  //   accountNumber: string,
  //   accountName: string,
  //   amount: number,
  //   addInfo: string,
  //   templateId: string = 'i7Malbk',
  //   imgExtension: string = 'png'
  // ): Promise<AxiosResponse> {
  //   try {
  //     const url = `${this.vietQrApi}/image/${bankBin}-${accountNumber}-${templateId}.${imgExtension}`;
  //     const params = { accountName, amount, addInfo };
  //     return axios.get(url, { params, responseType: 'arraybuffer' });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async generateQrCode(
    bank: string,
    accountNumber: string,
    accountName: string,
    amount: number,
    memo: string,
    templateId: string = 'i7Malbk',
    imgExtension: string = 'png'
  ): Promise<IQrCode> {
    return await this.vietQR.genQRCodeBase64({
      bank,
      accountNumber,
      accountName: 'something',
      amount,
      memo,
      template: templateId,
      media: imgExtension
    }).then((res: AxiosResponse) => res.data).then((data: IQrCodeResponse) => data.data);
  }
}