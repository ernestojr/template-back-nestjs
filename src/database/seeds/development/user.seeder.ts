import { DataSource } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class DevUserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    // Verificar si ya existen usuarios
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Development users already seeded');
      return;
    }

    const hashedPassword = await bcrypt.hash('qwerty', 10);

    const users = [
      {
        fullname: 'Admin User',
        email: 'admin@example.com',
        rut: '11111111-1',
        password: hashedPassword,
        role: 'admin',
        active: true,
      },
      {
        fullname: 'Test Operator',
        email: 'operator@example.com',
        rut: '22222222-2',
        password: hashedPassword,
        role: 'operator',
        active: true,
      },
      {
        fullname: 'Test User',
        email: 'user@example.com',
        rut: '33333333-3',
        password: hashedPassword,
        role: 'user',
        active: true,
      },
    ];

    await userRepository.save(users);
    console.log('Development users seeded');
  }
}
