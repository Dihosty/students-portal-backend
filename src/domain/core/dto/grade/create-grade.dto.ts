import { GradeType } from '@domain/core/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Subject ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  @ApiProperty({
    description: 'Teacher ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty()
  @IsUUID()
  teacherId: string;

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
