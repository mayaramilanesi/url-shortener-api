import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UrlsService } from './urls.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('redirect')
@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':code')
  @ApiOperation({
    summary: 'Redirect to original URL',
    description:
      '⚠️ **THIS ENDPOINT SHOULD NOT BE TESTED IN SWAGGER** ⚠️\n\nRedirects to the original URL using the shortened code and increments the click counter.\n\n**How to use:** Access directly in browser: `http://localhost:8080/{code}`\n\n**Example:** `http://localhost:8080/abc123`',
    deprecated: true,
  })
  @ApiParam({
    name: 'code',
    description: '6-character shortened URL code',
    example: 'abc123',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirecionamento para a URL original',
    headers: {
      Location: {
        description: 'URL de destino',
        schema: {
          type: 'string',
          format: 'uri',
          example: 'https://example.com/target-page',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Code not found or URL was removed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'URL not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async redirect(
    @Param('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const url = await this.urlsService.getAndCountUrlByCode(code);
    return res.redirect(url.targetUrl);
  }
}
