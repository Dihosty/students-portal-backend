import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    description: 'Group name',
    example: 'ІПЗ-4',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Course year (1-4)',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(4)
  courseYear: number;

  @ApiProperty({
    description: 'Faculty ID (group belongs to faculty)',
    example: '02ed4391-d8e6-480a-8502-b027434641a0',
  })
  @IsNotEmpty()
  @IsUUID()
  facultyId: string;
}
