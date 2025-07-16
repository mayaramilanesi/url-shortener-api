import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty({
    description: 'New target URL',
    example: 'https://example.com/new-target-url',
    format: 'uri',
  })
  @IsUrl()
  targetUrl: string;
}
