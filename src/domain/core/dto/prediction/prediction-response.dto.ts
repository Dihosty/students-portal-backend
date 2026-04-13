import { ApiProperty } from '@nestjs/swagger';

export class PredictionGradeTypeStatsDto {
  @ApiProperty({ example: 1 })
  examCount: number;

  @ApiProperty({ example: 8 })
  labCount: number;

  @ApiProperty({ example: 10 })
  practiceCount: number;

  @ApiProperty({ example: 1 })
  examWeight: number;

  @ApiProperty({ example: 0.8 })
  labWeight: number;

  @ApiProperty({ example: 0.6 })
  practiceWeight: number;
}

export class PredictionBasedOnDto {
  @ApiProperty({ example: 12 })
  historicalGrades: number;

  @ApiProperty({ example: 88.4 })
  avgRecent: number;

  @ApiProperty({ example: 89.1 })
  weightedAvgRecent: number;

  @ApiProperty({ example: 82.1 })
  avgAll: number;

  @ApiProperty({ example: 83.6 })
  weightedAvgAll: number;

  @ApiProperty({ example: 4.2 })
  trend: number;

  @ApiProperty({ type: PredictionGradeTypeStatsDto })
  gradeTypeStats: PredictionGradeTypeStatsDto;
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

export class AnalyticsDynamicsDto {
  @ApiProperty({ example: [60, 65, 70, 68, 72] })
  points: number[];

  @ApiProperty({
    enum: ['improving', 'stable', 'declining'],
    example: 'improving',
  })
  trend: 'improving' | 'stable' | 'declining';
}

export class StudentAnalyticsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  studentId: string;

  @ApiProperty({ example: 17 })
  gradesCount: number;

  @ApiProperty({ example: 78.9 })
  averageScore: number;

  @ApiProperty({ example: 80.4 })
  weightedAverageScore: number;

  @ApiProperty({ example: 82.3 })
  predictedFinalScore: number;

  @ApiProperty({ example: 0.87 })
  confidence: number;

  @ApiProperty({ enum: ['SAFE', 'AT_RISK', 'CRITICAL'], example: 'SAFE' })
  riskLevel: 'SAFE' | 'AT_RISK' | 'CRITICAL';

  @ApiProperty({ type: AnalyticsDynamicsDto })
  dynamics: AnalyticsDynamicsDto;
}

export class ScopeAnalyticsDto {
  @ApiProperty({ enum: ['subject', 'group', 'faculty'], example: 'subject' })
  scopeType: 'subject' | 'group' | 'faculty';

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  scopeId: string;

  @ApiProperty({ example: 32 })
  studentsCount: number;

  @ApiProperty({ example: 241 })
  gradesCount: number;

  @ApiProperty({ example: 74.2 })
  averageScore: number;

  @ApiProperty({ example: 75.1 })
  weightedAverageScore: number;

  @ApiProperty({ example: 7 })
  atRiskStudents: number;

  @ApiProperty({ example: 3 })
  criticalStudents: number;

  @ApiProperty({ type: AnalyticsDynamicsDto })
  dynamics: AnalyticsDynamicsDto;
}

export class RiskStudentDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  studentId: string;

  @ApiProperty({ example: 'Іван Петренко' })
  fullName: string;

  @ApiProperty({ example: 52.8 })
  predictedFinalScore: number;

  @ApiProperty({ example: 0.76 })
  confidence: number;

  @ApiProperty({ enum: ['AT_RISK', 'CRITICAL'], example: 'AT_RISK' })
  riskLevel: 'AT_RISK' | 'CRITICAL';

  @ApiProperty({
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174111',
  })
  groupId?: string;

  @ApiProperty({
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174222',
  })
  facultyId?: string;

  @ApiProperty({ required: false, example: 'Faculty of Informatics' })
  facultyName?: string;
}

export class RiskStudentsResponseDto {
  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ type: [RiskStudentDto] })
  items: RiskStudentDto[];
}
