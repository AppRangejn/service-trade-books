import { sequelize } from '../../config/db';
import { Book } from './Book';
import { ExchangeRequest } from './ExchangeRequest';
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

ExchangeRequest.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
ExchangeRequest.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
ExchangeRequest.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

export { Book, sequelize, User,  ExchangeRequest};
