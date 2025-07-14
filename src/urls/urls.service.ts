import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
