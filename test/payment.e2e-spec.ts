import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './helpers/test-helper';
import { TestFixtures } from './fixtures/test-fixtures';

describe('Payment Module (e2e)', () => {
  let app: INestApplication;
  let createdPaymentId: string;
  let invoiceId: string;

  beforeAll(async () => {
    app = await TestHelper.initTestApp();
  });

  afterAll(async () => {
    await TestHelper.closeApp();
  });

  beforeEach(async () => {
    await TestHelper.cleanDatabase();

    // Create necessary dependencies
    const companyResponse = await request(app.getHttpServer())
      .post('/api/v1/company')
      .send(TestFixtures.companies.valid);

    const customerResponse = await request(app.getHttpServer())
      .post('/api/v1/customer')
      .send(TestFixtures.customers.valid);

    const invoiceResponse = await request(app.getHttpServer())
      .post('/api/v1/invoice')
      .send({
        ...TestFixtures.invoices.valid,
        companyId: companyResponse.body.id,
        customerId: customerResponse.body.id,
      });

    invoiceId = invoiceResponse.body.id;
  });

  describe('/api/v1/payment (POST)', () => {
    it('1. Should create a new payment successfully', async () => {
      const paymentData = {
        ...TestFixtures.payments.valid,
        invoiceId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/payment')
        .send(paymentData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(TestFixtures.payments.valid.amount);
      expect(response.body.paymentMethod).toBe(
        TestFixtures.payments.valid.paymentMethod,
      );
      expect(response.body.invoiceId).toBe(invoiceId);
      createdPaymentId = response.body.id;
    });

    it('2. Should fail to create payment with invalid data', async () => {
      const paymentData = {
        amount: -100, // Invalid negative amount
        invoiceId,
      };

      await request(app.getHttpServer())
        .post('/api/v1/payment')
        .send(paymentData)
        .expect(400);
    });

    it('3. Should fail to create payment with non-existent invoice', async () => {
      const paymentData = {
        ...TestFixtures.payments.valid,
        invoiceId: '550e8400-e29b-41d4-a716-446655440000',
      };

      await request(app.getHttpServer())
        .post('/api/v1/payment')
        .send(paymentData)
        .expect(404);
    });
  });

  describe('/api/v1/payment (GET)', () => {
    beforeEach(async () => {
      const paymentData = {
        ...TestFixtures.payments.valid,
        invoiceId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/payment')
        .send(paymentData);
      createdPaymentId = response.body.id;
    });

    it('4. Should get all payments', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/payment')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('5. Should get payment by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/payment/${createdPaymentId}`)
        .expect(200);

      expect(response.body.id).toBe(createdPaymentId);
      expect(response.body.amount).toBe(TestFixtures.payments.valid.amount);
    });

    it('6. Should return 404 for non-existent payment', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .get(`/api/v1/payment/${fakeId}`)
        .expect(404);
    });
  });

  describe('/api/v1/payment/:id (PATCH)', () => {
    beforeEach(async () => {
      const paymentData = {
        ...TestFixtures.payments.valid,
        invoiceId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/payment')
        .send(paymentData);
      createdPaymentId = response.body.id;
    });

    it('7. Should update payment successfully', async () => {
      const updateData = {
        amount: 250.0,
        description: 'Updated payment description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/payment/${createdPaymentId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.amount).toBe(updateData.amount);
      expect(response.body.description).toBe(updateData.description);
    });

    it('8. Should fail to update with invalid amount', async () => {
      const updateData = {
        amount: -50,
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/payment/${createdPaymentId}`)
        .send(updateData)
        .expect(400);
    });
  });

  describe('/api/v1/payment/:id (DELETE)', () => {
    beforeEach(async () => {
      const paymentData = {
        ...TestFixtures.payments.valid,
        invoiceId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/payment')
        .send(paymentData);
      createdPaymentId = response.body.id;
    });

    it('9. Should delete payment successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/payment/${createdPaymentId}`)
        .expect(200);
    });

    it('10. Should return 404 when deleting non-existent payment', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .delete(`/api/v1/payment/${fakeId}`)
        .expect(404);
    });
  });
});
