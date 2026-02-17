import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApplicationModule } from '@application/application.module';
import { HealthController, AuthController } from './controllers';
import { JwtAuthGuard, RolesGuard } from './guards';
import { JwtStrategy } from './strategies';

const CONTROLLERS = [HealthController, AuthController];

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
