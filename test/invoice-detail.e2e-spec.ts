import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './helpers/test-helper';
import { TestFixtures } from './fixtures/test-fixtures';

describe('Invoice Detail Module (e2e)', () => {
  let app: INestApplication;
  let createdInvoiceDetailId: string;
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
        customerId: customerResponse.body.id
      });
    
    invoiceId = invoiceResponse.body.id;
  });

  describe('/api/v1/invoice-detail (POST)', () => {
    it('1. Should create a new invoice detail successfully', async () => {
      const invoiceDetailData = {
        ...TestFixtures.invoiceDetails.valid,
        invoiceId
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/invoice-detail')
        .send(invoiceDetailData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.description).toBe(TestFixtures.invoiceDetails.valid.description);
      expect(response.body.quantity).toBe(TestFixtures.invoiceDetails.valid.quantity);
      expect(response.body.unitPrice).toBe(TestFixtures.invoiceDetails.valid.unitPrice);
      expect(response.body.invoiceId).toBe(invoiceId);
      createdInvoiceDetailId = response.body.id;
    });

    it('2. Should fail to create invoice detail with non-existent invoice', async () => {
      const invoiceDetailData = {
        ...TestFixtures.invoiceDetails.valid,
        invoiceId: '550e8400-e29b-41d4-a716-446655440000'
      };

      await request(app.getHttpServer())
        .post('/api/v1/invoice-detail')
        .send(invoiceDetailData)
        .expect(404);
    });

    it('3. Should fail to create invoice detail with invalid data', async () => {
      const invoiceDetailData = {
        description: '', // Invalid empty description
        quantity: -1, // Invalid negative quantity
        invoiceId
      };

      await request(app.getHttpServer())
        .post('/api/v1/invoice-detail')
        .send(invoiceDetailData)
        .expect(400);
    });
  });

  describe('/api/v1/invoice-detail (GET)', () => {
    beforeEach(async () => {
      const invoiceDetailData = {
        ...TestFixtures.invoiceDetails.valid,
        invoiceId
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/invoice-detail')
        .send(invoiceDetailData);
      createdInvoiceDetailId = response.body.id;

      const anotherDetailData = {
        ...TestFixtures.invoiceDetails.another,
        invoiceId
      };

      await request(app.getHttpServer())
        .post('/api/v1/invoice-detail')
        .send(anotherDetailData);
    });

    it('4. Should get all invoice details', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/invoice-detail')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('5. Should get invoice detail by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/invoice-detail/${createdInvoiceDetailId}`)
        .expect(200);

      expect(response.body.id).toBe(createdInvoiceDetailId);
      expect(response.body.description).toBe(TestFixtures.invoiceDetails.valid.description);
    });

    it('6. Should return 404 for non-existent invoice detail', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .get(`/api/v1/invoice-detail/${fakeId}`)
        .expect(404);
    });
  });

  describe('/api/v1/invoice-detail/:id (PATCH)', () => {
    beforeEach(async () => {
      const invoiceDetailData = {
        ...TestFixtures.invoiceDetails.valid,
        invoiceId
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/invoice-detail')
        .send(invoiceDetailData);
      createdInvoiceDetailId = response.body.id;
    });

    it('7. Should update invoice detail successfully', async () => {
      const updateData = {
        description: 'Updated Product Description',
        quantity: 10
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/invoice-detail/${createdInvoiceDetailId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.description).toBe(updateData.description);
      expect(response.body.quantity).toBe(updateData.quantity);
    });

    it('8. Should fail to update with invalid quantity', async () => {
      const updateData = {
        quantity: -5
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/invoice-detail/${createdInvoiceDetailId}`)
        .send(updateData)
        .expect(400);
    });
  });

  describe('/api/v1/invoice-detail/:id (DELETE)', () => {
    beforeEach(async () => {
      const invoiceDetailData = {
        ...TestFixtures.invoiceDetails.valid,
        invoiceId
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/invoice-detail')
        .send(invoiceDetailData);
      createdInvoiceDetailId = response.body.id;
    });

    it('9. Should delete invoice detail successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/invoice-detail/${createdInvoiceDetailId}`)
        .expect(200);
    });

    it('10. Should return 404 when deleting non-existent invoice detail', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app.getHttpServer())
        .delete(`/api/v1/invoice-detail/${fakeId}`)
        .expect(404);
    });
  });
});