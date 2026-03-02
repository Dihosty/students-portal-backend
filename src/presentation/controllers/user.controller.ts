import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from '@application/services';
import {
  CreateUserDto,
  UpdateUserDto,
  UserRole,
  UserProfileDto,
} from '@domain/core';
import { Roles } from '../decorators';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new user with any role (Admin only)',
    description: 'Allows admin to create STUDENT, TEACHER, or ADMIN accounts',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserProfileDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserProfileDto],
  })
  async findAll(): Promise<UserProfileDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<UserProfileDto> {
    return this.userService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }

  @Post(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deactivate(@Param('id') id: string): Promise<UserProfileDto> {
    return this.userService.deactivate(id);
  }

  @Post(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activate user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User activated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async activate(@Param('id') id: string): Promise<UserProfileDto> {
    return this.userService.activate(id);
  }
}
