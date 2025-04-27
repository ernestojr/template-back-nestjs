import { DataSource } from 'typeorm';
import { seederRegistry as seeders } from './seeder-registry';

type Environment = 'development' | 'staging' | 'production';

export class SeederExecutor {
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async run() {
        try {
            const environment = (process.env.NODE_ENV || 'development') as Environment;
            console.log(`Iniciando ejecución de seeders para ambiente: ${environment}`);

            for (const seeder of seeders) {
                console.log(`Ejecutando seeder: ${seeder.constructor.name}`);
                await seeder.run(this.dataSource);
            }

            console.log('Seeders ejecutados exitosamente');
        } catch (error) {
            console.error('Error ejecutando seeders:', error);
            throw error;
        }
    }
}