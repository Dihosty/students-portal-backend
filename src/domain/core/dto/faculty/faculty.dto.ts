import { ApiProperty } from '@nestjs/swagger';

export class FacultyDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Software Engineering' })
  name: string;

  @ApiProperty({ example: '2026-02-15T10:00:00.000Z' })
  createdAt: Date;
}

