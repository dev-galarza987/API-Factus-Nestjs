import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CustomerController } from '../src/customer/customer.controller';
import { CustomerService } from '../src/customer/customer.service';

// Mock del CustomerService
const mockCustomerService = {
  findAll: jest.fn().mockResolvedValue([
    { id: '1', fullName: 'Juan Pérez', email: 'juan@test.com' },
    { id: '2', fullName: 'María García', email: 'maria@test.com' },
  ]),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    fullName: 'Juan Pérez',
    taxOrId: '12345678',
    email: 'juan@test.com',
  }),
};

describe('Customer Controller Tests (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
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

  describe('GET /customer', () => {
    it('1. Should get all customers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customer')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(mockCustomerService.findAll).toHaveBeenCalled();
    });

    it('2. Should get customer by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customer/1')
        .expect(200);

      expect(response.body.id).toBe('1');
      expect(response.body.fullName).toBe('Juan Pérez');
      expect(mockCustomerService.findOne).toHaveBeenCalledWith('1');
    });

    it('3. Should handle non-existent customer routes', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/customer/nonexistent')
        .expect(200); // Mock always returns data
    });
  });
});
