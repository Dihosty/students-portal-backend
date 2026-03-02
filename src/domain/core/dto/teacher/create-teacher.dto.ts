import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'User ID (must be a user with TEACHER role)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Faculty name',
    example: 'Software Engineering',
  })
  @IsNotEmpty()
  @IsString()
  faculty: string;
}
