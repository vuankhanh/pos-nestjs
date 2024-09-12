import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { Product } from './schema/product.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { ObjectId } from 'mongodb';

//1. Guards: Được sử dụng để bảo vệ các route.
//2.Interceptors: Được sử dụng để thay đổi hoặc mở rộng hành vi của các method.
//3. Pipes: Được sử dụng để biến đổi hoặc xác thực dữ liệu.
@Controller('product')
// @UseGuards(AuthGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(ValidationPipe)
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @Get()
  
  async getAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10
  ) {
    return await this.productService.getAll({}, page, size);
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };
    return await this.productService.getDetail(filterQuery);
  }

  @Post()
  async create(
    @Body() productDto: ProductDto
  ) {
    const product = new Product(productDto);
    product.updateAlbumId = productDto.albumId;

    return await this.productService.create(product);
  }

  @Put(':id')
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() productDto: ProductDto
  ) {
    const filterQuery = { _id: id };
    const product = new Product(productDto);
    product.updateAlbumId = productDto.albumId;

    return await this.productService.replace(filterQuery, product);
  }

  @Patch(':id')
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() productDto: Partial<ProductDto>
  ) {
    const filterQuery = { _id: id };
    const data: Partial<Product> = productDto;

    if (productDto.albumId) data.albumId = ObjectId.createFromHexString(productDto.albumId);
    
    return await this.productService.modify(filterQuery, data);
  }
}
