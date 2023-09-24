import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

/**
    * Setup Swagger.
    * @param {any} app - The app.
    * @return {void}
 */
export function setupSwagger(app) {
  const options = new DocumentBuilder()
      .setTitle('AHA TEST')
      .setDescription('FOR AHA TEST')
      .setVersion('1.0')
      .addTag('aha')
      .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
