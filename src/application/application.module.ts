import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { jwtConfig } from '@config/jwt.config';
import {
  AuthService,
  TeacherService,
  SubjectService,
  GroupService,
  GradeService,
  UserService,
  PredictionService,
  FacultyService,
} from './services';

const SERVICES = [
  AuthService,
  TeacherService,
  SubjectService,
  GroupService,
  GradeService,
  UserService,
  PredictionService,
  FacultyService,
];

@Module({
  imports: [InfrastructureModule, JwtModule.registerAsync(jwtConfig)],
  providers: [...SERVICES],
  exports: [...SERVICES, InfrastructureModule, JwtModule],
})
export class ApplicationModule {}
