import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptor/transform.interceptor';

async function bootstrap() {

  const logger = new Logger()

  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  app.useGlobalInterceptors(new TransformInterceptor())

  const port = 3000

  await app.listen(port)

  logger.log(`Application listening on port  ${port}`)

}
bootstrap();
