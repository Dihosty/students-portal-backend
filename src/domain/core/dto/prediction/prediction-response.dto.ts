import { ApiProperty } from '@nestjs/swagger';

export class PredictionBasedOnDto {
  @ApiProperty({ example: 12 })
  historicalGrades: number;

  @ApiProperty({ example: 88.4 })
  avgRecent: number;

  @ApiProperty({ example: 82.1 })
  avgAll: number;

  @ApiProperty({ example: 4.2 })
  trend: number;
}

export class PredictionResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  studentId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  subjectId: string;

  @ApiProperty({ example: 86.7 })
  predictedFinalScore: number;

  @ApiProperty({ example: 0.83 })
  confidence: number;

  @ApiProperty({ enum: ['SAFE', 'AT_RISK', 'CRITICAL'], example: 'SAFE' })
  riskLevel: 'SAFE' | 'AT_RISK' | 'CRITICAL';

  @ApiProperty({ type: PredictionBasedOnDto })
  basedOn: PredictionBasedOnDto;
}
