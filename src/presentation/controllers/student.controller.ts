import {
  GetStudentsUseCase,
  CreateStudentUseCase,
} from '@application/services';
import { CreateStudentDto } from '@domain/core';
import { Student } from '@domain/entities';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(
    private readonly getStudentsUseCase: GetStudentsUseCase,
    private readonly createStudentUseCase: CreateStudentUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  async getAll(): Promise<Student[]> {
    return this.getStudentsUseCase.execute();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  async create(@Body() dto: CreateStudentDto): Promise<Student> {
    return this.createStudentUseCase.execute(dto);
  }
}
