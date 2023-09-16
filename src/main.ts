import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

/**
 * Boots the NestJS application.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
