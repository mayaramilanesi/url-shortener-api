import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ShortenResponseDto } from './dto/url-response.dto';

@ApiTags('shorten')
@Controller()
export class ShortenController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('shorten')
  @ApiOperation({
    summary: 'Shorten URL',
    description:
      'Creates a shortened version of a URL. Authentication is optional - URLs created without authentication are anonymous.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    type: CreateUrlDto,
    description: 'URL to be shortened',
  })
  @ApiResponse({
    status: 201,
    description: 'URL shortened successfully',
    type: ShortenResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid URL provided',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['url must be a URL address'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async shorten(
    @Body() dto: CreateUrlDto,
    @Req() req: Request & { user?: { userId: string } },
  ) {
    const ownerId = req.user?.userId || undefined;
    const shortUrl = await this.urlsService.shortenUrl(dto.url, ownerId);
    return { shortUrl };
  }
}
