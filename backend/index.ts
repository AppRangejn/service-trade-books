import 'dotenv/config';
import http from 'http';
import app from './src/app';
import { sequelize } from './src/config/db';
import './src/database/models';

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing');
}

const PORT = Number(process.env.PORT) || 5000;
const isProd = process.env.NODE_ENV === 'production';
const shouldAlter = !isProd && process.env.DB_SYNC_ALTER === 'true';

const server = http.createServer(app);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: shouldAlter });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database startup error:', err);
    process.exit(1);
  }
};

void start();
