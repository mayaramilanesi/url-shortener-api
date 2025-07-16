import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Url } from '../src/urls/entities/url.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [User, Url],
      synchronize: true,
      dropSchema: true,
      logging: false,
      extra: {
        // Disable foreign key constraints for tests
        'PRAGMA foreign_keys': 'OFF',
      },
    }),
    TypeOrmModule.forFeature([User, Url]),
  ],
  exports: [TypeOrmModule],
})
export class TestDatabaseModule {}
