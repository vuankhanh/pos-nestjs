import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { PurchaseOrderDto } from './dto/purchase_order.dto';
import { PurchaseOrderService } from './purchase_order.service';
import { PurchaseOrderItem } from './schema/purchase_order_item.schema';
import { Purchase_Order } from './schema/purchase_order.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';

@Controller('purchase-order')
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor)
export class PurchaseOrderController {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.purchaseOrderService.getAll(filterQuery, page, size);
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.purchaseOrderService.getDetail(filterQuery);
  }

  @Post()
  async createPurchaseOrder(
    @Body() purchaseOrderDto: PurchaseOrderDto
  ) {
    const purchaseOrderItem = purchaseOrderDto.purchaseOrderItems.map(item => {
      const purchaseOrderItem: PurchaseOrderItem = new PurchaseOrderItem(item);
      return purchaseOrderItem;
    });

    const purchaseOrder: Purchase_Order = new Purchase_Order(
      purchaseOrderDto.status,
      purchaseOrderItem
    );

    // this.purchaseOrderService.create(purchaseOrderDto);
    // Logic to create a purchase order
    return await this.purchaseOrderService.create(purchaseOrder);
  }

  @Put(':id')
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() purchaseOrderDto: PurchaseOrderDto
  ) {
    const purchaseOrderItem = purchaseOrderDto.purchaseOrderItems.map(item => {
      const purchaseOrderItem: PurchaseOrderItem = new PurchaseOrderItem(item);
      return purchaseOrderItem;
    });

    const purchaseOrder: Purchase_Order = new Purchase_Order(
      purchaseOrderDto.status,
      purchaseOrderItem
    );

    // this.purchaseOrderService.create(purchaseOrderDto);
    // Logic to create a purchase order
    return await this.purchaseOrderService.create(purchaseOrder);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.purchaseOrderService.remove(filterQuery);
  }
}
