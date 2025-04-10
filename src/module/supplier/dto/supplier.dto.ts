import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ISupplier } from "src/shared/interface/supplier.interface";
import { IProvince, IDistrict } from "src/shared/interface/vn-public-apis.interface";

export class SupplierDto implements ISupplier {
  @IsNotEmpty({ message: 'The supplier name is required' })
  @IsString({ message: 'The supplier name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'The address is required' })
  address: {
    province: IProvince; // Province object
    district: IDistrict; // District object
    ward: string; // Ward name
    street: string; // Street address
  };

  @IsNotEmpty({ message: 'The telephone is required' })
  @IsString({ message: 'The telephone must be a string' })
  telephone: string;

  @IsOptional()
  @IsEmail({}, { message: 'The email is not valid' }) 
  email?: string;

  @IsOptional()
  position?: { lat: number; lng: number; };

  @IsOptional()
  @IsString({ message: 'The url must be a string' })
  url?: string;

  @IsOptional()
  @IsString({ message: 'The taxID must be a string' })
  taxID?: string;

  @IsOptional()
  contactPoint?: { contactType: string; name: string; telephone: string; email: string; };

  @IsOptional()
  logo?: string;

  @IsOptional()
  sameAs?: string[];
}

export class UpdateSupplierDto extends PartialType(SupplierDto) { }