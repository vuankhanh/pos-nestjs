import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Order, OrderDocument } from './schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FilterQuery, FlattenMaps, Model, Types } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { Customer } from '../customer/schema/customer.schema';

@Injectable()
export class OrderService implements IBasicService<Order> {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) { }

  async create(data: Order): Promise<OrderDocument> {
    const order = new this.orderModel(data);
    await order.save();
    return order;
  }

  getAll(filterQuery: FilterQuery<Order>, page: number, size: number): Promise<{ data: FlattenMaps<Order>[]; paging: IPaging; }> {
    throw new Error('Method not implemented.');
  }

  async getDetail(filterQuery: FilterQuery<Order>): Promise<OrderDocument> {
    return await this.tranformToDetaiData(filterQuery);
  }

  async replace(filterQuery: FilterQuery<Order>, data: Order): Promise<OrderDocument> {
    await this.orderModel.findOneAndReplace(filterQuery, data);
    const product = await this.tranformToDetaiData(filterQuery);
    return product;
  }

  async modify(filterQuery: FilterQuery<Order>, data: Partial<Order>): Promise<OrderDocument> {
    await this.orderModel.findOneAndUpdate(filterQuery, data, { new: true, upsert: true });
    const product = await this.tranformToDetaiData(filterQuery);
    return product;
  }

  async remove(filterQuery: FilterQuery<Order>): Promise<OrderDocument> {
    return await this.orderModel.findOneAndDelete(filterQuery);
  }

  private async tranformToDetaiData(filterQuery: FilterQuery<Order>): Promise<OrderDocument> {
    return await this.orderModel.aggregate(
      [
        { $match: filterQuery },
        {
          $lookup: {
            from: Customer.name.toLowerCase(), // Tên của bộ sưu tập Customer
            localField: 'customerId',
            foreignField: '_id',
            as: 'customerDetail'
          }
        },
        {
          $unwind: {
            path: '$customerDetail',
            preserveNullAndEmptyArrays: true // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          }
        }
      ]
    ).then((data) => data[0]);
  }
}
