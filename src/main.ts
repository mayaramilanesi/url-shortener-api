import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT ?? 8080}`;
  const isProduction = process.env.NODE_ENV === 'production';

  const configBuilder = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription(
      'API for URL shortening with authentication and management system',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('urls', 'URL management endpoints')
    .addTag('shorten', 'URL shortening endpoint')
    .addTag('redirect', 'Redirect endpoint')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT token for authentication',
        in: 'header',
      },
      'JWT-auth',
    );

  if (isProduction) {
    configBuilder.addServer(baseUrl, 'Production server');
  } else {
    configBuilder.addServer(baseUrl, 'Development server');
    if (!baseUrl.includes('localhost')) {
      configBuilder.addServer(
        `http://localhost:${process.env.PORT ?? 8080}`,
        'Local development',
      );
    }
  }

  const config = configBuilder.build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'URL Shortener API - Documentation',
  });

  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}
bootstrap();
