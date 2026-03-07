import { UserRole } from '@domain/core/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'student@university.edu',
  })
  email: string;

  @ApiProperty({
    description: "User's first name",
    example: 'Max',
  })
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Verstappen',
  })
  lastName: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Max Verstappen',
  })
  fullName: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiPropertyOptional({
    description: 'Group ID (required for STUDENT role)',
    example: 'uuid-group-id',
  })
  groupId?: string;

  @ApiPropertyOptional({
    description: 'Course year 1-4 (required for STUDENT role)',
    example: 2,
  })
  courseYear?: number;

  @ApiPropertyOptional({
    description: 'Faculty name (required for STUDENT role)',
    example: 'Software Engineering',
  })
  faculty?: string;

  @ApiProperty({
    description: 'Created at',
    example: '2026-02-15T10:00:00.000Z',
  })
  createdAt: Date;
}
