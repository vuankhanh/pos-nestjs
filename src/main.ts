import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  
  const port = AppModule.port || 3004;
  console.log(`App is running on port ${port}`);
  await app.listen(port);
}
bootstrap();
