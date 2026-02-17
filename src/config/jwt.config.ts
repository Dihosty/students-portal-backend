import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>(
      'JWT_SECRET',
      'i_dont_know_what_to_put_here',
    ),

    signOptions: {
      expiresIn: configService.get('JWT_EXPIRATION', '24h'),
      algorithm: 'HS256' as const,
    },
  }),
  inject: [ConfigService],
};
