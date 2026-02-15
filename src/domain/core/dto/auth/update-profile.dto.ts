import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: "User's first name",
    example: 'Max',
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @ApiPropertyOptional({
    description: "User's last name",
    example: 'Verstappen',
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Group ID (for students)',
    example: 'uuid-group-id',
  })
  @IsOptional()
  @IsString({ message: 'Group ID must be a string' })
  groupId?: string;

  @ApiPropertyOptional({
    description: 'Course year (for students)',
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
    description: 'Faculty (for teachers)',
    example: 'Software Engineering',
  })
  @IsOptional()
  @IsString({ message: 'Faculty must be a string' })
  faculty?: string;
}
