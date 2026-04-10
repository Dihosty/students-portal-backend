import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateFacultyDto {
  @ApiProperty({ example: 'Software Engineering' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}

