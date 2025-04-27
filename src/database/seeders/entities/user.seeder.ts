import { Repository, DeepPartial } from "typeorm";
import { Seeder } from "../config/seeder";
import { UserEntity } from "../../../core/entities/user.entity";
import * as bcrypt from 'bcrypt';

export class UserSeeder extends Seeder<UserEntity> {
    protected entity = UserEntity;

    protected async build(): Promise<DeepPartial<UserEntity>[]> {
        const environment = (process.env.NODE_ENV || 'development')
        let users: DeepPartial<UserEntity>[] = [];
        if ( environment === 'staging' || environment === 'production') {
            const hashedPassword = await bcrypt.hash(
                process.env.ADMIN_INITIAL_PASSWORD || 'admin123',
                10,
            );
            users = [
                {
                    id: '550e8400-e29b-41d4-a716-446655440000', fullname: 'System', email: 'system@example.com', dni: '00000000-0', password: hashedPassword, role: 'admin', active: true,
                },
                {
                    id: 'b47ac8b0-67d1-4e5d-8b47-c863aecf9e1a', fullname: 'Administrator', email: 'admin@tudominio.com', dni: '11111111-1', password: hashedPassword, role: 'admin', active: true,
                },
            ];
        } else  {
            const hashedPassword = await bcrypt.hash('qwerty', 10);
            users = [
                {
                id: '550e8400-e29b-41d4-a716-446655440000', fullname: 'System', email: 'system@example.com', dni: '00000000-0', password: hashedPassword, role: 'admin', active: true,
            },
            {
                id: 'b47ac8b0-67d1-4e5d-8b47-c863aecf9e1a', fullname: 'Admin User', email: 'admin@example.com', dni: '11111111-1', password: hashedPassword, role: 'admin', active: true,
            },
            {
                id: 'd5f39468-2e9f-4f45-b427-653fdf2b0ccd', fullname: 'Test Operator', email: 'operator@example.com', dni: '22222222-2', password: hashedPassword, role: 'operator', active: true,
            },
            {
                id: '7c9e6679-7425-40de-944b-e07fc1f90ae7', fullname: 'Test User', email: 'user@example.com', dni: '33333333-3', password: hashedPassword, role: 'user', active: true,
            },
            ];
        }
        return users;
    }

    protected async findExisting(
        repository: Repository<UserEntity>,
        item: Partial<UserEntity>
    ): Promise<UserEntity | null> {
        return repository.findOne({ where: { email: item.email } });
    }
}