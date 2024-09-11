import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { ConfigService } from '@nestjs/config';
import { PdfService } from './pdf/pdf.service';
import { OrderDto } from './dto/order.dto';
import { CustomerDto } from './dto/customer.dto';
import { Order } from '../../shared/interface/order.interface';
import { Customer } from '../../shared/interface/customer.interface';
import { IFooterTemplate, Template } from '../../shared/interface/template.interface';

@Controller('print')
export class PrinterController {
  constructor(
    private configService: ConfigService,
    private readonly printerService: PrinterService,
    private readonly pdfService: PdfService,
  ) { }
  
  @Post('') 
  @UsePipes(ValidationPipe)
  async print(@Body('order') orderDto: OrderDto, @Body('customer') customerDto: CustomerDto) {
    const order: Order = new Order(orderDto);
    const customer: Customer = new Customer(customerDto);
    const footer: IFooterTemplate = this.configService.get<IFooterTemplate>('brand');
    const template: Template = new Template(customer, order, footer);

    try {
      const pdf = await this.printerService.print(template);
      return pdf;
    } catch (error) {
      throw error;
    }
  }
}