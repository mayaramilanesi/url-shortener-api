import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  userId: string;
}

export class SignupResponseDto extends AuthResponseDto {
  @ApiProperty({
    description: 'Confirmation message',
    example: 'User created successfully',
  })
  message: string;
}
