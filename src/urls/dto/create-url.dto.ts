import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'URL to be shortened',
    example: 'https://example.com/my-very-long-url',
    format: 'uri',
  })
  @IsUrl()
  url: string;
}
