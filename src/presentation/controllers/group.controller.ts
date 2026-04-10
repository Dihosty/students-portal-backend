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
import { GroupService } from '@application/services';
import { CreateGroupDto, UpdateGroupDto } from '@domain/core';
import { Roles } from '@presentation/decorators';
import { UserRole } from '@domain/core/enums';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new group (Admin only)' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @ApiQuery({ name: 'courseYear', required: false, type: Number })
  @ApiQuery({ name: 'facultyId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of groups' })
  async findAll(
    @Query('courseYear') courseYear?: number,
    @Query('facultyId') facultyId?: string,
  ) {
    return this.groupService.findAll({
      courseYear: courseYear ? Number(courseYear) : undefined,
      facultyId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: 200, description: 'Group found' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async findById(@Param('id') id: string) {
    return this.groupService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update group (Admin only)' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete group (Admin only)' })
  @ApiResponse({ status: 204, description: 'Group deleted successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async delete(@Param('id') id: string) {
    await this.groupService.delete(id);
  }
}
