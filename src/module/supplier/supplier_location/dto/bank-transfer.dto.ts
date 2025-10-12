import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsStringOrNumber } from "src/shared/dto/coordinates.dto";
import { IBankPayment } from "src/shared/interface/bank-payment.interface";

export class BankTransferDto implements IBankPayment {
  @IsNotEmpty({ message: 'bankBin là bắt buộc' })
  @IsString({ message: 'bankBin phải là chuỗi' })
  bankBin: string;

  @IsNotEmpty({ message: 'bankAvatar là bắt buộc' })
  @IsString({ message: 'bankAvatar phải là chuỗi' })
  bankAvatar: string;

  @IsNotEmpty({ message: 'bankShortName là bắt buộc' })
  @IsString({ message: 'bankShortName phải là chuỗi' })
  bankShortName: string;

  @IsNotEmpty({ message: 'bankName là bắt buộc' })
  @IsString({ message: 'bankName phải là chuỗi' })
  bankName: string;

  @IsNotEmpty({ message: 'Account number là bắt buộc' })
  @IsStringOrNumber({ message: 'Account number phải là chuỗi hoặc số' })
  accountNumber: string;

  @IsOptional()
  @IsString({ message: 'Account name phải là chuỗi' })
  accountName: string;
}