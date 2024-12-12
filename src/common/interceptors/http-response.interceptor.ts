import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * Interceptor para transformar la respuestas existosas de la API
 */
@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map(data => ({
        status: 200,
        message: 'Operación exitosa',
        data,
        timestamp: new Date().toISOString(),
        path: request.url
      }))
    );
  }
}