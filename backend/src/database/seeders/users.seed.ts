import { USER_ROLES } from '../../constants';
import { User } from '../models';

export const seedUsers = async (): Promise<User[]> => {
  const existingCount = await User.count();
  if (existingCount > 0) {
    console.log('Users already exist, skipping users seed.');
    return User.findAll({ order: [['id', 'ASC']] });
  }

  const usersData = [
    {
      name: 'Olena Kovalenko',
      email: 'admin@bookclub.local',
      password: 'password123',
      role: USER_ROLES.ADMIN,
    },
    {
      name: 'Taras Melnyk',
      email: 'moderator@bookclub.local',
      password: 'password123',
      role: USER_ROLES.ADMIN,
    },
    {
      name: 'Maksym Bondarenko',
      email: 'maksym@bookclub.local',
      password: 'password123',
      role: USER_ROLES.USER,
    },
    {
      name: 'Iryna Savchenko',
      email: 'iryna@bookclub.local',
      password: 'password123',
      role: USER_ROLES.USER,
    },
    {
      name: 'Dmytro Polishchuk',
      email: 'dmytro@bookclub.local',
      password: 'password123',
      role: USER_ROLES.USER,
    },
  ];

  const createdUsers = await User.bulkCreate(usersData, {
    individualHooks: true,
    returning: true,
  });

  console.log(`Seeded ${createdUsers.length} book club members.`);
  return createdUsers;
};
