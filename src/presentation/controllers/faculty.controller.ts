import { FacultyService } from '@application/services';
import { CreateFacultyDto, FacultyDto, UpdateFacultyDto, UserRole } from '@domain/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@presentation/decorators';

@ApiTags('Faculties')
@ApiBearerAuth()
@Controller('faculties')
@Roles(UserRole.ADMIN)
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @ApiOperation({ summary: 'Create faculty (Admin only)' })
  @ApiResponse({ status: 201, description: 'Faculty created', type: FacultyDto })
  async create(@Body() dto: CreateFacultyDto): Promise<FacultyDto> {
    return this.facultyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all faculties (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of faculties', type: [FacultyDto] })
  async findAll(): Promise<FacultyDto[]> {
    return this.facultyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get faculty by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Faculty details', type: FacultyDto })
  @ApiResponse({ status: 404, description: 'Faculty not found' })
  async findById(@Param('id') id: string): Promise<FacultyDto> {
    return this.facultyService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update faculty (Admin only)' })
  @ApiResponse({ status: 200, description: 'Faculty updated', type: FacultyDto })
  @ApiResponse({ status: 404, description: 'Faculty not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFacultyDto,
  ): Promise<FacultyDto> {
    return this.facultyService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete faculty (Admin only)' })
  @ApiResponse({ status: 204, description: 'Faculty deleted' })
  @ApiResponse({ status: 404, description: 'Faculty not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.facultyService.delete(id);
  }
}

