import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './helpers/test-helper';
import { TestFixtures } from './fixtures/test-fixtures';

describe('Company Module (e2e)', () => {
  let app: INestApplication;
  let createdCompanyId: string;

  beforeAll(async () => {
    app = await TestHelper.initTestApp();
  });

  afterAll(async () => {
    await TestHelper.closeApp();
  });

  beforeEach(async () => {
    await TestHelper.cleanDatabase();
  });

  describe('/api/v1/company (POST)', () => {
    it('1. Should create a new company successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(TestFixtures.companies.valid)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.businessName).toBe(TestFixtures.companies.valid.businessName);
      expect(response.body.taxId).toBe(TestFixtures.companies.valid.taxId);
      expect(response.body.email).toBe(TestFixtures.companies.valid.email);
      createdCompanyId = response.body.id;
    });

    it('2. Should fail to create company with duplicate tax ID', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(TestFixtures.companies.valid)
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(TestFixtures.companies.valid)
        .expect(409);
    });

    it('3. Should fail to create company with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(TestFixtures.companies.invalid)
        .expect(400);
    });
  });

  describe('/api/v1/company (GET)', () => {
    beforeEach(async () => {
      const response1 = await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(TestFixtures.companies.valid);
      createdCompanyId = response1.body.id;

      await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(TestFixtures.companies.another);
    });

    it('4. Should get all companies', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/company')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('5. Should get company by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/company/${createdCompanyId}`)
        .expect(200);

      expect(response.body.id).toBe(createdCompanyId);
      expect(response.body.businessName).toBe(TestFixtures.companies.valid.businessName);
    });

    it('6. Should return 404 for non-existent company', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .get(`/api/v1/company/${fakeId}`)
        .expect(404);
    });
  });

  describe('/api/v1/company/:id (PATCH)', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(TestFixtures.companies.valid);
      createdCompanyId = response.body.id;
    });

    it('7. Should update company successfully', async () => {
      const updateData = {
        businessName: 'Updated Company Name',
        phone: '+591 70999888'
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/company/${createdCompanyId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.businessName).toBe(updateData.businessName);
      expect(response.body.phone).toBe(updateData.phone);
    });

    it('8. Should fail to update with invalid email', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/company/${createdCompanyId}`)
        .send(updateData)
        .expect(400);
    });
  });

  describe('/api/v1/company/:id (DELETE)', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(TestFixtures.companies.valid);
      createdCompanyId = response.body.id;
    });

    it('9. Should delete company successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/company/${createdCompanyId}`)
        .expect(200);
    });

    it('10. Should return 404 when deleting non-existent company', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .delete(`/api/v1/company/${fakeId}`)
        .expect(404);
    });
  });
});