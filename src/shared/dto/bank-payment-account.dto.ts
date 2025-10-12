import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IBank } from "../interface/vietqr.interface";

export class BankPaymentAccountDto implements IBank {
  @IsNotEmpty({ message: 'id là bắt buộc' })
  @IsNumber({}, { message: 'id phải là số' })
  id: number;

  @IsNotEmpty({ message: 'name là bắt buộc' })
  @IsString({ message: 'name phải là chuỗi' })
  name: string;

  @IsNotEmpty({ message: 'code là bắt buộc' })
  @IsString({ message: 'code phải là chuỗi' })
  code: string;
 
  @IsNotEmpty({ message: 'bin là bắt buộc' })
  @IsString({ message: 'bin phải là chuỗi' })
  bin: string;

  @IsNotEmpty({ message: 'short name là bắt buộc' })
  @IsString({ message: 'short name phải là chuỗi' })
  shortName: string;

  @IsNotEmpty({ message: 'logo là bắt buộc' })
  @IsString({ message: 'logo phải là chuỗi' })
  logo: string;

  @IsNotEmpty({ message: 'transfer supported là bắt buộc' })
  @IsNumber({}, { message: 'transfer supported phải là số' })
  transferSupported: number;

  @IsNotEmpty({ message: 'lookup supported là bắt buộc' })
  @IsNumber({}, { message: 'lookup supported phải là số' })
  lookupSupported: number;
}