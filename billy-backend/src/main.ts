import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  
  // Enable validation pipes globally
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Enhanced Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Billy Backend API')
    .setDescription('Comprehensive E-commerce Backend API with multi-tenant store management, product catalog, user authentication, and more.')
    .setVersion('1.0.0')
    .setContact(
      'API Support',
      'https://github.com/kenselasie/billy-backend',
      'support@billy-backend.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:5001', 'Local Development Server')
    .addServer('https://api.billy-backend.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Users', 'User management and profile operations')
    .addTag('Stores', 'Multi-tenant store management')
    .addTag('Products', 'Product catalog and inventory management')
    .addTag('Categories', 'Product category management')
    .addTag('System', 'System health and information endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Billy Backend API Documentation',
    customCss: `
      .topbar-wrapper { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  });

  const PORT = process.env.PORT || 5001;
  await app.listen(PORT);
  
  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at: http://localhost:${PORT}/api/docs`);
}
bootstrap();
