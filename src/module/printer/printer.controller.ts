import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { ConfigService } from '@nestjs/config';
import { PdfService } from './pdf/pdf.service';
import { OrderDto } from '../order/dto/order.dto';
import { IFooterTemplate, Template } from '../../shared/interface/template.interface';
import { Order } from '../order/schema/order.schema';

@Controller('print')
export class PrinterController {
  constructor(
    private configService: ConfigService,
    private readonly printerService: PrinterService,
    private readonly pdfService: PdfService,
  ) { }
  
  @Post('') 
  @UsePipes(ValidationPipe)
  async print(@Body('order') orderDto: OrderDto) {
    const order: Order = new Order(orderDto);
    const footer: IFooterTemplate = this.configService.get<IFooterTemplate>('brand');
    const template: Template = new Template(order, footer);

    try {
      const pdf = await this.printerService.print(template);
      return pdf;
    } catch (error) {
      throw error;
    }
  }
}