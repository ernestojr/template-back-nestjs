import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { HttpResponseInterceptor } from './core/interceptors/http-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Registrar el filtro globalmente:
  app.useGlobalFilters(new HttpExceptionFilter());
  // Registrar el interceptor globalmente:
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  // Habilitar la validación global 'class-validator' & 'class-transformer'
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // Elimina propiedades no decoradas
    forbidNonWhitelisted: true, // Lanza error si hay props extras
    transform: true,           // Transforma los tipos automáticamente
  }));
  // Habilitar CORS con configuración personalizada
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
