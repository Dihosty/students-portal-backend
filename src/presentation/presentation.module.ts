import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApplicationModule } from '@application/application.module';
import {
  HealthController,
  AuthController,
  TeacherController,
  SubjectController,
  GroupController,
  GradeController,
  UserController,
} from './controllers';
import { JwtAuthGuard, RolesGuard } from './guards';
import { JwtStrategy } from './strategies';

const CONTROLLERS = [
  HealthController,
  AuthController,
  TeacherController,
  SubjectController,
  GroupController,
  GradeController,
  UserController,
];

const GUARDS = [JwtAuthGuard, RolesGuard];

const STRATEGIES = [JwtStrategy];

@Module({
  imports: [
    ApplicationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [...CONTROLLERS],
  providers: [...GUARDS, ...STRATEGIES],
})
export class PresentationModule {}
