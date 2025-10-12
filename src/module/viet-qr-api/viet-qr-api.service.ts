import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../custom_logger/custom_logger.service';
import { ConfigService } from '@nestjs/config';
import { IBank } from 'src/shared/interface/vietqr.interface';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class VietQrApiService {
  private vietQrApi: string; 

  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly configService: ConfigService
  ) {
    const vietQrApi = this.configService.get('vietQrApi');
    this.vietQrApi = `${vietQrApi.protocol}://${vietQrApi.host}:${vietQrApi.port}`;
  }

  async getBanks(): Promise<IBank[]>{
    const url = `${this.vietQrApi}/v2/banks`;
    return axios.get<TBankResponse>(url).then(res => res.data).then(res => res.data);
  }

  async generateQrCode(
    bankBin: string,
    accountNumber: string,
    accountName: string,
    amount: number,
    addInfo: string,
    templateId: string = 'i7Malbk',
    imgExtension: string = 'png'
  ): Promise<AxiosResponse> {
    try {
      const url = `${this.vietQrApi}/image/${bankBin}-${accountNumber}-${templateId}.${imgExtension}`;
      const params = { accountName, amount, addInfo };
      return axios.get(url, { params, responseType: 'arraybuffer' });
    } catch (error) {
      throw error;
    }
  }
}

export type TBankResponse = {
  code: string,
  desc: string,
  data: IBank[],
} 
