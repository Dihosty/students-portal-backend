import {
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  ValidateIf,
  IsNotEmpty,
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
    description: 'Group ID (required for STUDENT role)',
    example: 'uuid-group-id',
  })
  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsNotEmpty({ message: 'Group ID is required when role is STUDENT' })
  @IsOptional()
  @IsString()
  groupId?: string | null;

  @ApiPropertyOptional({
    description: 'Course year 1-4 (required for STUDENT role)',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsNotEmpty({ message: 'Course year is required when role is STUDENT' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  courseYear?: number | null;

  @ApiPropertyOptional({
    description: 'Faculty (required for STUDENT role)',
    example: 'Software Engineering',
  })
  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsNotEmpty({ message: 'Faculty is required when role is STUDENT' })
  @IsOptional()
  @IsString()
  faculty?: string | null;

  @ApiPropertyOptional({
    description: 'Is user active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
