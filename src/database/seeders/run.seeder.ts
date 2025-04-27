import DataSource from '../../../typeorm.config';
import { SeederExecutor } from './config/seeder-executor';

async function bootstrap() {
    try {
        await DataSource.initialize();
        console.log('Conexión a la base de datos establecida');
        const runner = new SeederExecutor(DataSource);
        await runner.run();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await DataSource.destroy();
    }
}

bootstrap();