
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IOrder, IOrderItem } from "../shared/interface/order.interface";
import { IsOrderItemsValid, IsPaymentMethodValid, IsStatusValid } from "../shared/custom-validator/custom-validator";
import { TOrderStatus } from "../shared/interface/status.interface";
import { Type } from "class-transformer";
import { TPaymentMethod } from "../shared/interface/payment.interface";

export class OrderDto implements IOrder {
  @IsString({ message: 'The orderCode must be a string' })
  @IsNotEmpty({ message: 'The orderCode is required' })
  orderCode: string;

  @IsStatusValid({ message: 'The status is not valid' })
  status: TOrderStatus;

  @IsNotEmpty({ message: 'The orderDate is required' })
  @IsDate({ message: 'The orderDate must be a date' })
  @Type(() => Date)
  orderDate: Date;

  @IsNotEmpty({ message: 'The deliveryDate is required' })
  @IsDate({ message: 'The deliveryDate must be a date' })
  @Type(() => Date)
  deliveryDate: Date;

  @IsNotEmpty({ message: 'The orderItems is required' })
  
  @IsOrderItemsValid({ message: 'The orderItems are not valid' })
  orderItems: IOrderItem[];

  @IsNotEmpty({ message: 'The total is required' })
  @IsNumber({}, { message: 'The total must be a number' })
  total: number;

  @IsPaymentMethodValid({ message: 'The paymentMethod is not valid' })
  paymentMethod: TPaymentMethod;
}