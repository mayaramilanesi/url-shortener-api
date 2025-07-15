import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller()
export class ShortenController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  async shorten(
    @Body() dto: CreateUrlDto,
    @Req() req: Request & { user?: { userId: string } },
  ) {
    const ownerId = req.user?.userId;
    const shortUrl = await this.urlsService.shortenUrl(dto.url, ownerId);
    return { shortUrl };
  }
}
