import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { OrderDto, UpdateOrderDto } from './dto/order.dto';
import { Order } from './schema/order.schema';
import { ObjectId } from 'mongodb';
import { IFooterTemplate, Template } from 'src/shared/interface/template.interface';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from 'src/constant/status.constant';
import { OrderUtil } from 'src/shared/util/order.util';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('order')
@UseGuards(AuthGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class OrderController {
  constructor(
    private configService: ConfigService,
    private readonly orderService: OrderService,
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.orderService.getAll(filterQuery, page, size);
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.orderService.getDetail(filterQuery);
  }

  @Post()
  async create(
    @Body() orderDto: OrderDto
  ) {
    const order = new Order(orderDto);
    if (orderDto.customerDeliveryAddress) order.updateCustomerDeliveryAddress = orderDto.customerDeliveryAddress;
    if (orderDto.customerName) order.updateCustomerInfo = {
      name: orderDto.customerName,
      phoneNumber: orderDto.customerPhoneNumber,
      address: orderDto.customerAddress
    };

    if (orderDto.customerId) order.updateCustomerId = orderDto.customerId;

    return await this.orderService.create(order);
  }

  @Put(':id')
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() orderDto: OrderDto
  ) {
    const filterQuery = { _id: id };
    const order = new Order(orderDto);
    order.updateCustomerId = orderDto.customerId;

    return await this.orderService.replace(filterQuery, order);
  }

  @Patch(':id')
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() orderDto: UpdateOrderDto
  ) {
    const filterQuery = { _id: id };

    const data: Partial<Order> = orderDto;
    // Lấy đơn hàng hiện tại từ cơ sở dữ liệu
    const currentOrder = await this.orderService.findById(id);

    // Cập nhật các thuộc tính thay đổi
    if (orderDto.orderItems) currentOrder.orderItems = OrderUtil.transformOrderItems(orderDto.orderItems);
    if (orderDto.deliveryFee !== undefined) currentOrder.deliveryFee = orderDto.deliveryFee;
    if (orderDto.discount !== undefined) currentOrder.discount = orderDto.discount;

    // Tính lại tổng số nếu các thuộc tính liên quan thay đổi
    if (orderDto.orderItems || orderDto.deliveryFee !== undefined || orderDto.discount !== undefined) {
      const subTotal = OrderUtil.calculateSubTotal(currentOrder.orderItems);
      data.total = OrderUtil.calculateTotal(subTotal, currentOrder.deliveryFee, currentOrder.discount);
    }

    if (orderDto.customerId) data.customerId = ObjectId.createFromHexString(orderDto.customerId);

    if (orderDto.customerName) {
      data.customerName = orderDto.customerName;
    }

    if (orderDto.customerAddress) {
      data.customerAddress = orderDto.customerAddress;
    }

    if (orderDto.customerPhoneNumber) {
      data.customerPhoneNumber = orderDto.customerPhoneNumber;
    }

    return await this.orderService.modify(filterQuery, data);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.orderService.remove(filterQuery);
  }

  @Post(':id/print')
  async print(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const orderDetail = await this.orderService.getDetail({ _id: id });
    if (![OrderStatus.CONFIRMED, OrderStatus.SHIPPING, OrderStatus.COMPLETED].includes(orderDetail.status as OrderStatus)) {
      throw new BadRequestException('Order status must be CONFIRMED, SHIPPING, or COMPLETED to print');
    }
    const order: Order = new Order(orderDetail);

    const customerInfo = {
      name: orderDetail.customerName,
      phoneNumber: orderDetail.customerPhoneNumber,
      address: orderDetail.customerAddress,
    }
    order.updateCustomerInfo = customerInfo;
    order.updateCustomerDeliveryAddress = orderDetail.customerDeliveryAddress;

    const footer: IFooterTemplate = this.configService.get<IFooterTemplate>('brand');
    const template: Template = new Template(order, footer);
    return await this.orderService.print(template);
  }
}