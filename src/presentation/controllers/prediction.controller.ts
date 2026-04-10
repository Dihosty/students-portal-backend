import { PredictionService } from '@application/services';
import {
  PredictionResponseDto,
  RiskStudentsResponseDto,
  ScopeAnalyticsDto,
  StudentAnalyticsDto,
  UserRole,
} from '@domain/core';
import { CurrentUser, Roles } from '@presentation/decorators';
import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Prediction')
@ApiBearerAuth()
@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Analytics for a specific student' })
  @ApiResponse({
    status: 200,
    description: 'Student analytics calculated successfully',
    type: StudentAnalyticsDto,
  })
  async analyzeStudent(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
    @CurrentUser() user: any,
  ): Promise<StudentAnalyticsDto> {
    if (user.role === UserRole.STUDENT && user.id !== studentId) {
      throw new ForbiddenException(
        'Students can view only their own analytics',
      );
    }

    return this.predictionService.analyzeStudent(studentId);
  }

  @Get('student/:studentId/subject/:subjectId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({
    summary:
      'Student subject analytics + performance prediction (weighted by grade type)',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics calculated successfully',
    type: PredictionResponseDto,
  })
  async analyzeStudentSubject(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
    @Param('subjectId', new ParseUUIDPipe()) subjectId: string,
    @CurrentUser() user: any,
  ): Promise<PredictionResponseDto> {
    if (user.role === UserRole.STUDENT && user.id !== studentId) {
      throw new ForbiddenException('Students can predict only their own data');
    }

    return this.predictionService.predictStudent(studentId, subjectId);
  }

  @Get('subject/:subjectId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Analytics for a specific subject' })
  @ApiResponse({
    status: 200,
    description: 'Subject analytics calculated successfully',
    type: ScopeAnalyticsDto,
  })
  async analyzeSubject(
    @Param('subjectId', new ParseUUIDPipe()) subjectId: string,
  ): Promise<ScopeAnalyticsDto> {
    return this.predictionService.analyzeSubject(subjectId);
  }

  @Get('group/:groupId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Analytics for a specific group' })
  @ApiResponse({
    status: 200,
    description: 'Group analytics calculated successfully',
    type: ScopeAnalyticsDto,
  })
  async analyzeGroup(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
  ): Promise<ScopeAnalyticsDto> {
    return this.predictionService.analyzeGroup(groupId);
  }

  @Get('faculty/:facultyId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Analytics for a specific faculty' })
  @ApiResponse({
    status: 200,
    description: 'Faculty analytics calculated successfully',
    type: ScopeAnalyticsDto,
  })
  async analyzeFaculty(
    @Param('facultyId', new ParseUUIDPipe()) facultyId: string,
  ): Promise<ScopeAnalyticsDto> {
    return this.predictionService.analyzeFaculty(facultyId);
  }

  @Get('risk-students')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get list of at-risk students' })
  @ApiResponse({
    status: 200,
    description: 'At-risk students list returned successfully',
    type: RiskStudentsResponseDto,
  })
  async listRiskStudents(): Promise<RiskStudentsResponseDto> {
    return this.predictionService.listRiskStudents();
  }
}
