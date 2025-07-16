import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    description: 'Unique user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User email (unique)',
    example: 'user@example.com',
    format: 'email',
  })
  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  passwordHash: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Account deletion date (soft delete)',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
    required: false,
  })
  @DeleteDateColumn()
  deletedAt?: Date;
}
