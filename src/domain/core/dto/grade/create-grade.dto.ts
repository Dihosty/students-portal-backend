import { GradeType } from '@domain/core/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({
    description: 'Student ID',
    example: '1dfaf7ff-4907-4f28-ab5f-ddaa45381798',
  })
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Subject ID',
    example: 'db947f1c-14bd-49da-88c0-aeac00358ba6',
  })
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  @ApiPropertyOptional({
    description:
      'Teacher ID (required for ADMIN; ignored/auto-set for TEACHER role)',
    example: 'a087a6ee-0497-4a47-bacf-e3138ee5175a',
  })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({
    description: 'Score (0-100)',
    example: 85.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({
    description: 'Grade type',
    enum: GradeType,
    example: GradeType.EXAM,
  })
  @IsNotEmpty()
  @IsEnum(GradeType)
  type: GradeType;

  @ApiProperty({
    description: 'Date of the grade',
    example: '2026-02-22',
    type: String,
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
