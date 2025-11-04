import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import morgan from 'morgan';
import { create } from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 3000;

  // Configurar motor de vistas Handlebars con layouts
  const hbs = create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, '..', 'views', 'layouts'),
    partialsDir: join(__dirname, '..', 'views', 'partials'),
  });

  app.engine('hbs', hbs.engine);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Servir archivos estáticos desde /public
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Configurar prefijo global solo para rutas de API
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'home'], // Excluir la ruta raíz y home del prefijo
  });

  // Configurar Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('API-Factus')
    .setDescription(
      'Sistema completo de facturación con gestión de empresas, clientes, facturas, detalles y pagos',
    )
    .setVersion('1.0.0')
    .addTag('User', 'Gestión de usuarios y autenticación')
    .addTag('Company', 'Gestión de empresas')
    .addTag('Customer', 'Gestión de clientes')
    .addTag('Invoice', 'Gestión de facturas')
    .addTag('Invoice Detail', 'Gestión de detalles de facturas')
    .addTag('Payment', 'Gestión de pagos')
    .addTag('API Info', 'Información general de la API')
    .setContact(
      'Galarza',
      'https://galarza.neocities.org/',
      'dev.galarza987@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://127.0.0.1:4500', 'Servidor de desarrollo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    customSiteTitle: 'API-Factus - Documentación',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
    `,
  });

  app.use(morgan('dev'));
  app.enableCors();

  await app.listen(PORT, () => {
    console.log(`Server listening on http://127.0.0.1:${PORT}`);
    console.log(`Home page: http://127.0.0.1:${PORT}/home`);
    console.log(`API endpoints: http://127.0.0.1:${PORT}/api/v1`);
    console.log(`Swagger docs: http://127.0.0.1:${PORT}/api/v1/docs`);
  });
}
void bootstrap();
