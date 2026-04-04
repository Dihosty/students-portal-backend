import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateTeacherDto {
  @ApiProperty({
    description: 'Faculty ID',
    example: '02ed4391-d8e6-480a-8502-b027434641a0',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  facultyId?: string;
}
