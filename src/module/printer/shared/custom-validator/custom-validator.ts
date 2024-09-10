import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { OrderStatus } from 'src/constant/status.constant';
import { TOrderStatus } from '../interface/status.interface';
import { PaymentMethod } from 'src/constant/payment.constant';
import { TPaymentMethod } from '../interface/payment.interface';
import { IOrderItem } from '../interface/order.interface';

// Custom validator for status
@ValidatorConstraint({ async: false })
export class IsStatusValidConstraint implements ValidatorConstraintInterface {
  validate(status: TOrderStatus, args: ValidationArguments) {
    // Chuyển enum thành array
    const orderStatusArray = Object.values(OrderStatus) as string[];
    // Add your custom validation logic here
    return typeof status === 'string' && orderStatusArray.includes(status);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Status is not valid!';
  }
}

export function IsStatusValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStatusValidConstraint,
    });
  };
}

// Custom validator for customer
@ValidatorConstraint({ async: false })
export class IsCustomerValidConstraint implements ValidatorConstraintInterface {
  validate(customer: any, args: ValidationArguments) {
    // Add your custom validation logic here
    return typeof customer === 'object' && customer !== null; // Example validation
  }

  defaultMessage(args: ValidationArguments) {
    return 'Customer is not valid!';
  }
}

export function IsCustomerValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCustomerValidConstraint,
    });
  };
}

// Custom validator for orderItems
@ValidatorConstraint({ async: false })
export class IsOrderItemsValidConstraint implements ValidatorConstraintInterface {
  validate(orderItems: IOrderItem[], args: ValidationArguments) {
    // Add your custom validation logic here
    return Array.isArray(orderItems) && orderItems.length > 0 && orderItems.every(item => 
      typeof item.productName === 'string' &&
      typeof item.quantity === 'number' &&
      typeof item.unit === 'string' &&
      typeof item.price === 'number'
    ); // Example validation
  }

  defaultMessage(args: ValidationArguments) {
    return 'Order items are not valid!';
  }
}

export function IsOrderItemsValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOrderItemsValidConstraint,
    });
  };
}

// Custom validator for paymentMethod
@ValidatorConstraint({ async: false })
export class IsPaymentMethodValidConstraint implements ValidatorConstraintInterface {
  validate(paymentMethod: TPaymentMethod, args: ValidationArguments) {
    const paymentMethodArray = Object.values(PaymentMethod) as string[];
    // Add your custom validation logic here
    return typeof paymentMethod === 'string' && paymentMethodArray.includes(paymentMethod); // Example validation
  }

  defaultMessage(args: ValidationArguments) {
    return 'Payment method is not valid!';
  }
}

export function IsPaymentMethodValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPaymentMethodValidConstraint,
    });
  };
}