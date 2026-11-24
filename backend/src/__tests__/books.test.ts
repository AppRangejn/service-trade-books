import 'dotenv/config';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import app from '../app';
import { Book, sequelize, User } from '../database/models';
import * as mailService from '../services/mail.service';

vi.spyOn(mailService, 'sendExchangeRequestEmail').mockResolvedValue(
  'https://ethereal.email/message/mock-preview',
);

describe('Books & Exchange API (/api/books, /api/me/books)', () => {
  const testEmail = `books_spec_${Date.now()}@bookclub.local`;
  let userToken = '';
  let createdBookId = 0;

  beforeAll(async () => {
    await sequelize.authenticate();
    const res = await request(app).post('/api/auth/register').send({
      name: 'Books Test Reader',
      email: testEmail,
      password: 'Password123!',
    });
    userToken = res.body.token;
  });

  afterAll(async () => {
    await User.destroy({ where: { email: testEmail } });
    await sequelize.close();
  });

  it('returns paginated, sorted, and searched public books', async () => {
    const res = await request(app).get(
      '/api/books?search=Dune&sort=ASC&page=1&limit=5',
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.books)).toBe(true);
    expect(res.body.books.length).toBeGreaterThanOrEqual(1);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 5 });
  });

  it('returns book details by ID', async () => {
    const sampleBook = await Book.findOne();
    const res = await request(app).get(`/api/books/${sampleBook!.id}`);

    expect(res.status).toBe(200);
    expect(res.body.book.id).toBe(sampleBook!.id);
    expect(res.body.book.owner).toBeDefined();
  });

  it('creates a book and lists it in GET /api/me/books', async () => {
    const createRes = await request(app)
      .post('/api/me/books')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Refactoring',
        author: 'Martin Fowler',
        photo: 'https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg',
      });

    expect(createRes.status).toBe(201);
    createdBookId = createRes.body.book.id;

    const myBooksRes = await request(app)
      .get('/api/me/books')
      .set('Authorization', `Bearer ${userToken}`);

    expect(myBooksRes.status).toBe(200);
    expect(
      myBooksRes.body.books.some((b: { id: number }) => b.id === createdBookId),
    ).toBe(true);
  });

  it('forbids requesting an exchange for own book with 400', async () => {
    const res = await request(app)
      .post(`/api/books/${createdBookId}/exchange`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400);
  });

  it('sends exchange request email for another user book', async () => {
    const otherBook = await Book.findOne({ where: { name: '1984' } });

    const res = await request(app)
      .post(`/api/books/${otherBook!.id}/exchange`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(mailService.sendExchangeRequestEmail).toHaveBeenCalledOnce();
  });

  it('forbids deleting another user book with 403, allows deleting own book', async () => {
    const otherBook = await Book.findOne({ where: { name: '1984' } });

    const forbiddenRes = await request(app)
      .delete(`/api/books/${otherBook!.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(forbiddenRes.status).toBe(403);

    const deleteRes = await request(app)
      .delete(`/api/books/${createdBookId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(deleteRes.status).toBe(204);
  });
});
