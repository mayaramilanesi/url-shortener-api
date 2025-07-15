import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Response } from 'express';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get()
  list(@Request() req) {
    return this.urlsService.findByOwner(req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUrlDto, @Request() req) {
    return this.urlsService.updateForOwner(id, req.user.userId, dto.targetUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.urlsService.softRemoveForOwner(id, req.user.userId);
  }
}
