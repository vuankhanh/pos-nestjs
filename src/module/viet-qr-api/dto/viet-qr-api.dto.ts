import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GenerateQrCodeDto {
  @IsNotEmpty({ message: 'Mã ngân hàng không được để trống' })
  @IsString({ message: 'Mã ngân hàng phải là chuỗi' })
  bankBin: string;

  @IsNotEmpty({ message: 'Số tài khoản không được sé trống' })
  @IsString({ message: 'Số tài khoản phải là chuỗi' })
  accountNumber: string;

  @IsNotEmpty({ message: 'AccountName không được để trống' })
  @IsString({ message: 'AccountName phải là chuỗi' })
  accountName: string;

  @IsNotEmpty({ message: 'Số tiền không được để trống' })
  @IsNumber({}, { message: 'Số tiền phải là số' })
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsOptional()
  @IsString({ message: 'AddInfo phải là chuỗi' })
  addInfo: string;
}