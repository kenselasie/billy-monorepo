import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {

  @Get('health')
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Check if the API is running and healthy'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 12345 },
        version: { type: 'string', example: '1.0.0' }
      }
    }
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0'
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'API root',
    description: 'Get basic API information'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API information',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Billy Backend API' },
        version: { type: 'string', example: '1.0.0' },
        documentation: { type: 'string', example: '/api/docs' }
      }
    }
  })
  getRoot() {
    return {
      message: 'Billy Backend API',
      version: '1.0.0',
      documentation: '/api/docs'
    };
  }
}
