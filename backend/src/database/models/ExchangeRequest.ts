import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../config/db';
import {
  EXCHANGE_STATUS,
  EXCHANGE_STATUS_VALUES,
  ExchangeStatus,
} from '../../constants';

export class ExchangeRequest extends Model<
  InferAttributes<ExchangeRequest>,
  InferCreationAttributes<ExchangeRequest>
> {
  declare id: CreationOptional<number>;
  declare bookId: number;
  declare requesterId: number;
  declare ownerId: number;
  declare status: CreationOptional<ExchangeStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ExchangeRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'books', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM(...EXCHANGE_STATUS_VALUES),
      allowNull: false,
      defaultValue: EXCHANGE_STATUS.PENDING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'exchange_requests',
    modelName: 'ExchangeRequest',
  },
);
