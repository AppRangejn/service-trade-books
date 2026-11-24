import bcrypt from 'bcrypt';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';
import {
  AUTH_CONFIG,
  USER_ROLES,
  USER_ROLE_VALUES,
  UserRole,
} from '../../constants';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  'id' | 'role'
> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    const { password, ...values } = this.get();
    return values;
  }
}

User.init(
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
        notEmpty: { msg: 'Name cannot be empty' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        this.setDataValue(
          'password',
          bcrypt.hashSync(value, AUTH_CONFIG.SALT_ROUNDS),
        );
      },
    },
    role: {
      type: DataTypes.ENUM(...USER_ROLE_VALUES),
      defaultValue: USER_ROLES.USER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  },
);
