import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './helpers/test-helper';
import { TestFixtures } from './fixtures/test-fixtures';

describe('Customer Module (e2e)', () => {
  let app: INestApplication;
  let createdCustomerId: string;

  beforeAll(async () => {
    app = await TestHelper.initTestApp();
  });

  afterAll(async () => {
    await TestHelper.closeApp();
  });

  beforeEach(async () => {
    await TestHelper.cleanDatabase();
  });

  describe('/api/v1/customer (POST)', () => {
    it('1. Should create a new customer successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/customer')
        .send(TestFixtures.customers.valid)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.fullName).toBe(
        TestFixtures.customers.valid.fullName,
      );
      expect(response.body.taxOrId).toBe(TestFixtures.customers.valid.taxOrId);
      expect(response.body.email).toBe(TestFixtures.customers.valid.email);
      createdCustomerId = response.body.id;
    });

    it('2. Should fail to create customer with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/customer')
        .send(TestFixtures.customers.valid)
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/customer')
        .send(TestFixtures.customers.valid)
        .expect(409);
    });

    it('3. Should fail to create customer with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/customer')
        .send(TestFixtures.customers.invalid)
        .expect(400);
    });
  });

  describe('/api/v1/customer (GET)', () => {
    beforeEach(async () => {
      const response1 = await request(app.getHttpServer())
        .post('/api/v1/customer')
        .send(TestFixtures.customers.valid);
      createdCustomerId = response1.body.id;

      await request(app.getHttpServer())
        .post('/api/v1/customer')
        .send(TestFixtures.customers.another);
    });

    it('4. Should get all customers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customer')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('5. Should get customer by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/customer/${createdCustomerId}`)
        .expect(200);

      expect(response.body.id).toBe(createdCustomerId);
      expect(response.body.fullName).toBe(
        TestFixtures.customers.valid.fullName,
      );
    });

    it('6. Should return 404 for non-existent customer', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .get(`/api/v1/customer/${fakeId}`)
        .expect(404);
    });
  });

  describe('/api/v1/customer/:id (PATCH)', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/customer')
        .send(TestFixtures.customers.valid);
      createdCustomerId = response.body.id;
    });

    it('7. Should update customer successfully', async () => {
      const updateData = {
        fullName: 'Updated Customer Name',
        phone: '+591 70999777',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/customer/${createdCustomerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.fullName).toBe(updateData.fullName);
      expect(response.body.phone).toBe(updateData.phone);
    });

    it('8. Should fail to update with invalid email', async () => {
      const updateData = {
        email: 'invalid-email-format',
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/customer/${createdCustomerId}`)
        .send(updateData)
        .expect(400);
    });
  });

  describe('/api/v1/customer/:id (DELETE)', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/customer')
        .send(TestFixtures.customers.valid);
      createdCustomerId = response.body.id;
    });

    it('9. Should delete customer successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/customer/${createdCustomerId}`)
        .expect(200);
    });

    it('10. Should return 404 when deleting non-existent customer', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .delete(`/api/v1/customer/${fakeId}`)
        .expect(404);
    });
  });
});
