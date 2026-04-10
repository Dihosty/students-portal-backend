import {
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateIf,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@domain/core/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@university.edu',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: "User's first name",
    example: 'Charles',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: "User's last name",
    example: 'Leclerc',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Group ID (required when changing to STUDENT role)',
    example: 'uuid-group-id',
  })
  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsNotEmpty({ message: 'Group ID is required when role is STUDENT' })
  @ValidateIf((o) => o.groupId !== undefined && o.groupId !== null)
  @IsString()
  groupId?: string | null;

  @ApiPropertyOptional({
    description: 'Course year 1-4 (required when changing to STUDENT role)',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsNotEmpty({ message: 'Course year is required when role is STUDENT' })
  @ValidateIf((o) => o.courseYear !== undefined && o.courseYear !== null)
  @IsNumber()
  @Min(1)
  @Max(4)
  courseYear?: number | null;

  @ApiPropertyOptional({
    description: 'Faculty ID (required when changing to STUDENT role)',
    example: '02ed4391-d8e6-480a-8502-b027434641a0',
  })
  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsNotEmpty({ message: 'Faculty ID is required when role is STUDENT' })
  @ValidateIf((o) => o.facultyId !== undefined && o.facultyId !== null)
  @IsUUID()
  facultyId?: string | null;
}
