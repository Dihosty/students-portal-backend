import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApplicationModule } from '@application/application.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { PresentationModule } from '@presentation/presentation.module';
import { DATABASE_CONFIG } from '@config/database.config';
import { JwtAuthGuard, RolesGuard } from '@presentation/guards';

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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
