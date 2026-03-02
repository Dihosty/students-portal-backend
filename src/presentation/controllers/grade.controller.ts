import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { GradeService } from '@application/services';
import { CreateGradeDto, UpdateGradeDto } from '@domain/core';
import { Roles, CurrentUser } from '@presentation/decorators';
import { UserRole } from '@domain/core/enums';

@ApiTags('Grades')
@ApiBearerAuth()
@Controller('grades')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post()
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Add new grade (Teacher only)' })
  @ApiResponse({ status: 201, description: 'Grade added successfully' })
  async create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.create(createGradeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get all grades (Admin/Teacher only)' })
  @ApiResponse({ status: 200, description: 'List of all grades' })
  async findAll() {
    return this.gradeService.findAll();
  }

  @Get('my')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get my grades (Student only)' })
  @ApiResponse({ status: 200, description: 'List of student grades' })
  async getMyGrades(@CurrentUser() user: any) {
    return this.gradeService.findByStudentId(user.id);
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get grades by student ID (Admin/Teacher)' })
  @ApiQuery({ name: 'subjectId', required: false })
  @ApiResponse({ status: 200, description: 'List of student grades' })
  async findByStudent(
    @Param('studentId') studentId: string,
    @Query('subjectId') subjectId?: string,
  ) {
    if (subjectId) {
      return this.gradeService.findByStudentAndSubject(studentId, subjectId);
    }
    return this.gradeService.findByStudentId(studentId);
  }

  @Get('subject/:subjectId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get grades by subject ID (Admin/Teacher)' })
  @ApiResponse({ status: 200, description: 'List of subject grades' })
  async findBySubject(@Param('subjectId') subjectId: string) {
    return this.gradeService.findBySubjectId(subjectId);
  }

  @Get('teacher/:teacherId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get grades by teacher ID (Admin/Teacher)' })
  @ApiResponse({ status: 200, description: 'List of teacher grades' })
  async findByTeacher(@Param('teacherId') teacherId: string) {
    return this.gradeService.findByTeacherId(teacherId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get grade by ID' })
  @ApiResponse({ status: 200, description: 'Grade found' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  async findById(@Param('id') id: string) {
    return this.gradeService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update grade (Teacher/Admin)' })
  @ApiResponse({ status: 200, description: 'Grade updated successfully' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
  ) {
    return this.gradeService.update(id, updateGradeDto);
  }

  @Delete(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete grade (Teacher/Admin)' })
  @ApiResponse({ status: 204, description: 'Grade deleted successfully' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  async delete(@Param('id') id: string) {
    await this.gradeService.delete(id);
  }
}
