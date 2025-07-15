import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';

@Controller()
export class ShortenController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('shorten')
  async shorten(
    @Body() dto: CreateUrlDto,
    @Req() req: Request & { user?: { userId: string } },
  ) {
    const ownerId = req.user?.userId || undefined;
    const shortUrl = await this.urlsService.shortenUrl(dto.url, ownerId);
    return { shortUrl };
  }
}
