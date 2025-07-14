import { Body, Controller, Post } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  async shorten(@Body() dto: CreateUrlDto) {
    const shortUrl = await this.urlsService.shortenUrl(dto.url);
    return { shortUrl };
  }
}
