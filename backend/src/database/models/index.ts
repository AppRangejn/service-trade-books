import { sequelize } from '../../config/db';
import { Book } from './Book';
import { User } from './User';

User.hasMany(Book, {
  foreignKey: 'userId',
  as: 'books',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Book.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export const initDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};

export { Book, sequelize, User };
