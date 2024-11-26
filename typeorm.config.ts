import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['src/**/*.entity.ts', 'src/**/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    ...(process.env.NODE_ENV !== 'local') && {
        ssl: {
          rejectUnauthorized: false // Si no tienes un certificado SSL verificado, puedes deshabilitar la verificación.
        }
    }
});