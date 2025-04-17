import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';

@Controller('supplier')
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(ValidationPipe)
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.supplierService.getAll(filterQuery, page, size);
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.supplierService.getDetail(filterQuery);
  }

  @Post()
  async create(
    @Body() supplierDto: SupplierDto
  ) {
    console.log(supplierDto);

    return await this.supplierService.create(supplierDto);
  }

  @Put(':id')
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() productDto: SupplierDto
  ) {
    const filterQuery = { _id: id };

    return await this.supplierService.replace(filterQuery, productDto);
  }

  @Patch(':id')
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() productDto: UpdateSupplierDto
  ) {
    const filterQuery = { _id: id };
    
    return await this.supplierService.modify(filterQuery, productDto);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const filterQuery = { _id: id };
    return await this.supplierService.remove(filterQuery);
  }
}
