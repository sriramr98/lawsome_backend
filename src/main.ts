import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './utils/GlobalExceptionFilter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.listen(8000, '0.0.0.0');
}

bootstrap();
