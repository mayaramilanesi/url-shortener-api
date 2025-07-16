import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns API health status and basic information',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy and running',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Hello World!' },
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        service: { type: 'string', example: 'URL Shortener API' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  getHello(): any {
    return this.appService.getHello();
  }
}
