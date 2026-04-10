import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'User ID (must be a user with TEACHER role)',
    example: '02ed4391-d8e6-480a-8502-b027434641a0',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Faculty ID',
    example: '02ed4391-d8e6-480a-8502-b027434641a0',
  })
  @IsNotEmpty()
  @IsUUID()
  facultyId: string;
}
