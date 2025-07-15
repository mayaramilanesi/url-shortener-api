import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  async shorten(@Body() dto: CreateUrlDto) {
    const shortUrl = await this.urlsService.shortenUrl(dto.url);
    return { shortUrl };
  }

  @Get(':code')
  async handleRedirect(
    @Param('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const url = await this.urlsService.getAndCountUrlByCode(code);
    res.redirect(url.targetUrl);
  }
}
