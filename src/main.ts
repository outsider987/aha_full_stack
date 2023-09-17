import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {AllExceptionFilter} from './exceptions/all-exception.filter';
import * as cookieParser from 'cookie-parser';
// somewhere in your initialization file


/**
 * Boots the NestJS application.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(
      new ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        // exceptionFactory: (errors) => new ValidationException(errors),
      }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
