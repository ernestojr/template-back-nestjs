import { Seeder } from './seeder';
import { UserSeeder } from '../entities/user.seeder';

export const seederRegistry: Seeder<any>[] = [
    new UserSeeder(),
    // Aquí puedes agregar más seeders para ejecutar
];