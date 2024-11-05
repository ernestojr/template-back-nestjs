import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});

const runSeeder = async () => {
  try {
    await AppDataSource.initialize();
    
    const environment = process.env.NODE_ENV || 'development';
    console.log(`Running ${environment} seeds...`);

    if (environment === 'development') {
      // Importar y ejecutar seeders de desarrollo
      const { DevUserSeeder } = await import('./seeds/development/user.seeder');
      await new DevUserSeeder(AppDataSource).run();
    } else {
      // Importar y ejecutar seeders de producción
      const { ProdUserSeeder } = await import('./seeds/production/user.seeder');
      await new ProdUserSeeder(AppDataSource).run();
    }

    console.log('Seeds executed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeeder();
