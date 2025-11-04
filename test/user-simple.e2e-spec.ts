import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserController } from '../src/user/user.controller';
import { UserService } from '../src/user/user.service';

// Mock del UserService
const mockUserService = {
  findAll: jest.fn().mockResolvedValue([
    { id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@factus.com', role: 'ADMIN' },
    { id: '2', firstName: 'Company', lastName: 'User', email: 'company@test.com', role: 'COMPANY' }
  ]),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@factus.com',
    role: 'ADMIN'
  }),
};

describe('User Controller Tests (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
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

  describe('GET /user', () => {
    it('1. Should get all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/user')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });

    it('2. Should get user by ID with valid UUID', async () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/user/${validUuid}`)
        .expect(200);

      expect(response.body.id).toBe('1');
      expect(response.body.firstName).toBe('Admin');
      expect(response.body.email).toBe('admin@factus.com');
      expect(mockUserService.findOne).toHaveBeenCalledWith(validUuid);
    });

    it('3. Should handle UUID validation errors', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/user/invalid-uuid')
        .expect(400); // UUID validation should fail
    });
  });
});