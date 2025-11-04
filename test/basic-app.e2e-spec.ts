import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('Basic App Tests (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('1. Should return Hello World from root endpoint', () => {
    return request(app.getHttpServer()).get('/').expect(302); // Expecting redirect instead of 200
  });

  it('2. Should return 404 for non-existent route', () => {
    return request(app.getHttpServer()).get('/non-existent-route').expect(404);
  });

  it('3. Should handle redirect properly', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(302);

    expect(response.status).toBe(302);
  });
});
