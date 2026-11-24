import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

interface BookAttributes {
  id: number;
  name: string;
  author: string;
  photo: string | null;
  userId: number;
}

interface BookCreationAttributes extends Optional<
  BookAttributes,
  'id' | 'photo'
> {}

export class Book
  extends Model<BookAttributes, BookCreationAttributes>
  implements BookAttributes
{
  declare id: number;
  declare name: string;
  declare author: string;
  declare photo: string | null;
  declare userId: number;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Book name cannot be empty' },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Author name cannot be empty' },
      },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'books',
    timestamps: true,
  },
);
