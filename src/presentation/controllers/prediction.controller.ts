import { PredictionService } from '@application/services';
import {
  PredictStudentDto,
  PredictionResponseDto,
  RiskStudentResponseDto,
  WhatIfDto,
  WhatIfResponseDto,
  UserRole,
} from '@domain/core';
import { CurrentUser, Roles } from '@presentation/decorators';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Prediction')
@ApiBearerAuth()
@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Predict final score for student in subject' })
  @ApiResponse({
    status: 201,
    description: 'Prediction calculated successfully',
    type: PredictionResponseDto,
  })
  async predictStudent(
    @Param('studentId') studentId: string,
    @Body() dto: PredictStudentDto,
    @CurrentUser() user: any,
  ): Promise<PredictionResponseDto> {
    if (user.role === UserRole.STUDENT && user.id !== studentId) {
      throw new ForbiddenException('Students can predict only their own data');
    }

    return this.predictionService.predictStudent(studentId, dto.subjectId);
  }

  @Get('risk-students')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get students at academic risk(ADMIN/TEACHER)' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Risk students calculated successfully',
    type: [RiskStudentResponseDto],
  })
  async findRiskStudents(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<RiskStudentResponseDto[]> {
    return this.predictionService.findRiskStudents(limit ?? 10);
  }

  @Post('what-if')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Run what-if scenario for hypothetical exam score' })
  @ApiResponse({
    status: 201,
    description: 'What-if scenario calculated successfully',
    type: WhatIfResponseDto,
  })
  async whatIf(
    @Body() dto: WhatIfDto,
    @CurrentUser() user: any,
  ): Promise<WhatIfResponseDto> {
    if (user.role === UserRole.STUDENT && user.id !== dto.studentId) {
      throw new ForbiddenException(
        'Students can run what-if only for themselves',
      );
    }

    return this.predictionService.whatIf(dto);
  }
}
