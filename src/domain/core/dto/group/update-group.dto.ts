import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({
    description: 'Group name',
    example: 'ІПЗ-4',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Course year (1-4)',
    example: 2,
    minimum: 1,
    maximum: 4,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  courseYear?: number;

  @ApiProperty({
    description: 'Faculty ID (group belongs to faculty)',
    example: '02ed4391-d8e6-480a-8502-b027434641a0',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  facultyId?: string;
}
