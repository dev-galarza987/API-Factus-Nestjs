import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CompanyController } from '../src/company/company.controller';
import { CompanyService } from '../src/company/company.service';

// Mock del CompanyService
const mockCompanyService = {
  create: jest.fn().mockResolvedValue({
    id: '1',
    businessName: 'Test Company',
    taxId: '123456789',
    email: 'test@company.com'
  }),
  findAll: jest.fn().mockResolvedValue([
    { id: '1', businessName: 'Test Company 1' },
    { id: '2', businessName: 'Test Company 2' }
  ]),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    businessName: 'Test Company',
    taxId: '123456789',
    email: 'test@company.com'
  }),
  update: jest.fn().mockResolvedValue({
    id: '1',
    businessName: 'Updated Company',
    taxId: '123456789',
    email: 'test@company.com'
  }),
  remove: jest.fn().mockResolvedValue({ message: 'Company deleted successfully' })
};

describe('Company Controller Tests (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
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

  describe('POST /company', () => {
    it('1. Should create a company successfully', async () => {
      const companyData = {
        businessName: 'Test Company',
        taxId: '123456789',
        email: 'test@company.com',
        address: 'Test Address',
        phone: '+591 70123456'
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/company')
        .send(companyData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.businessName).toBe('Test Company');
      expect(mockCompanyService.create).toHaveBeenCalledWith(companyData);
    });

    it('2. Should handle invalid data', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/company')
        .send({})
        .expect(400);
    });
  });

  describe('GET /company', () => {
    it('3. Should get all companies', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/company')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(mockCompanyService.findAll).toHaveBeenCalled();
    });

    it('4. Should get company by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/company/1')
        .expect(200);

      expect(response.body.id).toBe('1');
      expect(response.body.businessName).toBe('Test Company');
      expect(mockCompanyService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('PATCH /company/:id', () => {
    it('5. Should update company successfully', async () => {
      const updateData = { businessName: 'Updated Company' };

      const response = await request(app.getHttpServer())
        .patch('/api/v1/company/1')
        .send(updateData)
        .expect(200);

      expect(response.body.businessName).toBe('Updated Company');
      expect(mockCompanyService.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('DELETE /company/:id', () => {
    it('6. Should delete company successfully', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/company/1')
        .expect(200);

      expect(mockCompanyService.remove).toHaveBeenCalledWith('1');
    });
  });
});