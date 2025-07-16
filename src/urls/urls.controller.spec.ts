import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

describe('UrlsController', () => {
  let controller: UrlsController;
  let urlsService: jest.Mocked<UrlsService>;

  beforeEach(async () => {
    const mockUrlsService = {
      findByOwner: jest.fn(),
      updateForOwner: jest.fn(),
      softRemoveForOwner: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: mockUrlsService,
        },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    urlsService = module.get(UrlsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should call urlsService.findByOwner with correct userId', async () => {
      const mockRequest = { user: { userId: 'test-user-id' } };
      const expectedUrls = [
        {
          id: '1',
          code: 'abc123',
          targetUrl: 'https://example.com',
          clickCount: 5,
          ownerId: 'test-user-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      urlsService.findByOwner.mockResolvedValue(expectedUrls);

      const result = await controller.list(mockRequest);

      expect(urlsService.findByOwner).toHaveBeenCalledWith('test-user-id');
      expect(result).toEqual(expectedUrls);
    });
  });

  describe('update', () => {
    it('should call urlsService.updateForOwner with correct parameters', async () => {
      const mockRequest = { user: { userId: 'test-user-id' } };
      const urlId = 'test-url-id';
      const updateDto = { targetUrl: 'https://updated-url.com' };
      const expectedResult = {
        id: urlId,
        code: 'abc123',
        targetUrl: 'https://updated-url.com',
        clickCount: 5,
        ownerId: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      urlsService.updateForOwner.mockResolvedValue(expectedResult);

      const result = await controller.update(urlId, updateDto, mockRequest);

      expect(urlsService.updateForOwner).toHaveBeenCalledWith(
        urlId,
        'test-user-id',
        updateDto.targetUrl,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call urlsService.softRemoveForOwner with correct parameters', async () => {
      const mockRequest = { user: { userId: 'test-user-id' } };
      const urlId = 'test-url-id';

      urlsService.softRemoveForOwner.mockResolvedValue(undefined);

      await controller.remove(urlId, mockRequest);

      expect(urlsService.softRemoveForOwner).toHaveBeenCalledWith(
        urlId,
        'test-user-id',
      );
    });
  });
});
