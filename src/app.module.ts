import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsModule } from './urls/urls.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DocsModule } from './docs/docs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),

    DocsModule,
    UrlsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
