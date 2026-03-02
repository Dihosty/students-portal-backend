import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../enums/user-role.enum';

/**
 * Admin-only DTO for creating users with any role
 * Field requirements based on role:
 * - STUDENT: requires groupId, courseYear, and faculty
 * - TEACHER: no additional fields needed
 * - ADMIN: no additional fields needed
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@university.edu',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "User's first name",
    example: 'Charles',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Leclerc',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User role (ADMIN, TEACHER, or STUDENT)',
    enum: UserRole,
    example: UserRole.TEACHER,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiPropertyOptional({
    description: 'Group ID - only for STUDENT role',
    example: 'uuid-group-id',
  })
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiPropertyOptional({
    description: 'Course year (1-4) - only for STUDENT role',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  courseYear?: number;

  @ApiPropertyOptional({
    description: 'Faculty - required for STUDENT role',
    example: 'Computer Science',
  })
  @IsOptional()
  @IsString()
  faculty?: string;

  @ApiPropertyOptional({
    description: 'Is user active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
