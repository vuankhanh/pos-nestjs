import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

// import * as fs from 'fs';
// import { join } from 'path';
async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(join(process.cwd(), 'server.key')),
  //   cert: fs.readFileSync(join(process.cwd(), 'server.crt')),
  // };
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  //   httpsOptions
  // });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const staticPath = configService.get('folder.album');

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useStaticAssets(staticPath, {
    prefix: '/static/',
  });
  
  const port = AppModule.port || 3004;
  console.log(`App is running on port ${port}`);
  await app.listen(port);
}
bootstrap();
