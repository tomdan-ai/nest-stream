import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set up Handlebars as the view engine
  app.useStaticAssets('public');
  app.setBaseViewsDir('views');
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
