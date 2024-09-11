import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { VietqrService } from '../vietqr/vietqr.service';
import { ITemplate } from '../../../shared/interface/template.interface';
import { IOrder } from '../../../shared/interface/order.interface';

@Injectable()
export class HtmlService {
  constructor(
    private vietqrService: VietqrService
  ) { }
  async mapToHtml(data: ITemplate, html: string) {
    const $ = cheerio.load(html);
    $('#cus_name').text(data.customer.name);
    $('#cus_phone_number').text(data.customer.phoneNumber);
    $('#cus_address').text(data.customer.address);
    $('#order').html(this.createOrderList(data.order));
    $('#order_total_bill').html(await this.createTotalBill(data.order));

    $('#footer_brand_name').text(data.footer.brandName);
    $('#footer_brand_phone_number').text(data.footer.phoneNumber);
    $('#footer_brand_fanpage').text(data.footer.fanpage);
    $('#footer_brand_website').text(data.footer.website);

    return $.html();
  }

  private createOrderList(order: IOrder): string {
    let orderList = `<tr>
    <th>Sản phẩm</th>
    <th>SL</th>
    <th>Đơn giá</th>
    <th>Thành tiền</th>
    </tr>
    `;

    order.orderItems.forEach(item => {
      orderList += `<tr>
        <td>${item.productName}</td>
        <td>${item.quantity} ${item.unit}</td>
        <td>${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
        <td>${(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
      </tr>`;
    });

    const orderTableElement = `<table class="order-table">${orderList}</table>`;
    
    return orderTableElement;
  }

  private async createTotalBill(order: IOrder): Promise<string> {
    const total = order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const qrcode = await this.vietqrService.createVietQRCode(total, order.orderCode);
    
    const paymentQrCodeElement = `<img src="${qrcode}" style="width: 100px; height: 100px;"/>`;
    
    const orderTotalBillTableElement = `
    <div style="display: flex; width: 100%; justify-content: flex-end; align-items: center;">
      <span style="margin-right: 15px;">Tổng: </span>
      <b>${total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b>
    </div>
    `;
    
    return paymentQrCodeElement + orderTotalBillTableElement
  }
}
