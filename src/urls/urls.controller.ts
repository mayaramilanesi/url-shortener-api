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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UrlResponseDto } from './dto/url-response.dto';

@ApiTags('urls')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get()
  @ApiOperation({
    summary: 'List user URLs',
    description: 'Returns all shortened URLs created by the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user URLs',
    type: [UrlResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  list(@Request() req) {
    return this.urlsService.findByOwner(req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update URL',
    description: "Updates the target URL of a user's shortened URL",
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the URL to be updated',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateUrlDto,
    description: 'New target URL',
  })
  @ApiResponse({
    status: 200,
    description: 'URL updated successfully',
    type: UrlResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['targetUrl must be a URL address'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to update this URL',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'URL not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'URL not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateUrlDto, @Request() req) {
    return this.urlsService.updateForOwner(id, req.user.userId, dto.targetUrl);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete URL',
    description: "Remove a user's shortened URL (soft delete)",
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the URL to be deleted',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'URL deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'URL deleted successfully' },
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to delete this URL',
  })
  @ApiNotFoundResponse({
    description: 'URL not found',
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.urlsService.softRemoveForOwner(id, req.user.userId);
  }
}
