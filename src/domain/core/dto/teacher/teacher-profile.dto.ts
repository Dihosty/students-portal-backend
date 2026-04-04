import { ApiProperty } from '@nestjs/swagger';

export class TeacherProfileDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174111' })
  userId: string;

  @ApiProperty({ example: 'teacher test' })
  fullName: string;

  @ApiProperty({ example: '02ed4391-d8e6-480a-8502-b027434641a0' })
  facultyId: string;

  @ApiProperty({ example: 'Software Engineering' })
  facultyName: string;

  @ApiProperty({ example: '2026-02-15T10:00:00.000Z' })
  createdAt: Date;
}
