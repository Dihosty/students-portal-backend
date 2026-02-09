import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Max' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Max' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'max@test.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
