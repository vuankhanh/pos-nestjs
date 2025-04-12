import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from 'src/module/custom_logger/custom_logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let errors = null;

    if (exception instanceof BadRequestException && typeof exceptionResponse === 'object') {
      const responseObject = exceptionResponse as any;

      // Lấy danh sách lỗi từ ValidationPipe
      const validationErrors = responseObject.message || [];
      // Loại bỏ tên trường cha (nếu có)
      errors = validationErrors.map((error: string) => {
        const dotIndex = error.indexOf('.');
        return dotIndex !== -1 ? error.substring(dotIndex + 1) : error; // Loại bỏ phần trước dấu chấm
      });

      message = 'Yêu cầu không hợp lệ'; // Thay đổi thông báo tổng quát
    }

    const logMessage = `${request.method} ${request.url} ${status} - ${message}`;
    this.logger.error(logMessage, exception.stack);

    response.status(status).json({
      statusCode: status,
      message,
      errors,
    });
  }
}