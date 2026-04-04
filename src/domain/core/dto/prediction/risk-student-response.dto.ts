import { ApiProperty } from '@nestjs/swagger';

export class RiskStudentResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  studentId: string;

  @ApiProperty({ example: 'Іван Петренко' })
  fullName: string;

  @ApiProperty({ example: 58.5 })
  avgScore: number;

  @ApiProperty({ example: -7.2 })
  trend: number;

  @ApiProperty({ enum: ['SAFE', 'AT_RISK', 'CRITICAL'], example: 'CRITICAL' })
  riskLevel: 'SAFE' | 'AT_RISK' | 'CRITICAL';

  @ApiProperty({ type: [String] })
  reasons: string[];
}
