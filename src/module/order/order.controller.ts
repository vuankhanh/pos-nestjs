import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { OrderDto, UpdateOrderDto } from './dto/order.dto';
import { Order } from './schema/order.schema';
import { ObjectId } from 'mongodb';

@Controller('order')
// @UseGuards(AuthGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class OrderController {
  constructor(
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
    order.updateCustomerId = orderDto.customerId;

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
    const data: Partial<Order> = {
      ...orderDto,
      customerId: orderDto.customerId ? ObjectId.createFromHexString(orderDto.customerId) : undefined
    };

    console.log(data);
    

    return await this.orderService.modify(filterQuery, data);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.orderService.remove(filterQuery);
  }
}