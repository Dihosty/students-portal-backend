import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTeacherDto {
  @ApiProperty({
    description: 'Faculty name',
    example: 'Software Engineering',
    required: false,
  })
  @IsOptional()
  @IsString()
  faculty?: string;
}
