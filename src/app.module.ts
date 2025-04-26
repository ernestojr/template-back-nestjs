import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        CoreModule,
      ],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,  // Carga automática de entidades
        logging: Boolean(configService.get('DB_LOGGING')),
        // synchronize: process.env.NODE_ENV !== 'production',
        ...(process.env.NODE_ENV !== 'local') && {
          ssl: {
            rejectUnauthorized: false // Si no tienes un certificado SSL verificado, puedes deshabilitar la verificación.
          }
        }
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}
