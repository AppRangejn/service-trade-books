import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const {
  DATABASE_URL,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_SSL,
  DB_SSL_REJECT_UNAUTHORIZED,
} = process.env;

if (!DATABASE_URL && (!DB_NAME || !DB_USER || !DB_PASSWORD)) {
  throw new Error('Missing required database environment variables in .env');
}

const useSsl = Boolean(DATABASE_URL) && DB_SSL !== 'false';
const rejectUnauthorized = DB_SSL_REJECT_UNAUTHORIZED !== 'false';

export const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      ...(useSsl
        ? {
            dialectOptions: {
              ssl: {
                require: true,
                rejectUnauthorized,
              },
            },
          }
        : {}),
    })
  : new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
      host: DB_HOST || 'localhost',
      port: Number(DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
    });
