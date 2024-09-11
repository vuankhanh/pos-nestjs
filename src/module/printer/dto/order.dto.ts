
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IOrder, IOrderItem, TOrderStatus } from "../../../shared/interface/order.interface";
import { Type } from "class-transformer";
import { TPaymentMethod } from "../../../shared/interface/payment.interface";
import { PaymentMethod } from "src/constant/payment.constant";
import { OrderStatus } from "src/constant/status.constant";
import { IsValid } from "../shared/custom-validator/custom-validator";

const validateOrderItems = (orderItems: IOrderItem[]) => {
  return Array.isArray(orderItems) && orderItems.length > 0 && orderItems.every(item => 
    typeof item.productName === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.unit === 'string' &&
    typeof item.price === 'number'
  );
};

export class OrderDto implements IOrder {
  @IsString({ message: 'The orderCode must be a string' })
  @IsNotEmpty({ message: 'The orderCode is required' })
  orderCode: string;

  @IsEnum(OrderStatus, { message: 'The status is not valid' })
  status: TOrderStatus;

  @IsNotEmpty({ message: 'The orderDate is required' })
  @IsDate({ message: 'The orderDate must be a date' })
  @Type(() => Date)
  orderDate: Date;

  @IsNotEmpty({ message: 'The deliveryDate is required' })
  @IsDate({ message: 'The deliveryDate must be a date' })
  @Type(() => Date)
  deliveryDate: Date;

  @IsValid(validateOrderItems, { message: 'Order items are not valid' })
  orderItems: IOrderItem[];

  @IsNotEmpty({ message: 'The total is required' })
  @IsNumber({}, { message: 'The total must be a number' })
  total: number;

  @IsEnum(PaymentMethod, { message: 'The paymentMethod is not valid' })
  paymentMethod: TPaymentMethod;
}