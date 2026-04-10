import { UserService } from '@application/services';
import { StudentListItemDto, UserRole } from '@domain/core';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@presentation/decorators';

@ApiTags('Students')
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({
    summary: 'Get all students (Admin/Teacher)',
    description: 'Returns minimal student list for gradebook/prediction flows',
  })
  @ApiResponse({
    status: 200,
    description: 'List of students',
    type: [StudentListItemDto],
  })
  async findAll(): Promise<StudentListItemDto[]> {
    return this.userService.findStudents();
  }
}

