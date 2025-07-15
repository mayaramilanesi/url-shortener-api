import { IsUrl } from 'class-validator';

export class UpdateUrlDto {
  @IsUrl()
  targetUrl: string;
}
