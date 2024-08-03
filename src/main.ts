import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('NestJS Example Project');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*'
    }
  });

  /* Http Request Tracking */
  app.use(morgan('combined'));

  /** Setup body parser for request */
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /* Swagger */
  const config = new DocumentBuilder()
    .setTitle('NestJS Example Project')
    .setDescription('API Document support for NextJS Example Project')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  /* Validation */
  app.useGlobalPipes(new ValidationPipe());

  /* Start Service */
  await app.listen(process.env.PORT);

  /* Logging start state */
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
