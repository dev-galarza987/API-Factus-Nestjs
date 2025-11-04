import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('API Info')
@Controller()
export class ApiController {
  @Get()
  @ApiOperation({
    summary: 'Información de la API',
    description: 'Retorna información general sobre la API-Factus',
  })
  @ApiResponse({
    status: 200,
    description: 'Información de la API',
  })
  getApiInfo() {
    return {
      name: 'API-Factus',
      version: '1.0.0',
      description: 'Sistema de facturación completo construido con NestJS',
      author: 'Galarza',
      endpoints: {
        home: '/home',
        api: '/api/v1',
        swagger: '/api/v1/docs',
        modules: {
          company: '/api/v1/company',
          customer: '/api/v1/customer',
          invoice: '/api/v1/invoice',
          invoiceDetail: '/api/v1/invoice-detail',
          payment: '/api/v1/payment',
        },
      },
      documentation: {
        homepage: 'http://localhost:3000/home',
        swagger: 'http://localhost:3000/api/v1/docs',
      },
      repository: 'https://github.com/dev-galarza987/API-Factus-Nestjs',
      technologies: [
        'NestJS 10.x',
        'TypeORM 0.3.x',
        'PostgreSQL 16.x',
        'TypeScript 5.x',
      ],
      status: 'online',
      timestamp: new Date().toISOString(),
    };
  }
}
