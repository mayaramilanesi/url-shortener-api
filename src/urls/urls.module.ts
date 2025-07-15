import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Url } from './entities/url.entity';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { ShortenController } from './shorten.controller';
import { RedirectController } from './redirect.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), ConfigModule],
  providers: [UrlsService],
  controllers: [UrlsController, ShortenController, RedirectController],
})
export class UrlsModule {}
