import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../enums/user-role.enum';

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
    description: 'Group ID (for students)',
    example: 'uuid-group-id',
  })
  groupId?: string;

  @ApiPropertyOptional({
    description: 'Course year (for students)',
    example: 2,
  })
  courseYear?: number;

  @ApiPropertyOptional({
    description: 'Faculty name (for teachers)',
    example: 'Software Engineering',
  })
  faculty?: string;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Created at',
    example: '2026-02-15T10:00:00.000Z',
  })
  createdAt: Date;
}
