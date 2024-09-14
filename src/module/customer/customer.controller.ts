import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';
import { Customer } from './schema/customer.schema';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { CsvUtil } from 'src/shared/util/csv.util';
import { AuthGuard } from 'src/shared/guards/auth.guard';

//1. Guards: Được sử dụng để bảo vệ các route.
//2.Interceptors: Được sử dụng để thay đổi hoặc mở rộng hành vi của các method.
//3. Pipes: Được sử dụng để biến đổi hoặc xác thực dữ liệu.
@Controller('customer')
// @UseGuards(AuthGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(ValidationPipe)
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('size', ParseIntPipe) size: number = 10
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };
    
    const metaData = await this.customerService.getAll(filterQuery, page, size);

    return metaData;
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };
    return await this.customerService.getDetail(filterQuery);
  }

  @Post()
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
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() customerDto: CustomerDto
  ) {
    const filterQuery = { _id: id };
    const customer: Customer = new Customer(customerDto);
    return await this.customerService.replace(filterQuery, customer);
  }

  @Patch(':id')
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() customerDto: Partial<CustomerDto>
  ) {
    const filterQuery = { _id: id };
    const data: Partial<Customer> = customerDto;
    return await this.customerService.modify(filterQuery, data);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const filterQuery = { _id: id };
    return await this.customerService.remove(filterQuery);
  }
}
