import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinar el status code y mensaje
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Error interno del servidor';

    // Construir respuesta de error estandarizada
    const errorResponse: ApiResponse<null> = {
      status,
      message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: null
    };

    // Si estamos en desarrollo, incluir el stack trace
    if (process.env.NODE_ENV !== 'production') {
      errorResponse['stack'] = exception.stack;
    }

    response
      .status(status)
      .json(errorResponse);
  }
}