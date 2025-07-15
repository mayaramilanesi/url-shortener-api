import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UrlsService } from './urls.service';

@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':code')
  async redirect(
    @Param('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const url = await this.urlsService.getAndCountUrlByCode(code);
    return res.redirect(url.targetUrl);
  }
}
