import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'urls' })
export class Url {
  @ApiProperty({
    description: 'Unique URL ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Short URL code (6 characters)',
    example: 'abc123',
    maxLength: 6,
    minLength: 6,
  })
  @Column({ length: 6, unique: true })
  code: string;

  @ApiProperty({
    description: 'URL owner ID (if authenticated)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: false,
  })
  @Column({ nullable: true })
  ownerId?: string;

  @ApiProperty({
    description: 'URL owner',
    type: () => User,
    required: false,
  })
  @ManyToOne(() => User, { nullable: true })
  owner?: User;

  @ApiProperty({
    description: 'Original target URL',
    example: 'https://example.com/my-very-long-url',
    format: 'uri',
  })
  @Column()
  targetUrl: string;

  @ApiProperty({
    description: 'Number of clicks on the URL',
    example: 42,
    minimum: 0,
    default: 0,
  })
  @Column({ default: 0 })
  clickCount: number;

  @ApiProperty({
    description: 'URL creation date',
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
    description: 'Deletion date (soft delete)',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
    required: false,
  })
  @DeleteDateColumn()
  deletedAt?: Date;
}
