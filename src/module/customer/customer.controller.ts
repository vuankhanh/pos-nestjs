import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';
import { Customer } from './schema/customer.schema';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { CsvUtil } from 'src/shared/util/csv.util';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService
  ) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getAll(
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };
    
    const metaData = await this.customerService.getAll(filterQuery, page, size);

    return metaData;
  }

  @Get(':id')
  @UseInterceptors(FormatResponseInterceptor)
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };
    return await this.customerService.getDetail(filterQuery);
  }

  @Post()
  @UseInterceptors(FormatResponseInterceptor)
  async create(
    @Body() customerDto: CustomerDto
  ) {
    const customer: Customer = new Customer(customerDto);
    return await this.customerService.create(customer);
  }

  @Post('/upload-csv')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('csv', memoryStorageMulterOptions),
    FormatResponseInterceptor
  )
  async uploadVcf(
    @UploadedFile() file: Express.Multer.File
  ) {
    const json = await CsvUtil.convertCsvToJson(file.buffer);
    const customers: Array<Customer> = CsvUtil.transformArrJsonContactToArrCustomer(json);
    const customerCol = await this.customerService.insertMany(customers);
    return customerCol;
  }

  @Put(':id')
  @UseInterceptors(FormatResponseInterceptor)
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() customerDto: CustomerDto
  ) {
    const filterQuery = { _id: id };
    const customer: Customer = new Customer(customerDto);
    return await this.customerService.replace(filterQuery, customer);
  }

  @Patch(':id')
  @UseInterceptors(FormatResponseInterceptor)
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() customerDto: Partial<CustomerDto>
  ) {
    const filterQuery = { _id: id };
    const data: Partial<Customer> = customerDto;
    return await this.customerService.modify(filterQuery, data);
  }

  @Delete(':id')
  @UseInterceptors(FormatResponseInterceptor)
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const filterQuery = { _id: id };
    return await this.customerService.remove(filterQuery);
  }
}
