import DataSource from '../../typeorm.config';

const runSeeder = async () => {
  try {
    await DataSource.initialize();

    const environment = process.env.NODE_ENV || 'production';
    console.log(`Running ${environment} seeds...`);

    if (environment === 'production') {
      // Importar y ejecutar seeders de producción
      const { ProdUserSeeder } = await import('./seeds/production/user.seeder');
      await new ProdUserSeeder(DataSource).run();
    } else {
      // Importar y ejecutar seeders de desarrollo / local
      const { DevUserSeeder } = await import('./seeds/development/user.seeder');
      await new DevUserSeeder(DataSource).run();
    }

    console.log('Seeds executed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeeder();
