import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PaymentController } from '../src/payment/payment.controller';
import { PaymentService } from '../src/payment/payment.service';

// Mock del PaymentService
const mockPaymentService = {
  findAll: jest.fn().mockResolvedValue([
    { id: '1', amount: 500.00, paymentMethod: 'CREDIT_CARD' },
    { id: '2', amount: 1130.00, paymentMethod: 'BANK_TRANSFER' }
  ]),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    amount: 500.00,
    paymentMethod: 'CREDIT_CARD',
    transactionReference: 'TXN-001'
  }),
};

describe('Payment Controller Tests (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
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

  describe('GET /payment', () => {
    it('1. Should get all payments', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/payment')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(mockPaymentService.findAll).toHaveBeenCalled();
    });

    it('2. Should get payment by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/payment/1')
        .expect(200);

      expect(response.body.id).toBe('1');
      expect(response.body.amount).toBe(500.00);
      expect(response.body.paymentMethod).toBe('CREDIT_CARD');
      expect(mockPaymentService.findOne).toHaveBeenCalledWith('1');
    });

    it('3. Should verify payment endpoints respond', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/payment/test-payment')
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });
});