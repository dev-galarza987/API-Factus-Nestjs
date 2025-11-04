import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

export class TestHelper {
  private static app: INestApplication;
  private static dataSource: DataSource;

  static async initTestApp(): Promise<INestApplication> {
    if (this.app) {
      return this.app;
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();

    // Configurar CORS para tests
    this.app.enableCors({
      origin: true,
      credentials: true,
    });

    // Configurar prefijo global
    this.app.setGlobalPrefix('api/v1', {
      exclude: ['/', 'home'],
    });

    await this.app.init();
    this.dataSource = this.app.get(DataSource);

    return this.app;
  }

  static async cleanDatabase(): Promise<void> {
    if (!this.dataSource) return;

    const entities = this.dataSource.entityMetadatas;

    // Desactivar las restricciones de clave foránea temporalmente (PostgreSQL)
    await this.dataSource.query('SET session_replication_role = replica;');

    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }

    // Reactivar las restricciones de clave foránea
    await this.dataSource.query('SET session_replication_role = DEFAULT;');
  }

  static async closeApp(): Promise<void> {
    if (this.app) {
      await this.app.close();
      this.app = undefined as any;
    }
  }

  static getApp(): INestApplication {
    return this.app;
  }

  static getDataSource(): DataSource {
    return this.dataSource;
  }
}
