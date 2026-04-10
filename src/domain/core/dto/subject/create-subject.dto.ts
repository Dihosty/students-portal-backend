import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Subject name',
    example: 'Object-Oriented Programming',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Teacher ID',
    example: '02ed4391-d8e6-480a-8502-b027434641a0',
  })
  @IsNotEmpty()
  @IsUUID()
  teacherId: string;
}
