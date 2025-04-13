import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Supplier, SupplierDocument } from './schema/supplier.schema';
import { Document, Types, FilterQuery, FlattenMaps } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomConflictException } from 'src/shared/exception/custom-exception';

@Injectable()
export class SupplierService implements IBasicService<Supplier> {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>
  ) { }

  async create(supplierData: Supplier): Promise<SupplierDocument> {
    try {
      const supplier = new this.supplierModel(supplierData);
      return await supplier.save();
    } catch (error) {
      if (error.code === 11000) {
        // Lỗi trùng lặp (duplicate key)
        throw new CustomConflictException('Supplier name đã tồn tại');
      }
      throw error;
    }
  }

  async getAll(filterQuery:FilterQuery<Supplier>, page: number, size: number): Promise<{ data: SupplierDocument[]; paging: IPaging; }> {
    const countTotal = await this.supplierModel.countDocuments(filterQuery);
        const productAggregate = await this.supplierModel.aggregate(
          [
            { $match: filterQuery },
            { $skip: size * (page - 1) },
            { $limit: size },
          ]
        );
    
        const metaData = {
          data: productAggregate,
          paging: {
            totalItems: countTotal,
            size: size,
            page: page,
            totalPages: Math.ceil(countTotal / size),
          }
        };
        
        return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Supplier>): Promise<SupplierDocument> {
    return await this.supplierModel.findOne(filterQuery);
  }

  async replace(filterQuery: FilterQuery<Supplier>, data: Supplier): Promise<SupplierDocument> {
    return await this.supplierModel.findOneAndReplace(filterQuery, data);
  }

  async modify(filterQuery: FilterQuery<Supplier>, data: Partial<Supplier>): Promise<SupplierDocument> {
    return await this.supplierModel.findOneAndUpdate(filterQuery, data, { new: true });
  }
  
  async remove(filterQuery: FilterQuery<Supplier>): Promise<SupplierDocument> {
    return await this.supplierModel.findOneAndDelete(filterQuery);
  }
  
}
