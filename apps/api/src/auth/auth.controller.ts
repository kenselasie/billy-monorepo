import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

import { CreateUserDto, LoginDto } from './dto/register-users.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password, returns JWT token for authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Login successful' },
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                is_active: { type: 'boolean' },
              },
            },
            accessToken: { type: 'string', description: 'JWT access token' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  async login(
    @Body()
    userData: LoginDto,
  ): Promise<{
    message: string;
    data: { user: Partial<User>; accessToken: string };
    success: boolean;
  }> {
    const { email, password } = userData;
    const user = await this.authService.validateUser(email, password);
    const result = await this.authService.login(user);
    return result;
  }

  @Post('register')
  @ApiOperation({
    summary: 'User registration',
    description:
      'Register a new user account. Returns user information and JWT token upon successful registration',
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Registration successful' },
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                is_active: { type: 'boolean' },
              },
            },
            accessToken: { type: 'string', description: 'JWT access token' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or user already exists',
  })
  @ApiResponse({ status: 409, description: 'Conflict - email already in use' })
  async register(
    @Body()
    userData: CreateUserDto,
  ): Promise<{
    message: string;
    data: { user: Partial<User>; accessToken: string };
    success: boolean;
  }> {
    const user = await this.authService.register(userData);
    return user;
  }
}
