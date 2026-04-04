import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateFacultyDto {
  @ApiPropertyOptional({ example: 'Software Engineering' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}

