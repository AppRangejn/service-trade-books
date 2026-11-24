import 'dotenv/config';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../app';
import { sequelize, User } from '../database/models';

describe('Admin API (/api/admin/users)', () => {
  const regularEmail = `regular_spec_${Date.now()}@bookclub.local`;
  const managedEmail = `managed_spec_${Date.now()}@bookclub.local`;
  let regularToken = '';
  let adminToken = '';
  let managedUserId = 0;

  beforeAll(async () => {
    await sequelize.authenticate();

    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Regular Reader',
      email: regularEmail,
      password: 'password123',
    });
    regularToken = regRes.body.token;

    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin@bookclub.local',
      password: 'password123',
    });
    adminToken = adminRes.body.token;
  });

  afterAll(async () => {
    await User.destroy({ where: { email: [regularEmail, managedEmail] } });
    await sequelize.close();
  });

  it('denies non-admin access with 403', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${regularToken}`);

    expect(res.status).toBe(403);
  });

  it('lists all users for Admin', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThanOrEqual(5);
  });

  it('creates, updates, and deletes a user as Admin', async () => {
    const createRes = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Managed Member',
        email: managedEmail,
        password: 'password123',
        role: 'User',
      });

    expect(createRes.status).toBe(201);
    managedUserId = createRes.body.user.id;

    const patchRes = await request(app)
      .patch(`/api/admin/users/${managedUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'Admin' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.user.role).toBe('Admin');

    const deleteRes = await request(app)
      .delete(`/api/admin/users/${managedUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(204);
  });
});
