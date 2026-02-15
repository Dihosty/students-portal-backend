import {
  IUserRepository,
  RegisterDto,
  AuthResponseDto,
  LoginDto,
  UpdateProfileDto,
  ChangePasswordDto,
  UserProfileDto,
} from '@domain/core';
import { User } from '@domain/entities';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = new User(
      undefined,
      registerDto.email,
      hashedPassword,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.role,
      true,
      registerDto.groupId,
      registerDto.courseYear,
      registerDto.faculty,
    );

    const createdUser = await this.userRepository.create(newUser);

    return this.generateAuthResponse(createdUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
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

    return {
      id: user.id!,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      groupId: user.groupId,
      courseYear: user.courseYear,
      faculty: user.faculty,
      isActive: user.isActive,
      createdAt: user.createdAt!,
    };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(userId, updateProfileDto);
    return this.getProfile(userId);
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
    await this.userRepository.update(userId, { password: hashedPassword });

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
