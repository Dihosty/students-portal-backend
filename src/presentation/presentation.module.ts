import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { HealthController, StudentController } from './controllers';

const CONTROLLERS = [HealthController, StudentController];

@Module({
  imports: [ApplicationModule],
  controllers: [...CONTROLLERS],
})
export class PresentationModule {}
