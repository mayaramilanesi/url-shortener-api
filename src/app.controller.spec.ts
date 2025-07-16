import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return health check object', () => {
      const result = appController.getHello();
      expect(result).toEqual({
        message: 'Hello World!',
        status: 'ok',
        timestamp: expect.any(String),
        service: 'URL Shortener API',
        version: '1.0.0',
      });
    });
  });
});
