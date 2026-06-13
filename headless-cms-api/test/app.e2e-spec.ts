import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Headless CMS API (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let categoryId: string;
  let postId: string;
  const ts = Date.now(); // unique suffix

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Users', () => {
    const email = `e2e-${ts}@example.com`;
    const username = `e2euser-${ts}`;

    it('POST /users — should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ email, username, password: 'Password123!', displayName: 'E2E User' })
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.email).toBe(email);
      expect(res.body.passwordHash).toBeUndefined();
      userId = res.body.id;
    });

    it('POST /users — should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email, username: 'other', password: 'Password123!' })
        .expect(409);
    });

    it('GET /users — should return paginated users', async () => {
      const res = await request(app.getHttpServer()).get('/users').expect(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    });

    it('GET /users/:id — should return a user (no passwordHash)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);
      expect(res.body.id).toBe(userId);
      expect(res.body.passwordHash).toBeUndefined();
    });

    it('PATCH /users/:id — should update', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Content-Type', 'application/json')
        .send({ displayName: 'Updated User' })
        .expect(200);

      expect(res.body.displayName).toBe('Updated User');
    });

    it('PATCH /users/:id — should reject invalid email', async () => {
      await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ email: 'not-an-email' })
        .expect(400);
    });
  });

  describe('Categories', () => {
    it('POST /categories — should create a category', async () => {
      const res = await request(app.getHttpServer())
        .post('/categories')
        .send({ name: `Tech-${ts}`, slug: `tech-${ts}` })
        .expect(201);
      categoryId = res.body.id;
    });

    it('POST /categories — should create sub-category', async () => {
      const res = await request(app.getHttpServer())
        .post('/categories')
        .send({ name: `JS-${ts}`, slug: `js-${ts}`, parentId: categoryId })
        .expect(201);
      expect(res.body.parentId).toBe(categoryId);
    });

    it('GET /categories/tree — should return tree', async () => {
      const res = await request(app.getHttpServer())
        .get('/categories/tree')
        .expect(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('PATCH /categories/:id — should update', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/categories/${categoryId}`)
        .set('Content-Type', 'application/json')
        .send({ description: 'All things tech' })
        .expect(200);
      expect(res.body.description).toBe('All things tech');
    });
  });

  describe('Posts', () => {
    it('POST /posts — should create a post', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts')
        .send({
          title: `Hello World-${ts}`,
          slug: `hello-world-${ts}`,
          content: 'This is the first post!',
          authorId: userId,
          categoryId,
          published: true,
        })
        .expect(201);
      expect(res.body.published).toBe(true);
      expect(res.body.publishedAt).toBeDefined();
      postId = res.body.id;
    });

    it('GET /posts — should return paginated posts', async () => {
      const res = await request(app.getHttpServer()).get('/posts').expect(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    });

    it('PATCH /posts/:id — should unpublish', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/posts/${postId}`)
        .set('Content-Type', 'application/json')
        .send({ published: false })
        .expect(200);
      expect(res.body.published).toBe(false);
      expect(res.body.publishedAt).toBeNull();
    });

    it('DELETE /posts/:id — should delete', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .expect(200);
    });
  });

  describe('Cleanup', () => {
    it('DELETE /categories/:id — should delete category', async () => {
      await request(app.getHttpServer())
        .delete(`/categories/${categoryId}`)
        .expect(200);
    });

    it('DELETE /users/:id — should delete user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(200);
    });

    it('GET /users/:id — should 404 after delete', async () => {
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(404);
    });
  });
});
