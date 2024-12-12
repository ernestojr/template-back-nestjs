import { DataSource } from 'typeorm';
import { UserEntity } from '../../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class ProdUserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const repository = this.dataSource.getRepository(UserEntity);

    // Verificar si ya existe el usuario admin
    const existingAdmin = await repository.findOne({
      where: { email: 'admin@tudominio.com' },
    });

    if (existingAdmin) {
      console.log('Production admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_INITIAL_PASSWORD || 'admin123',
      10,
    );

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
        fullname: 'Administrator',
        email: 'admin@tudominio.com',
        dni: '11111111-1',
        password: hashedPassword,
        role: 'admin',
        active: true,
      },
    ];

    await repository.save(users);
    console.log('Production admin user seeded');
  }
}
