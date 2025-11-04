import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

export class SimpleTestHelper {
  /**
   * Inicializa una aplicación de test básica sin base de datos
   */
  static async initSimpleTestApp(moduleToTest: any): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [moduleToTest],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
  }

  /**
   * Cierra la aplicación de test
   */
  static async closeApp(app: INestApplication): Promise<void> {
    if (app) {
      await app.close();
    }
  }
}
