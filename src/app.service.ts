import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'Hello World!',
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'URL Shortener API',
      version: '1.0.0',
    };
  }
}
