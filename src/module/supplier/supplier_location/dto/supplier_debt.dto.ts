import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ISupplierDebt } from "src/shared/interface/supplier_location.interface";

export class SupplierDebtDto implements ISupplierDebt {
  @IsNotEmpty({ message: 'The amount is required' })
  @IsNumber({}, { message: 'The amount must be a number' })
  amount: number; // Amount owed to the supplier

  @IsNotEmpty({ message: 'The note is required' })
  @IsString({ message: 'The note must be a string' })
  note: string; // Additional notes (optional)
}