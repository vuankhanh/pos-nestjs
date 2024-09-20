import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as print from 'pdf-to-printer';
import { FileUtil } from '../../shared/util/file.util';
import { PdfService } from './pdf/pdf.service';
import { Template } from '../../shared/interface/template.interface';

@Injectable()
export class PrinterService {
  constructor(
    private configService: ConfigService,
    private readonly pdfService: PdfService,
  ) { }

  async print(temp: Template): Promise<Uint8Array> {
    console.log('print', temp);
    
    const printerName = this.configService.get<string>('printer.name');
    const assetsFolder = this.configService.get<string>('folder.assets');
    
    const htmlFile = assetsFolder+`/template/template_${temp.order.customerPhoneNumber  ? 'default' : 'walk_in_customer'}.html` 

    const readHtml = await FileUtil.read(htmlFile); 
    const result = await this.pdfService.createPdfFromHTML(readHtml, temp);
    
    await this.printPdf(result.filePath, printerName).then(async _ => {
      await FileUtil.remove(result.filePath);
    });

    return result.buffer;
  }

  private printPdf(pdfPath: string, printerName: string): Promise<void> {
    return print.print(pdfPath, { printer: printerName });
  }
}