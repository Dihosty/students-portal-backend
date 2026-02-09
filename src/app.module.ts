import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from '@application/application.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { PresentationModule } from '@presentation/presentation.module';
import { DATABASE_CONFIG } from '@config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DATABASE_CONFIG],
    }),

    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
  ],
})
export class AppModule {}
