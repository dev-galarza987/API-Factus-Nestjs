import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './helpers/test-helper';
import { TestFixtures } from './fixtures/test-fixtures';
import { UserRole } from '../src/types/UserRole';

describe('User Module (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;

  beforeAll(async () => {
    app = await TestHelper.initTestApp();
  });

  afterAll(async () => {
    await TestHelper.closeApp();
  });

  beforeEach(async () => {
    await TestHelper.cleanDatabase();
  });

  describe('/api/v1/user/register (POST)', () => {
    it('1. Should create a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/user/register')
        .send(TestFixtures.users.company)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(TestFixtures.users.company.email);
      expect(response.body.firstName).toBe(TestFixtures.users.company.firstName);
      expect(response.body.role).toBe(TestFixtures.users.company.role);
      expect(response.body).not.toHaveProperty('password');
      createdUserId = response.body.id;
    });

    it('2. Should fail to create user with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/user/register')
        .send(TestFixtures.users.company)
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/user/register')
        .send(TestFixtures.users.company)
        .expect(409);
    });

    it('3. Should fail to create user with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/user/register')
        .send(TestFixtures.users.invalid)
        .expect(400);
    });
  });

  describe('/api/v1/user/auth/login (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/v1/user/register')
        .send(TestFixtures.users.company);
    });

    it('4. Should login user successfully', async () => {
      const loginData = {
        email: TestFixtures.users.company.email,
        password: TestFixtures.users.company.password
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/user/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(TestFixtures.users.company.email);
    });

    it('5. Should fail to login with invalid credentials', async () => {
      const loginData = {
        email: TestFixtures.users.company.email,
        password: 'wrongpassword'
      };

      await request(app.getHttpServer())
        .post('/api/v1/user/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('/api/v1/user (GET)', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/user/register')
        .send(TestFixtures.users.company);
      createdUserId = response.body.id;
    });

    it('6. Should get all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/user')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('7. Should get user by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/user/${createdUserId}`)
        .expect(200);

      expect(response.body.id).toBe(createdUserId);
      expect(response.body.email).toBe(TestFixtures.users.company.email);
    });

    it('8. Should return 404 for non-existent user', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .get(`/api/v1/user/${fakeId}`)
        .expect(404);
    });
  });

  describe('/api/v1/user/:id (PATCH)', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/user/register')
        .send(TestFixtures.users.company);
      createdUserId = response.body.id;
    });

    it('9. Should update user successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/user/${createdUserId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe(updateData.firstName);
      expect(response.body.lastName).toBe(updateData.lastName);
    });

    it('10. Should fail to update with invalid email', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/user/${createdUserId}`)
        .send(updateData)
        .expect(400);
    });
  });
});