import { ApiProperty } from '@nestjs/swagger';

export class UrlResponseDto {
  @ApiProperty({
    description: 'Unique URL ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Short URL code (6 characters)',
    example: 'abc123',
    maxLength: 6,
    minLength: 6,
  })
  code: string;

  @ApiProperty({
    description: 'Target URL',
    example: 'https://example.com/my-long-url',
    format: 'uri',
  })
  targetUrl: string;

  @ApiProperty({
    description: 'Number of clicks on the URL',
    example: 42,
    minimum: 0,
  })
  clickCount: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Owner ID (if authenticated)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: false,
  })
  ownerId?: string;
}

export class ShortenResponseDto {
  @ApiProperty({
    description: 'Complete shortened URL',
    example: 'http://localhost:8080/abc123',
    format: 'uri',
  })
  shortUrl: string;
}

export class UrlListResponseDto {
  @ApiProperty({
    description: 'List of user URLs',
    type: [UrlResponseDto],
  })
  urls: UrlResponseDto[];
}
