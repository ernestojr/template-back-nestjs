import { DataSource } from 'typeorm';
import { UserEntity } from '../../../core/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const repository = this.dataSource.getRepository(UserEntity);

    // Verificar si ya existen usuarios
    const existingUsers = await repository.count();
    if (existingUsers > 0) {
      console.log('Development users already seeded');
      return;
    }

    const hashedPassword = await bcrypt.hash('qwerty', 10);

    const users = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        fullname: 'System',
        email: 'system@example.com',
        dni: '00000000-0',
        password: hashedPassword,
        role: 'admin',
        active: true,
      },
      {
        id: 'b47ac8b0-67d1-4e5d-8b47-c863aecf9e1a',
        fullname: 'Admin User',
        email: 'admin@example.com',
        dni: '11111111-1',
        password: hashedPassword,
        role: 'admin',
        active: true,
      },
      {
        id: 'd5f39468-2e9f-4f45-b427-653fdf2b0ccd',
        fullname: 'Test Operator',
        email: 'operator@example.com',
        dni: '22222222-2',
        password: hashedPassword,
        role: 'operator',
        active: true,
      },
      {
        id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        fullname: 'Test User',
        email: 'user@example.com',
        dni: '33333333-3',
        password: hashedPassword,
        role: 'user',
        active: true,
      },
    ];

    await repository.save(users);
    console.log('Development users seeded');
  }
}
