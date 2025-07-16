import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Url } from './entities/url.entity';
import * as nanoidUtil from '../utils/nanoid.util';

// Mock the nanoid utility
jest.mock('../utils/nanoid.util');
const mockNanoid = nanoidUtil.nanoid as jest.MockedFunction<
  typeof nanoidUtil.nanoid
>;

describe('UrlsService', () => {
  let service: UrlsService;
  let urlRepository: jest.Mocked<Repository<Url>>;
  let configService: jest.Mocked<ConfigService>;

  const mockUrl: Url = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    code: 'abc123',
    targetUrl: 'https://example.com',
    ownerId: 'user-123',
    clickCount: 0,
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
    deletedAt: undefined,
    owner: undefined,
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockConfig = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    urlRepository = module.get(getRepositoryToken(Url));
    configService = module.get(ConfigService);

    // Setup default mocks
    mockNanoid.mockReturnValue('abc123');
    configService.get.mockReturnValue('http://localhost:8080');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('genUniqueCode', () => {
    it('should generate unique code when first code is available', async () => {
      urlRepository.findOne.mockResolvedValueOnce(null);

      const result = await (service as any).genUniqueCode();

      expect(result).toBe('abc123');
      expect(mockNanoid).toHaveBeenCalledTimes(1);
      expect(urlRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'abc123' },
      });
    });

    it('should generate multiple codes until unique one is found', async () => {
      urlRepository.findOne
        .mockResolvedValueOnce(mockUrl) // First code exists
        .mockResolvedValueOnce(null); // Second code is unique

      mockNanoid.mockReturnValueOnce('abc123').mockReturnValueOnce('def456');

      const result = await (service as any).genUniqueCode();

      expect(result).toBe('def456');
      expect(mockNanoid).toHaveBeenCalledTimes(2);
      expect(urlRepository.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('shorten', () => {
    it('should create and save shortened URL', async () => {
      const targetUrl = 'https://example.com/very-long-url';
      urlRepository.findOne.mockResolvedValueOnce(null);
      urlRepository.create.mockReturnValue(mockUrl);
      urlRepository.save.mockResolvedValue(mockUrl);

      const result = await service.shorten(targetUrl);

      expect(urlRepository.create).toHaveBeenCalledWith({
        code: 'abc123',
        targetUrl,
      });
      expect(urlRepository.save).toHaveBeenCalledWith(mockUrl);
      expect(result).toEqual(mockUrl);
    });
  });

  describe('shortenUrl', () => {
    it('should create shortened URL with owner and return full URL', async () => {
      const targetUrl = 'https://example.com/very-long-url';
      const ownerId = 'user-123';

      urlRepository.findOne.mockResolvedValueOnce(null);
      urlRepository.create.mockReturnValue(mockUrl);
      urlRepository.save.mockResolvedValue(mockUrl);

      const result = await service.shortenUrl(targetUrl, ownerId);

      expect(urlRepository.create).toHaveBeenCalledWith({
        code: 'abc123',
        targetUrl,
        ownerId,
      });
      expect(result).toBe('http://localhost:8080/abc123');
    });

    it('should create shortened URL without owner', async () => {
      const targetUrl = 'https://example.com/very-long-url';

      urlRepository.findOne.mockResolvedValueOnce(null);
      urlRepository.create.mockReturnValue({ ...mockUrl, ownerId: undefined });
      urlRepository.save.mockResolvedValue({ ...mockUrl, ownerId: undefined });

      const result = await service.shortenUrl(targetUrl, undefined);

      expect(urlRepository.create).toHaveBeenCalledWith({
        code: 'abc123',
        targetUrl,
        ownerId: undefined,
      });
      expect(result).toBe('http://localhost:8080/abc123');
    });
  });

  describe('findByCode', () => {
    it('should find URL by code', async () => {
      urlRepository.findOne.mockResolvedValue(mockUrl);

      const result = await service.findByCode('abc123');

      expect(urlRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'abc123', deletedAt: undefined },
      });
      expect(result).toEqual(mockUrl);
    });

    it('should throw NotFoundException when URL not found', async () => {
      urlRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCode('nonexistent')).rejects.toThrow(
        new NotFoundException('Short URL not found'),
      );
    });

    it('should throw NotFoundException when URL is soft deleted', async () => {
      urlRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCode('abc123')).rejects.toThrow(
        new NotFoundException('Short URL not found'),
      );

      expect(urlRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'abc123', deletedAt: undefined },
      });
    });
  });

  describe('incrementClickCount', () => {
    it('should increment click count and save URL', async () => {
      const url = { ...mockUrl, clickCount: 5 };
      urlRepository.save.mockResolvedValue({ ...url, clickCount: 6 });

      await service.incrementClickCount(url);

      expect(url.clickCount).toBe(6);
      expect(urlRepository.save).toHaveBeenCalledWith(url);
    });
  });

  describe('getAndCountUrlByCode', () => {
    it('should find URL and increment click count', async () => {
      const url = { ...mockUrl, clickCount: 5 };
      urlRepository.findOne.mockResolvedValue(url);
      urlRepository.save.mockResolvedValue({ ...url, clickCount: 6 });

      const result = await service.getAndCountUrlByCode('abc123');

      expect(urlRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'abc123', deletedAt: undefined },
      });
      expect(result.clickCount).toBe(6);
      expect(urlRepository.save).toHaveBeenCalledWith(url);
    });

    it('should throw NotFoundException when URL not found', async () => {
      urlRepository.findOne.mockResolvedValue(null);

      await expect(service.getAndCountUrlByCode('nonexistent')).rejects.toThrow(
        new NotFoundException('Short URL not found'),
      );
    });
  });

  describe('findByOwner', () => {
    it('should find URLs by owner ID', async () => {
      const urls = [mockUrl, { ...mockUrl, id: 'another-id', code: 'def456' }];
      urlRepository.find.mockResolvedValue(urls);

      const result = await service.findByOwner('user-123');

      expect(urlRepository.find).toHaveBeenCalledWith({
        where: { ownerId: 'user-123', deletedAt: undefined },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(urls);
    });

    it('should return empty array when no URLs found', async () => {
      urlRepository.find.mockResolvedValue([]);

      const result = await service.findByOwner('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('updateForOwner', () => {
    it('should update URL target for owner', async () => {
      const newTargetUrl = 'https://example.com/new-url';
      const updatedUrl = { ...mockUrl, targetUrl: newTargetUrl };

      urlRepository.findOne.mockResolvedValue(mockUrl);
      urlRepository.save.mockResolvedValue(updatedUrl);

      const result = await service.updateForOwner(
        'url-id',
        'user-123',
        newTargetUrl,
      );

      expect(urlRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'url-id', ownerId: 'user-123', deletedAt: undefined },
      });
      expect(urlRepository.save).toHaveBeenCalledWith({
        ...mockUrl,
        targetUrl: newTargetUrl,
      });
      expect(result).toEqual(updatedUrl);
    });

    it('should throw NotFoundException when URL not found or access denied', async () => {
      urlRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateForOwner(
          'url-id',
          'user-123',
          'https://example.com/new-url',
        ),
      ).rejects.toThrow(
        new NotFoundException('URL not found or access denied'),
      );
    });

    it('should throw NotFoundException when URL belongs to different owner', async () => {
      urlRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateForOwner(
          'url-id',
          'different-user',
          'https://example.com/new-url',
        ),
      ).rejects.toThrow(
        new NotFoundException('URL not found or access denied'),
      );
    });
  });

  describe('softRemoveForOwner', () => {
    it('should soft delete URL for owner', async () => {
      urlRepository.softDelete.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });

      await service.softRemoveForOwner('url-id', 'user-123');

      expect(urlRepository.softDelete).toHaveBeenCalledWith({
        id: 'url-id',
        ownerId: 'user-123',
      });
    });

    it('should throw NotFoundException when URL not found or access denied', async () => {
      urlRepository.softDelete.mockResolvedValue({
        affected: 0,
        raw: {},
        generatedMaps: [],
      });

      await expect(
        service.softRemoveForOwner('url-id', 'user-123'),
      ).rejects.toThrow(
        new NotFoundException('URL not found or access denied'),
      );
    });

    it('should throw NotFoundException when URL belongs to different owner', async () => {
      urlRepository.softDelete.mockResolvedValue({
        affected: 0,
        raw: {},
        generatedMaps: [],
      });

      await expect(
        service.softRemoveForOwner('url-id', 'different-user'),
      ).rejects.toThrow(
        new NotFoundException('URL not found or access denied'),
      );
    });
  });
});
