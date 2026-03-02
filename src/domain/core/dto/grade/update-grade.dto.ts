import { GradeType } from '@domain/core/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class UpdateGradeDto {
  @ApiProperty({
    description: 'Score (0-100)',
    example: 85.5,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiProperty({
    description: 'Grade type',
    enum: GradeType,
    example: GradeType.EXAM,
    required: false,
  })
  @IsOptional()
  @IsEnum(GradeType)
  type?: GradeType;

  @ApiProperty({
    description: 'Date of the grade',
    example: '2026-02-22',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
