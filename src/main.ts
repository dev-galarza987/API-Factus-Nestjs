import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  app.setGlobalPrefix('api/v1');
  app.use(morgan('dev'));
  app.enableCors();
  await app.listen(PORT, () => {
    console.log(`Server listening on http://127.0.0.1:${PORT}/api/v1`);
  });
}
void bootstrap();
