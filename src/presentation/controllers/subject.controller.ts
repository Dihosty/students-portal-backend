import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubjectService } from '@application/services';
import { CreateSubjectDto, UpdateSubjectDto } from '@domain/core';
import { Roles } from '@presentation/decorators';
import { UserRole } from '@domain/core/enums';

@ApiTags('Subjects')
@ApiBearerAuth()
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new subject (Admin only)' })
  @ApiResponse({ status: 201, description: 'Subject created successfully' })
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subjects' })
  @ApiResponse({ status: 200, description: 'List of all subjects' })
  async findAll() {
    return this.subjectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subject by ID' })
  @ApiResponse({ status: 200, description: 'Subject found' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async findById(@Param('id') id: string) {
    return this.subjectService.findById(id);
  }

  @Get('teacher/:teacherId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get subjects by teacher ID' })
  @ApiResponse({ status: 200, description: 'List of teacher subjects' })
  async findByTeacher(@Param('teacherId') teacherId: string) {
    return this.subjectService.findByTeacherId(teacherId);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update subject (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subject updated successfully' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete subject (Admin only)' })
  @ApiResponse({ status: 204, description: 'Subject deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async delete(@Param('id') id: string) {
    await this.subjectService.delete(id);
  }
}
