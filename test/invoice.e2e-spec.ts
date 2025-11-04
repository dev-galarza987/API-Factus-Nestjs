import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './helpers/test-helper';
import { TestFixtures } from './fixtures/test-fixtures';

describe('Invoice Module (e2e)', () => {
  let app: INestApplication;
  let createdInvoiceId: string;
  let companyId: string;
  let customerId: string;

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
    companyId = companyResponse.body.id;

    const customerResponse = await request(app.getHttpServer())
      .post('/api/v1/customer')
      .send(TestFixtures.customers.valid);
    customerId = customerResponse.body.id;
  });

  describe('/api/v1/invoice (POST)', () => {
    it('1. Should create a new invoice successfully', async () => {
      const invoiceData = {
        ...TestFixtures.invoices.valid,
        companyId,
        customerId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/invoice')
        .send(invoiceData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.invoiceNumber).toBe(
        TestFixtures.invoices.valid.invoiceNumber,
      );
      expect(response.body.totalAmount).toBe(
        TestFixtures.invoices.valid.totalAmount,
      );
      expect(response.body.companyId).toBe(companyId);
      expect(response.body.customerId).toBe(customerId);
      createdInvoiceId = response.body.id;
    });

    it('2. Should fail to create invoice with non-existent company', async () => {
      const invoiceData = {
        ...TestFixtures.invoices.valid,
        companyId: '550e8400-e29b-41d4-a716-446655440000',
        customerId,
      };

      await request(app.getHttpServer())
        .post('/api/v1/invoice')
        .send(invoiceData)
        .expect(404);
    });

    it('3. Should fail to create invoice with invalid data', async () => {
      const invoiceData = {
        invoiceNumber: '', // Invalid empty number
        companyId,
        customerId,
      };

      await request(app.getHttpServer())
        .post('/api/v1/invoice')
        .send(invoiceData)
        .expect(400);
    });
  });

  describe('/api/v1/invoice (GET)', () => {
    beforeEach(async () => {
      const invoiceData = {
        ...TestFixtures.invoices.valid,
        companyId,
        customerId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/invoice')
        .send(invoiceData);
      createdInvoiceId = response.body.id;

      const anotherInvoiceData = {
        ...TestFixtures.invoices.another,
        companyId,
        customerId,
      };

      await request(app.getHttpServer())
        .post('/api/v1/invoice')
        .send(anotherInvoiceData);
    });

    it('4. Should get all invoices', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/invoice')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('5. Should get invoice by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/invoice/${createdInvoiceId}`)
        .expect(200);

      expect(response.body.id).toBe(createdInvoiceId);
      expect(response.body.invoiceNumber).toBe(
        TestFixtures.invoices.valid.invoiceNumber,
      );
    });

    it('6. Should return 404 for non-existent invoice', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .get(`/api/v1/invoice/${fakeId}`)
        .expect(404);
    });
  });

  describe('/api/v1/invoice/:id (PATCH)', () => {
    beforeEach(async () => {
      const invoiceData = {
        ...TestFixtures.invoices.valid,
        companyId,
        customerId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/invoice')
        .send(invoiceData);
      createdInvoiceId = response.body.id;
    });

    it('7. Should update invoice successfully', async () => {
      const updateData = {
        notes: 'Updated invoice notes',
        subtotal: 2000.0,
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/invoice/${createdInvoiceId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.notes).toBe(updateData.notes);
      expect(response.body.subtotal).toBe(updateData.subtotal);
    });

    it('8. Should fail to update with invalid amount', async () => {
      const updateData = {
        totalAmount: -100,
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/invoice/${createdInvoiceId}`)
        .send(updateData)
        .expect(400);
    });
  });

  describe('/api/v1/invoice/:id (DELETE)', () => {
    beforeEach(async () => {
      const invoiceData = {
        ...TestFixtures.invoices.valid,
        companyId,
        customerId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/invoice')
        .send(invoiceData);
      createdInvoiceId = response.body.id;
    });

    it('9. Should delete invoice successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/invoice/${createdInvoiceId}`)
        .expect(200);
    });

    it('10. Should return 404 when deleting non-existent invoice', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .delete(`/api/v1/invoice/${fakeId}`)
        .expect(404);
    });
  });
});
