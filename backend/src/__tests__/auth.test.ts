import 'dotenv/config';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../app';
import { sequelize, User } from '../database/models';

describe('Auth API (/api/auth)', () => {
  const testEmail = `auth_spec_${Date.now()}@bookclub.local`;
  let token = '';

  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await User.destroy({ where: { email: testEmail } });
    await sequelize.close();
  });

  it('registers a new user with default User role', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Auth Test User',
      email: testEmail,
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.role).toBe('User');
    expect(res.body.user.password).toBeUndefined();
    token = res.body.token;
  });

  it('rejects duplicate email registration with 409', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Duplicate User',
      email: testEmail,
      password: 'password123',
    });

    expect(res.status).toBe(409);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects invalid password with 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
  });

  it('returns current profile via GET /api/auth/me', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
  });
});
