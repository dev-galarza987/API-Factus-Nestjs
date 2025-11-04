import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { InvoiceController } from '../src/invoice/invoice.controller';
import { InvoiceService } from '../src/invoice/invoice.service';

// Mock del InvoiceService
const mockInvoiceService = {
  findAll: jest.fn().mockResolvedValue([
    { id: '1', invoiceNumber: 'INV-001', totalAmount: 1130.0 },
    { id: '2', invoiceNumber: 'INV-002', totalAmount: 2260.0 },
  ]),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    invoiceNumber: 'INV-001',
    totalAmount: 1130.0,
    status: 'PENDING',
  }),
};

describe('Invoice Controller Tests (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /invoice', () => {
    it('1. Should get all invoices', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/invoice')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(mockInvoiceService.findAll).toHaveBeenCalled();
    });

    it('2. Should get invoice by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/invoice/1')
        .expect(200);

      expect(response.body.id).toBe('1');
      expect(response.body.invoiceNumber).toBe('INV-001');
      expect(response.body.totalAmount).toBe(1130.0);
      expect(mockInvoiceService.findOne).toHaveBeenCalledWith('1');
    });

    it('3. Should verify invoice endpoints exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/invoice/test-id')
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });
});
