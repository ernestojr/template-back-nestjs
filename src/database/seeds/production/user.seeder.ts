import { DataSource } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class ProdUserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    // Verificar si ya existe el usuario admin
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@tudominio.com' }
    });

    if (existingAdmin) {
      console.log('Production admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD || 'admin123', 10);

    const adminUser = {
      fullname: 'Administrator',
      email: 'admin@tudominio.com',
      rut: '00000000-0',
      password: hashedPassword,
      role: 'admin',
      active: true,
    };

    await userRepository.save(adminUser);
    console.log('Production admin user seeded');
  }
}
