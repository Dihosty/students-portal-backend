import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentListItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Student Test' })
  fullName: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174111' })
  groupId?: string;

  @ApiPropertyOptional({ example: 2 })
  courseYear?: number;

  @ApiPropertyOptional({ example: '02ed4391-d8e6-480a-8502-b027434641a0' })
  facultyId?: string;

  @ApiPropertyOptional({ example: 'Software Engineering' })
  facultyName?: string;
}
