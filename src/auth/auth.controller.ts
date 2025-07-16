import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponseDto, SignupResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account in the system',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: SignupResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'email must be an email',
            'password must be longer than or equal to 6 characters',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email already in use',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Email already in use' },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a user and return a JWT token',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Login credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['email must be an email', 'password must be a string'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
