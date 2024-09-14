
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IOrder, IOrderItem, TOrderStatus } from "../../../shared/interface/order.interface";
import { TPaymentMethod } from "../../../shared/interface/payment.interface";
import { PaymentMethod } from "src/constant/payment.constant";
import { OrderStatus } from "src/constant/status.constant";
import { IsValid } from "../../../shared/custom-validator/custom-validator";
import { PartialType } from "@nestjs/mapped-types";
import { Types } from "mongoose";
import { Transform } from "class-transformer";
import { ObjectId } from "mongodb";

const validateOrderItems = (orderItems: IOrderItem[]) => {
  return Array.isArray(orderItems) && orderItems.length > 0 && orderItems.every(item => 
    typeof item.productName === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.unit === 'string' &&
    typeof item.price === 'number'
  );
};

export class OrderDto implements IOrder {  
  @IsValid(validateOrderItems, { message: 'Order items are not valid' })
  orderItems: IOrderItem[];

  @IsEnum(OrderStatus, { message: 'The status is not valid' })
  status: TOrderStatus;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'The paymentMethod is not valid' })
  paymentMethod?: TPaymentMethod;

  @IsMongoId({ message: 'The customerId must be a valid ObjectId' })
  customerId: string;
  
  @IsOptional()
  @IsString({ message: 'The note must be a string' })
  note?: string;
}

export class UpdateOrderDto extends PartialType(OrderDto) {}