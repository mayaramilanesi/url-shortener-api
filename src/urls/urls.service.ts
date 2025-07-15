import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Url } from './entities/url.entity';
import { nanoid } from '../utils/nanoid.util';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepo: Repository<Url>,
    private readonly config: ConfigService,
  ) {}

  private async genUniqueCode(): Promise<string> {
    let code: string;
    let exists: Url | null;
    do {
      code = nanoid();
      exists = await this.urlRepo.findOne({ where: { code } });
    } while (exists);
    return code;
  }

  async shorten(targetUrl: string): Promise<Url> {
    const code = await this.genUniqueCode();
    const url = this.urlRepo.create({ code, targetUrl });
    return this.urlRepo.save(url);
  }

  async shortenUrl(
    targetUrl: string,
    ownerId: string | undefined,
  ): Promise<string> {
    const code = await this.genUniqueCode();
    const url = this.urlRepo.create({ code, targetUrl, ownerId });
    const saved = await this.urlRepo.save(url);

    const base = this.config.get<string>('BASE_URL')!;
    return `${base}/${saved.code}`;
  }

  async findByCode(code: string): Promise<Url> {
    const url = await this.urlRepo.findOne({
      where: { code, deletedAt: undefined },
    });
    if (!url) throw new NotFoundException('Short URL not found');
    return url;
  }

  async incrementClickCount(url: Url): Promise<void> {
    url.clickCount++;
    await this.urlRepo.save(url);
  }

  async getAndCountUrlByCode(code: string): Promise<Url> {
    const url = await this.findByCode(code);
    url.clickCount++;
    await this.urlRepo.save(url);
    return url;
  }

  async findByOwner(userId: string): Promise<Url[]> {
    return this.urlRepo.find({
      where: { ownerId: userId, deletedAt: undefined },
      order: { createdAt: 'DESC' },
    });
  }

  async updateForOwner(
    id: string,
    userId: string,
    newTargetUrl: string,
  ): Promise<Url> {
    const url = await this.urlRepo.findOne({
      where: { id, ownerId: userId, deletedAt: undefined },
    });
    if (!url) throw new NotFoundException('URL not found or access denied');
    url.targetUrl = newTargetUrl;
    return this.urlRepo.save(url);
  }

  async softRemoveForOwner(id: string, userId: string): Promise<void> {
    const result = await this.urlRepo.softDelete({ id, ownerId: userId });
    if (result.affected === 0) {
      throw new NotFoundException('URL not found or access denied');
    }
  }
}
