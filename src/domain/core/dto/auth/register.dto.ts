import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Public registration DTO - creates STUDENT accounts only
 * For creating ADMIN or TEACHER accounts, use POST /users endpoint (admin-only)
 */
export class RegisterDto {
  @ApiProperty({
    description: 'Student email address',
    example: 'student@university.edu',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'SecurePassword123',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: "Student's first name",
    example: 'Max',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({
    description: "Student's last name",
    example: 'Verstappen',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Group ID (for students)',
    example: 'uuid-group-id',
  })
  @IsOptional()
  @IsString({ message: 'Group ID must be a string' })
  groupId?: string;

  @ApiPropertyOptional({
    description: 'Course year (1-4, for students)',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Course year must be a number' })
  @Min(1, { message: 'Minimum course year is 1' })
  @Max(4, { message: 'Maximum course year is 4' })
  courseYear?: number;

  @ApiPropertyOptional({
    description: "Student's faculty",
    example: 'Software Engineering',
  })
  @IsOptional()
  @IsString({ message: 'Faculty must be a string' })
  faculty?: string;
}
