import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CreateStudentUseCase, GetStudentsUseCase } from './services';

const SERVICES = [GetStudentsUseCase, CreateStudentUseCase];

@Module({
  imports: [InfrastructureModule],
  providers: [...SERVICES],
  exports: [...SERVICES, InfrastructureModule],
})
export class ApplicationModule {}
