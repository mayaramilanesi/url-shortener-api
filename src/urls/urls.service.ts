import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Url } from './entities/url.entity';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  6,
);

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

  async shortenUrl(targetUrl: string): Promise<string> {
    const urlEntity = await this.shorten(targetUrl);
    const base = process.env.BASE_URL || 'http://localhost:3000';
    return `${base}/${urlEntity.code}`;
  }
}
