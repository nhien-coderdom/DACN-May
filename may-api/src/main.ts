import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common/pipes/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });



  // Bật validate DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // loại bỏ field không có trong DTO
      transform: true,       // tự convert kiểu (string -> number)
      forbidNonWhitelisted: true, // nếu gửi field lạ → báo lỗi
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
