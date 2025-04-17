import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SupplierProductService } from './supplier_product.service';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { SupplierProductDto } from './dto/supplier_product.dto';
import { Supplier_Product } from './schema/supplier_product.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';

@Controller('supplier_product')
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(ValidationPipe)
export class SupplierProductController {
  constructor(
    private readonly supplierProductService: SupplierProductService
  ) {}

  @Get()
    async getAll(
      @Query('name') name: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
    ) {
      const filterQuery = {};
      if (name) filterQuery['name'] = { $regex: name, $options: 'i' };
  
      return await this.supplierProductService.getAll(filterQuery, page, size);
    }
  
    @Get(':id')
    async getDetail(
      @Param('id', new ParseObjectIdPipe()) id: string,
    ) {
      const filterQuery = { _id: id };
  
      return await this.supplierProductService.getDetail(filterQuery);
    }
  
    @Post()
    async create(
      @Body() supplierProductDto: SupplierProductDto
    ) {
      console.log(supplierProductDto);
      const supplierProduct = new Supplier_Product(supplierProductDto);
      supplierProduct.updateSupplierId = supplierProductDto.supplierId; // Set the supplierId to the given id
      return await this.supplierProductService.create(supplierProduct);
    }
  
    @Put(':id')
    async replace(
      @Param('id', new ParseObjectIdPipe()) id: string,
      @Body() supplierProductDto: SupplierProductDto
    ) {
      const filterQuery = { _id: id };
      const supplierProduct = new Supplier_Product(supplierProductDto);
      supplierProduct.updateSupplierId = id; // Set the supplierId to the given id
      return await this.supplierProductService.replace(filterQuery, supplierProduct);
    }
  
    // @Patch(':id')
    // async modify(
    //   @Param('id', new ParseObjectIdPipe()) id: string,
    //   @Body() productDto: UpdateSupplierDto
    // ) {
    //   const filterQuery = { _id: id };
      
    //   return await this.supplierProductService.modify(filterQuery, productDto);
    // }
  
    @Delete(':id')
    async delete(
      @Param('id', new ParseObjectIdPipe()) id: string
    ) {
      const filterQuery = { _id: id };
      return await this.supplierProductService.remove(filterQuery);
    }
}