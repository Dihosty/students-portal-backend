import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class PredictStudentDto {
  @ApiProperty({
    description: 'Subject ID for prediction',
    example: 'e22d37e9-0b40-4051-be70-3f454700209b',
  })
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;
}
