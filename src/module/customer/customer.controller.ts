import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';
import { Customer } from './schema/customer.schema';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService
  ) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getAll() {
    const page = 1;
    const size = 10;
    const metaData = await this.customerService.getAll(page, size);

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
