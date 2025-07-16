import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TestDatabaseModule } from './test-database.module';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { UrlsModule } from '../src/urls/urls.module';
import { DocsModule } from '../src/docs/docs.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.test', '.env'],
    }),
    TestDatabaseModule,
    JwtModule.register({
      global: true,
      secret: 'test-jwt-secret',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UsersModule,
    UrlsModule,
    DocsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestAppModule {}
