export interface IBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number
}

export interface IQrCode{
  qrCode: string;
  qrDataURL: string;
  accountName: string;
}

export interface IQrCodeSuccessResponse {
  code: string;
  desc: string;
  data: any;
}

export interface IBankResponse extends IQrCodeSuccessResponse {
  data: IBank[];
}

export interface IQrCodeResponse extends IQrCodeSuccessResponse {
  data: IQrCode;
}