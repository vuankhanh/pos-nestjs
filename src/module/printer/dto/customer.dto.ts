import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ICustomer } from "../shared/interface/customer.interface";

export class CustomerDto implements ICustomer {
  @IsNotEmpty({ message: 'The name is required' })
  @IsString({ message: 'The name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'The phoneNumber is required' })
  @IsString({ message: 'The phoneNumber must be a string' })
  phoneNumber: string;

  @IsOptional()
  @IsString({ message: 'The email must be a string' })
  email: string;

  @IsOptional()
  @IsString({ message: 'The dob must be a string' })
  dob: string;

  @IsNotEmpty({ message: 'The address is required' })
  @IsString({ message: 'The address must be a string' })
  address: string;

  @IsOptional()
  @IsString({ message: 'The company must be a string' })
  company: string;

  @IsOptional()
  @IsString({ message: 'The note must be a string' })
  note: string;
  level: string;
}