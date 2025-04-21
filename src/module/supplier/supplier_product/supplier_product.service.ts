import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Supplier_Product, SupplierProductDocument } from './schema/supplier_product.schema';
import { Document, Types, FilterQuery, FlattenMaps, Model } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CustomConflictException } from 'src/shared/exception/custom-exception';

@Injectable()
export class SupplierProductService implements IBasicService<Supplier_Product> {
  constructor(
    @InjectModel(Supplier_Product.name) private supplierProductModel: Model<Supplier_Product>
  ) { }

  async create(data: Supplier_Product): Promise<SupplierProductDocument> {
    try {
      const supplierProduct = new this.supplierProductModel(data);

      return await supplierProduct.save();
    } catch (error) {
      if (error.code === 11000) {
        // Lỗi trùng lặp (duplicate key)
        throw new CustomConflictException('Supplier product name đã tồn tại');
      }
      throw new Error(error);
    }
  }

  async getAll(filterQuery: FilterQuery<Supplier_Product>, page: number, size: number): Promise<{ data: SupplierProductDocument[]; paging: IPaging; }> {
    const countTotal = await this.supplierProductModel.countDocuments(filterQuery);
    const supplierProductAggregate = await this.supplierProductModel.aggregate(
      [
        { $match: filterQuery },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: supplierProductAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };

    return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Supplier_Product>): Promise<SupplierProductDocument> {
    return await this.supplierProductModel.findOne(filterQuery);
  }

  async replace(filterQuery: FilterQuery<Supplier_Product>, data: Supplier_Product): Promise<SupplierProductDocument> {
    return await this.supplierProductModel.findOneAndReplace(filterQuery, data);
  }

  async modify(filterQuery: FilterQuery<Supplier_Product>, data: Partial<Supplier_Product>): Promise<SupplierProductDocument> {
    return await this.supplierProductModel.findOneAndUpdate(filterQuery, data, { new: true });
  }

  async remove(filterQuery: FilterQuery<Supplier_Product>): Promise<SupplierProductDocument> {
    return await this.supplierProductModel.findOneAndDelete(filterQuery);
  }
}
