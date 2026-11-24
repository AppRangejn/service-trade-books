import 'dotenv/config';
import { sequelize } from '../models';
import { seedBooks } from './books.seed';
import { seedUsers } from './users.seed';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Refusing to run database seeder in production environment.');
}

const runSeeders = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const users = await seedUsers();
    await seedBooks(users);

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

void runSeeders();
