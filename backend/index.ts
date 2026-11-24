import 'dotenv/config';
import http from 'http';
import app from './src/app';
import { sequelize } from './src/config/db';
import './src/database/models';

const jwtSecret = process.env.JWT_SECRET?.trim() ?? ''; 
const PLACEHOLDER_SECRETS = new Set([
  'your_super_secret_jwt_key_change_in_production',
  'your_generated_secret',
  'changeme',
  'secret',
]);

if (jwtSecret.length < 32 || PLACEHOLDER_SECRETS.has(jwtSecret)) {
  throw new Error(
    'FATAL: JWT_SECRET must be at least 32 characters long and not use a placeholder value',
  );
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
