import { GradeService } from '@application/services/grade/grade.service';
import { UserService } from '@application/services/user/user.service';
import {
  AnalyticsDynamicsDto,
  PredictionGradeTypeStatsDto,
  PredictionResponseDto,
  RiskStudentDto,
  RiskStudentsResponseDto,
  ScopeAnalyticsDto,
  StudentAnalyticsDto,
} from '@domain/core';
import { GradeType } from '@domain/core/enums';
import { Grade } from '@domain/entities';
import { Injectable, NotFoundException } from '@nestjs/common';

type RiskLevel = 'SAFE' | 'AT_RISK' | 'CRITICAL';

const GRADE_TYPE_WEIGHTS: Record<GradeType, number> = {
  [GradeType.EXAM]: 1,
  [GradeType.LAB]: 0.8,
  [GradeType.PRACTICE]: 0.6,
};

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

    const sortedGrades = this.sortGrades(grades);
    const rawScores = sortedGrades.map((grade) => Number(grade.score));
    const weightedScores = this.extractWeightedScores(sortedGrades);

    const avgAll = this.round(this.calcAverage(rawScores));
    const avgRecent = this.round(this.calcAverage(rawScores.slice(-5)));
    const weightedAvgAll = this.round(this.calcWeightedAverage(sortedGrades));
    const weightedAvgRecent = this.round(
      this.calcWeightedAverage(sortedGrades.slice(-5)),
    );
    const trend = this.round(this.calcTrend(weightedScores));

    const predictedRaw =
      0.6 * weightedAvgRecent + 0.3 * weightedAvgAll + 0.1 * trend;
    const predictedFinalScore = this.round(this.clamp(predictedRaw, 0, 100));
    const confidence = this.calcConfidence(sortedGrades.length);
    const riskLevel = this.classifyRisk(predictedFinalScore);

    return {
      studentId,
      subjectId,
      predictedFinalScore,
      confidence,
      riskLevel,
      basedOn: {
        historicalGrades: sortedGrades.length,
        avgRecent,
        weightedAvgRecent,
        avgAll,
        weightedAvgAll,
        trend,
        gradeTypeStats: this.buildGradeTypeStats(sortedGrades),
      },
    };
  }

  async analyzeStudent(studentId: string): Promise<StudentAnalyticsDto> {
    const grades = await this.gradeService.findByStudentId(studentId);

    if (grades.length === 0) {
      throw new NotFoundException('No grades found for this student');
    }

    return this.buildStudentAnalytics(studentId, grades);
  }

  async analyzeSubject(subjectId: string): Promise<ScopeAnalyticsDto> {
    const grades = await this.gradeService.findBySubjectId(subjectId);
    return this.buildScopeAnalytics('subject', subjectId, grades);
  }

  async analyzeGroup(groupId: string): Promise<ScopeAnalyticsDto> {
    const students = await this.userService.findStudents();
    const studentIds = new Set(
      students
        .filter((student) => student.groupId === groupId)
        .map((s) => s.id),
    );

    const allGrades = await this.gradeService.findAll();
    const grades = allGrades.filter((grade) => studentIds.has(grade.studentId));

    return this.buildScopeAnalytics('group', groupId, grades, studentIds);
  }

  async analyzeFaculty(facultyId: string): Promise<ScopeAnalyticsDto> {
    const students = await this.userService.findStudents();
    const studentIds = new Set(
      students
        .filter((student) => student.facultyId === facultyId)
        .map((student) => student.id),
    );

    const allGrades = await this.gradeService.findAll();
    const grades = allGrades.filter((grade) => studentIds.has(grade.studentId));

    return this.buildScopeAnalytics('faculty', facultyId, grades, studentIds);
  }

  async listRiskStudents(): Promise<RiskStudentsResponseDto> {
    const students = await this.userService.findStudents();
    const allGrades = await this.gradeService.findAll();

    const gradesByStudent = new Map<string, Grade[]>();
    for (const grade of allGrades) {
      const collection = gradesByStudent.get(grade.studentId) ?? [];
      collection.push(grade);
      gradesByStudent.set(grade.studentId, collection);
    }

    const riskyStudents: RiskStudentDto[] = [];

    for (const student of students) {
      const studentGrades = gradesByStudent.get(student.id) ?? [];
      if (studentGrades.length === 0) {
        continue;
      }

      const prediction = this.buildPredictionFromGrades(studentGrades);
      if (prediction.riskLevel === 'SAFE') {
        continue;
      }

      riskyStudents.push({
        studentId: student.id,
        fullName: student.fullName,
        predictedFinalScore: prediction.predictedFinalScore,
        confidence: prediction.confidence,
        riskLevel: prediction.riskLevel,
        groupId: student.groupId,
        facultyId: student.facultyId,
      });
    }

    const sorted = riskyStudents.sort((a, b) => {
      const severityA = this.riskSeverity(a.riskLevel);
      const severityB = this.riskSeverity(b.riskLevel);
      if (severityA !== severityB) {
        return severityB - severityA;
      }
      return a.predictedFinalScore - b.predictedFinalScore;
    });

    return {
      total: sorted.length,
      items: sorted,
    };
  }

  private sortGrades(grades: Grade[]): Grade[] {
    return grades
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private extractWeightedScores(grades: Grade[]): number[] {
    return this.sortGrades(grades).map((grade) =>
      this.round(Number(grade.score) * this.gradeWeight(grade.type)),
    );
  }

  private calcAverage(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  }

  private calcWeightedAverage(grades: Grade[]): number {
    const values = grades.map((grade) => Number(grade.score));
    const weights = grades.map((grade) => this.gradeWeight(grade.type));
    return this.calcWeightedAverageFromValues(values, weights);
  }

  private calcWeightedAverageFromValues(
    values: number[],
    weights: number[],
  ): number {
    if (values.length === 0 || weights.length === 0) {
      return 0;
    }

    const weightedSum = values.reduce(
      (acc, value, index) => acc + value * (weights[index] ?? 0),
      0,
    );
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

    if (totalWeight === 0) {
      return 0;
    }

    return weightedSum / totalWeight;
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

  private classifyRisk(score: number): RiskLevel {
    if (score < 35) {
      return 'CRITICAL';
    }
    if (score < 60) {
      return 'AT_RISK';
    }
    return 'SAFE';
  }

  private buildGradeTypeStats(grades: Grade[]): PredictionGradeTypeStatsDto {
    const stats: PredictionGradeTypeStatsDto = {
      examCount: 0,
      labCount: 0,
      practiceCount: 0,
      examWeight: GRADE_TYPE_WEIGHTS[GradeType.EXAM],
      labWeight: GRADE_TYPE_WEIGHTS[GradeType.LAB],
      practiceWeight: GRADE_TYPE_WEIGHTS[GradeType.PRACTICE],
    };

    for (const grade of grades) {
      if (grade.type === GradeType.EXAM) {
        stats.examCount += 1;
      } else if (grade.type === GradeType.LAB) {
        stats.labCount += 1;
      } else if (grade.type === GradeType.PRACTICE) {
        stats.practiceCount += 1;
      }
    }

    return stats;
  }

  private gradeWeight(type: GradeType): number {
    return GRADE_TYPE_WEIGHTS[type];
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private buildScopeAnalytics(
    scopeType: 'subject' | 'group' | 'faculty',
    scopeId: string,
    grades: Grade[],
    predefinedStudentIds?: Set<string>,
  ): ScopeAnalyticsDto {
    if (grades.length === 0) {
      throw new NotFoundException('No grades found for this scope');
    }

    const sortedGrades = this.sortGrades(grades);
    const rawScores = sortedGrades.map((grade) => Number(grade.score));
    const weightedScores = this.extractWeightedScores(sortedGrades);
    const dynamics = this.buildDynamics(rawScores);

    const studentIds =
      predefinedStudentIds ?? new Set(grades.map((grade) => grade.studentId));

    const riskStats = this.calculateRiskStatsByStudents(
      grades,
      Array.from(studentIds),
    );

    return {
      scopeType,
      scopeId,
      studentsCount: studentIds.size,
      gradesCount: grades.length,
      averageScore: this.round(this.calcAverage(rawScores)),
      weightedAverageScore: this.round(
        this.calcWeightedAverageFromValues(
          rawScores,
          sortedGrades.map((grade) => this.gradeWeight(grade.type)),
        ),
      ),
      atRiskStudents: riskStats.atRisk,
      criticalStudents: riskStats.critical,
      dynamics: {
        points: dynamics.points,
        trend: this.calcTrendDirection(this.calcTrend(weightedScores)),
      },
    };
  }

  private buildStudentAnalytics(
    studentId: string,
    grades: Grade[],
  ): StudentAnalyticsDto {
    const sortedGrades = this.sortGrades(grades);
    const rawScores = sortedGrades.map((grade) => Number(grade.score));
    const weightedAvg = this.round(this.calcWeightedAverage(sortedGrades));
    const prediction = this.buildPredictionFromGrades(sortedGrades);

    return {
      studentId,
      gradesCount: sortedGrades.length,
      averageScore: this.round(this.calcAverage(rawScores)),
      weightedAverageScore: weightedAvg,
      predictedFinalScore: prediction.predictedFinalScore,
      confidence: prediction.confidence,
      riskLevel: prediction.riskLevel,
      dynamics: this.buildDynamics(rawScores),
    };
  }

  private buildPredictionFromGrades(grades: Grade[]): {
    predictedFinalScore: number;
    confidence: number;
    riskLevel: RiskLevel;
  } {
    const sortedGrades = this.sortGrades(grades);
    const weightedAvgAll = this.calcWeightedAverage(sortedGrades);
    const weightedAvgRecent = this.calcWeightedAverage(sortedGrades.slice(-5));
    const trend = this.calcTrend(this.extractWeightedScores(sortedGrades));

    const predictedRaw =
      0.6 * weightedAvgRecent + 0.3 * weightedAvgAll + 0.1 * trend;
    const predictedFinalScore = this.round(this.clamp(predictedRaw, 0, 100));

    return {
      predictedFinalScore,
      confidence: this.calcConfidence(sortedGrades.length),
      riskLevel: this.classifyRisk(predictedFinalScore),
    };
  }

  private buildDynamics(points: number[]): AnalyticsDynamicsDto {
    const roundedPoints = points.slice(-5).map((point) => this.round(point));
    const trendValue = this.calcTrend(roundedPoints);

    return {
      points: roundedPoints,
      trend: this.calcTrendDirection(trendValue),
    };
  }

  private calcTrendDirection(
    trendValue: number,
  ): 'improving' | 'stable' | 'declining' {
    if (trendValue > 1) {
      return 'improving';
    }
    if (trendValue < -1) {
      return 'declining';
    }
    return 'stable';
  }

  private calculateRiskStatsByStudents(
    grades: Grade[],
    studentIds: string[],
  ): { atRisk: number; critical: number } {
    let atRisk = 0;
    let critical = 0;

    for (const studentId of studentIds) {
      const studentGrades = grades.filter(
        (grade) => grade.studentId === studentId,
      );
      if (studentGrades.length === 0) {
        continue;
      }

      const prediction = this.buildPredictionFromGrades(studentGrades);
      if (prediction.riskLevel === 'CRITICAL') {
        critical += 1;
      } else if (prediction.riskLevel === 'AT_RISK') {
        atRisk += 1;
      }
    }

    return { atRisk, critical };
  }

  private riskSeverity(riskLevel: RiskStudentDto['riskLevel']): number {
    if (riskLevel === 'CRITICAL') {
      return 2;
    }
    if (riskLevel === 'AT_RISK') {
      return 1;
    }
    return 0;
  }
}
