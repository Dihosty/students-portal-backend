import { GradeService } from '@application/services/grade/grade.service';
import { UserService } from '@application/services/user/user.service';
import {
  PredictionResponseDto,
  RiskStudentResponseDto,
  WhatIfDto,
  WhatIfResponseDto,
} from '@domain/core';
import { UserRole } from '@domain/core/enums';
import { Grade } from '@domain/entities';
import { Injectable, NotFoundException } from '@nestjs/common';

type RiskLevel = 'SAFE' | 'AT_RISK' | 'CRITICAL';

@Injectable()
export class PredictionService {
  constructor(
    private readonly gradeService: GradeService,
    private readonly userService: UserService,
  ) {}

  async predictStudent(
    studentId: string,
    subjectId: string,
  ): Promise<PredictionResponseDto> {
    const grades = await this.gradeService.findByStudentAndSubject(
      studentId,
      subjectId,
    );

    if (grades.length === 0) {
      throw new NotFoundException(
        'No grades found for this student and subject',
      );
    }

    const sortedScores = this.extractSortedScores(grades);
    const avgAll = this.round(this.calcAverage(sortedScores));
    const avgRecent = this.round(this.calcAverage(sortedScores.slice(-5)));
    const trend = this.round(this.calcTrend(sortedScores));

    const predictedRaw = 0.6 * avgRecent + 0.3 * avgAll + 0.1 * trend;
    const predictedFinalScore = this.round(this.clamp(predictedRaw, 0, 100));
    const confidence = this.calcConfidence(sortedScores.length);
    const riskLevel = this.classifyRisk(predictedFinalScore, trend);

    return {
      studentId,
      subjectId,
      predictedFinalScore,
      confidence,
      riskLevel,
      basedOn: {
        historicalGrades: sortedScores.length,
        avgRecent,
        avgAll,
        trend,
      },
    };
  }

  async findRiskStudents(limit = 10): Promise<RiskStudentResponseDto[]> {
    const users = await this.userService.findAll();
    const students = users.filter((user) => user.role === UserRole.STUDENT);

    const riskCandidates: Array<RiskStudentResponseDto | null> =
      await Promise.all(
        students.map(async (student) => {
          const grades = await this.gradeService.findByStudentId(student.id);
          if (grades.length === 0) {
            return null;
          }

          const scores = this.extractSortedScores(grades);
          const avgScore = this.round(this.calcAverage(scores));
          const trend = this.round(this.calcTrend(scores));
          const riskLevel = this.classifyRisk(avgScore, trend);

          if (riskLevel === 'SAFE') {
            return null;
          }

          return {
            studentId: student.id,
            fullName: student.fullName,
            avgScore,
            trend,
            riskLevel,
            reasons: this.buildRiskReasons(avgScore, trend),
          };
        }),
      );

    const filteredCandidates = riskCandidates.filter(
      (candidate): candidate is RiskStudentResponseDto => candidate !== null,
    );

    return filteredCandidates
      .sort(
        (a, b) =>
          this.riskWeight(b.riskLevel) - this.riskWeight(a.riskLevel) ||
          a.avgScore - b.avgScore,
      )
      .slice(0, Math.max(1, limit));
  }

  async whatIf(dto: WhatIfDto): Promise<WhatIfResponseDto> {
    const grades = await this.gradeService.findByStudentAndSubject(
      dto.studentId,
      dto.subjectId,
    );

    if (grades.length === 0) {
      throw new NotFoundException(
        'No grades found for this student and subject',
      );
    }

    const scores = this.extractSortedScores(grades);
    const currentAvg = this.round(this.calcAverage(scores));

    const hypotheticalScores = [...scores, dto.hypotheticalExamScore];
    const predictedAvg = this.round(this.calcAverage(hypotheticalScores));
    const trend = this.round(this.calcTrend(hypotheticalScores));

    return {
      currentAvg,
      predictedAvg,
      improvement: this.round(predictedAvg - currentAvg),
      newRiskLevel: this.classifyRisk(predictedAvg, trend),
    };
  }

  private extractSortedScores(grades: Grade[]): number[] {
    return grades
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((grade) => Number(grade.score));
  }

  private calcAverage(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  }

  private calcTrend(values: number[]): number {
    if (values.length < 4) {
      return 0;
    }

    const window = Math.min(3, Math.floor(values.length / 2));
    const previous = values.slice(-(window * 2), -window);
    const recent = values.slice(-window);

    return this.calcAverage(recent) - this.calcAverage(previous);
  }

  private calcConfidence(gradesCount: number): number {
    const confidence = Math.min(0.95, 0.35 + gradesCount * 0.08);
    return this.round(confidence);
  }

  private classifyRisk(score: number, trend: number): RiskLevel {
    if (score >= 75 && trend >= 0) {
      return 'SAFE';
    }
    if (score >= 60 && score < 75) {
      return 'AT_RISK';
    }
    if (score < 60 || (score < 70 && trend < -5)) {
      return 'CRITICAL';
    }
    return 'AT_RISK';
  }

  private buildRiskReasons(score: number, trend: number): string[] {
    const reasons: string[] = [];

    if (score < 60) {
      reasons.push('Average score is below 60');
    } else if (score < 75) {
      reasons.push('Average score is between 60 and 75');
    }

    if (trend < -5) {
      reasons.push('Negative grade trend is stronger than -5 points');
    } else if (trend < 0) {
      reasons.push('Negative grade trend detected');
    }

    return reasons.length > 0 ? reasons : ['Risk level requires attention'];
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private riskWeight(riskLevel: RiskLevel): number {
    if (riskLevel === 'CRITICAL') {
      return 3;
    }
    if (riskLevel === 'AT_RISK') {
      return 2;
    }
    return 1;
  }
}
