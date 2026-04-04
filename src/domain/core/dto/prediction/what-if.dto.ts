import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class WhatIfDto {
  @ApiProperty({
    description: 'Student ID for scenario analysis',
    example: '1dfaf7ff-4907-4f28-ab5f-ddaa45381798',
  })
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Subject ID for scenario analysis',
    example: 'e22d37e9-0b40-4051-be70-3f454700209b',
  })
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  @ApiProperty({
    description: 'Hypothetical exam score',
    example: 95,
    minimum: 0,
    maximum: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  hypotheticalExamScore: number;
}

export class WhatIfResponseDto {
  @ApiProperty({ example: 78.3 })
  currentAvg: number;

  @ApiProperty({ example: 83.6 })
  predictedAvg: number;

  @ApiProperty({ example: 5.3 })
  improvement: number;

  @ApiProperty({ enum: ['SAFE', 'AT_RISK', 'CRITICAL'], example: 'SAFE' })
  newRiskLevel: 'SAFE' | 'AT_RISK' | 'CRITICAL';
}
