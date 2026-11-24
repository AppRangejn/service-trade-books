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

export { Book, sequelize, User };
