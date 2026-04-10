import {
  IUserRepository,
  IFacultyRepository,
  AuthResponseDto,
  LoginDto,
  ChangePasswordDto,
  UserProfileDto,
} from '@domain/core';
import { User } from '@domain/entities';
import {
  Injectable,
  UnauthorizedException,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IFacultyRepository)
    private readonly facultyRepository: IFacultyRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong email or password');
    }

    return this.generateAuthResponse(user);
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const facultyName = user.facultyId
      ? (await this.facultyRepository.findById(user.facultyId))?.name
      : undefined;

    return {
      id: user.id!,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      groupId: user.groupId,
      courseYear: user.courseYear,
      facultyId: user.facultyId,
      facultyName,
      createdAt: user.createdAt!,
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    const updatedUser = new User(
      user.id,
      user.email,
      hashedPassword,
      user.firstName,
      user.lastName,
      user.role,
      user.groupId,
      user.courseYear,
      user.facultyId,
      user.createdAt,
      user.updatedAt,
    );

    await this.userRepository.update(userId, updatedUser);

    return { message: 'Password changed successfully' };
  }

  private generateAuthResponse(user: User): AuthResponseDto {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      userId: user.id!,
      email: user.email,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }
}
