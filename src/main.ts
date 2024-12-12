import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HttpResponseInterceptor } from './common/interceptors/http-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Registrar el filtro globalmente:
  app.useGlobalFilters(new HttpExceptionFilter());
  // Registrar el interceptor globalmente:
  app.useGlobalInterceptors(new HttpResponseInterceptor());
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
